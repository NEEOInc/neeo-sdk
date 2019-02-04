import * as Models from '../../models';
export declare function isRegistered(isRegisteredHandler: Models.Registration.IsRegisteredFunction): any;
export declare function register<TUserData = any>(registrationHandler: Models.Registration.RegisterFunction<TUserData>, userData: TUserData): any;
