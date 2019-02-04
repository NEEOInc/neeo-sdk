export type DeviceStaticCapability =
  | 'addAnotherDevice'
  | 'alwaysOn'
  | 'bridgeDevice'
  | 'dynamicDevice'
  | 'groupVolume';

export type DeviceDynamicCapability =
  | 'customFavoriteHandler'
  | 'register-user-account';

export type DeviceCapability =
  | DeviceStaticCapability
  | DeviceDynamicCapability;
