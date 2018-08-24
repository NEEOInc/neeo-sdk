'use strict';

const config = require('../config');
const mdns = require('./mdns');
const axios = require('axios');
const { asyncScheduler, from } = require('rxjs');
const { TimeoutError } = require('rxjs');

const {
  catchError,
  filter,
  first,
  map,
  concatMap,
  timeout,
} = require('rxjs/operators');
const { coerce, satisfies } = require('semver');

module.exports = { findFirstBrain };

const DEFAULT_LOOKUP_DURATION_MS = config.brainLookupDurationMs;

function findFirstBrain(
  networkInterface,
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
        throw new Error(
          `No Brain found after ${DEFAULT_LOOKUP_DURATION_MS}ms!`
        );
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
    console.warn(
      `The Brain ${
        service.name
      } has been skipped from the lookup because it does not have any address`
    );
  }

  return serviceHasAnyAddress;
}

function getBrainWithValidVersionStream(service) {
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

  const versionSatisfied = satisfies(coerce(version), brainVersionSatisfaction);

  if (!versionSatisfied) {
    console.warn(
      `The Brain ${name} has been skipped from the lookup because its firmware version does not satisfy ${brainVersionSatisfaction}`
    );
  }

  return versionSatisfied;
}
