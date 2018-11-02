import * as Debug from 'debug';
import * as Models from '../models';
import * as ComponentFactory from './componentFactory';

const debug = Debug('neeo:device:DeviceCapability');

const CAPABILITY_DYNAMIC_DEVICE = 'dynamicDevice';
const CAPABILITIES_REQUIRING_DISCOVERY = [
  'bridgeDevice',
  'addAnotherDevice',
  'register-user-account',
];

export default function(deviceBuilder: Models.DeviceBuilder) {
  if (!deviceBuilder || typeof deviceBuilder !== 'object') {
    throw new Error('INVALID_PARAMETERS');
  }

  const emptyObject = Object.keys(deviceBuilder).length === 0;
  if (emptyObject) {
    throw new Error('EMPTY_OBJECT');
  }

  const {
    buttons,
    sliders,
    switches,
    textLabels,
    imageUrls,
    sensors,
    deviceCapabilities,
    devicename,
    deviceSubscriptionHandlers,
    directories,
    discovery,
    registration,
    deviceidentifier,
    buttonHandler,
  } = deviceBuilder;
  const capabilities = [] as Models.Component[];

  const pathPrefix = `/device/${deviceidentifier}/`;

  const isUniquePath = (path: string) =>
    undefined === capabilities.find((element) => element.path === path);

  const handlers = new Map<string, Models.CapabilityHandler>();

  // TODO: Type controller
  function addCapability(capability: Models.Component, controller: any) {
    const { type, path, name } = capability;
    debug('register capability', devicename, type, path);

    if (isUniquePath(path)) {
      capabilities.push(capability);
      handlers.set(decodeURIComponent(name), {
        componenttype: type,
        controller,
      });

      return;
    }

    debug('path is not unique', name, type, path);
    throw new Error(`DUPLICATE_PATH_DETECTED: ${capability.name}`);
  }

  function addRouteHandler(capability: Models.Component, controller: any) {
    const { type, path, name } = capability;
    debug('register route', type, path);

    if (isUniquePath(path)) {
      handlers.set(decodeURIComponent(name), {
        componenttype: type,
        controller,
      });

      return;
    }

    debug('path is not unique', name, type, path);
    throw new Error(`DUPLICATE_PATH_DETECTED: ${capability.name}`);
  }

  buttons.forEach(({ param }) =>
    addCapability(
      ComponentFactory.buildButton(pathPrefix, param),
      buttonHandler!.bind(undefined, param.name)
    )
  );

  sliders.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildSensor(pathPrefix, {
        ...param,
        type: ComponentFactory.SENSOR_TYPE_RANGE,
      }),
      controller
    );
    addCapability(ComponentFactory.buildRangeSlider(pathPrefix, param), controller);
  });

  switches.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildSensor(pathPrefix, {
        ...param,
        type: ComponentFactory.SENSOR_TYPE_BINARY,
      }),
      controller
    );
    addCapability(ComponentFactory.buildSwitch(pathPrefix, param), controller);
  });

  textLabels.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildSensor(pathPrefix, {
        name: param.name,
        label: param.label,
        type: ComponentFactory.SENSOR_TYPE_STRING,
      }),
      controller
    );
    addCapability(ComponentFactory.buildTextLabel(pathPrefix, param), controller);
  });

  imageUrls.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildSensor(pathPrefix, {
        name: param.name,
        label: param.label,
        type: ComponentFactory.SENSOR_TYPE_STRING,
      }),
      controller
    );
    addCapability(ComponentFactory.buildImageUrl(pathPrefix, param), controller);
  });

  directories.forEach(({ param, controller }) => {
    addCapability(ComponentFactory.buildDirectory(pathPrefix, param), controller);
  });

  sensors.forEach(({ param, controller }) =>
    addCapability(ComponentFactory.buildSensor(pathPrefix, param), controller)
  );

  let noDiscovery = true;

  discovery.forEach(({ controller }) => {
    addRouteHandler(ComponentFactory.buildDiscovery(pathPrefix), controller);
    noDiscovery = false;
  });

  const discoveryRequired = CAPABILITIES_REQUIRING_DISCOVERY.some((capability) =>
    deviceCapabilities.includes(capability)
  );

  const isDynamicDevice = deviceBuilder.deviceCapabilities.includes(CAPABILITY_DYNAMIC_DEVICE);

  if (discoveryRequired && noDiscovery && !isDynamicDevice) {
    const discoveryRequiredFor = CAPABILITIES_REQUIRING_DISCOVERY.join(', ');
    throw new Error('DISCOVERY_REQUIRED ' + discoveryRequiredFor + ' require discovery');
  }

  registration.forEach(({ controller }) => {
    addRouteHandler(ComponentFactory.buildRegister(pathPrefix), controller);
  });

  if (deviceSubscriptionHandlers) {
    addRouteHandler(
      ComponentFactory.buildDeviceSubscription(pathPrefix),
      deviceSubscriptionHandlers
    );
  }

  return {
    capabilities,
    handlers,
  };
}
