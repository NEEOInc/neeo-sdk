import axios from 'axios';
import { asyncScheduler, from, TimeoutError } from 'rxjs';
import config from '../config';
import * as mdns from './mdns';

import { catchError, concatMap, filter, first, map, timeout } from 'rxjs/operators';
import { coerce, satisfies, SemVer } from 'semver';

const DEFAULT_LOOKUP_DURATION_MS = config.brainLookupDurationMs;

export function findFirstBrain(
  networkInterface: any,
  lookupDurationMs = DEFAULT_LOOKUP_DURATION_MS,
  scheduler = asyncScheduler
) {
  return mdns.getMdnsStream(networkInterface).pipe(
    timeout(lookupDurationMs, scheduler),
    filter(isValidBrainService),
    filter(hasAddress),
    concatMap(getBrainWithValidVersionStream),
    first(),
    catchError((error) => {
      if (error instanceof TimeoutError) {
        throw new Error(`No Brain found after ${DEFAULT_LOOKUP_DURATION_MS}ms!`);
      }

      throw error;
    })
  );
}

function isValidBrainService(service) {
  return service && service.txt;
}

function hasAddress(service) {
  const serviceHasAnyAddress = service.addresses.length > 0;

  if (!serviceHasAnyAddress) {
    // tslint:disable-next-line:no-console
    console.warn(
      `The Brain ${
        service.name
      } has been skipped from the lookup because it does not have any address`
    );
  }

  return serviceHasAnyAddress;
}

function getBrainWithValidVersionStream(service: any) {
  const systemInfoUrl = getBrainSystemInfoUrl(service);
  const stream$ = from(axios.get(systemInfoUrl));

  return stream$.pipe(
    map((response) => response.data.firmwareVersion),
    filter((version) => isSatisfied({ name: service.name, version })),
    map(() => service)
  );
}

function getBrainSystemInfoUrl(service) {
  return `http://${service.addresses[0]}:${service.port}/systeminfo`;
}

function isSatisfied({ name, version }) {
  const { brainVersionSatisfaction } = config;

  const versionSatisfied = satisfies(coerce(version) as SemVer | string, brainVersionSatisfaction);

  if (!versionSatisfied) {
    // tslint:disable-next-line:no-console
    console.warn(
      `The Brain ${name} has been skipped from the lookup because its firmware version does not satisfy ${brainVersionSatisfaction}`
    );
  }

  return versionSatisfied;
}
