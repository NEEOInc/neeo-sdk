import * as Debug from 'debug';
import * as Models from '../../models';

const debug = Debug('neeo:device:express:route:handler:registration');

export function isRegistered(
  isRegisteredHandler: Models.Registration.IsRegisteredFunction
) {
  return Promise.resolve(isRegisteredHandler()).then(registered => {
    debug('isRegistered', registered);
    return { registered };
  });
}

export function register<TUserData = any>(
  registrationHandler: Models.Registration.RegisterFunction<TUserData>,
  userData: TUserData
) {
  return Promise.resolve(registrationHandler(userData)).then(result => {
    debug('Register result', result);
    return result;
  });
}
