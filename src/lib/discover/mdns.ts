import * as bonjour from 'bonjour';
import { Observable } from 'rxjs';

const MDNS_NAME = 'neeo';

export function getMdnsStream(networkInterface: any) {
  return Observable.create((observer) => {
    bonjour({ interface: networkInterface }).find({ type: MDNS_NAME }, (service) => {
      observer.next(service);
    });
  });
}
