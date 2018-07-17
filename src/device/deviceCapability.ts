import * as Debug from 'debug';
import * as Models from '../models';
import * as ComponentFactory from './componentFactory';

const debug = Debug('neeo:device:DeviceCapability');

export default function(
  deviceBuilder: Models.DeviceBuilder,
  adapterName: string
) {
  if (!deviceBuilder || typeof adapterName !== 'string') {
    throw new Error('INVALID_PARAMETERS');
  }
  const {
    buttons,
    sliders,
    switches,
    textLabels,
    imageUrls,
    sensors,
    discovery,
    deviceIdentifier,
    buttonHandler
  } = deviceBuilder;
  const capabilities = [] as Models.Component[];
  const isUniquePath = (text: string) =>
    capabilities.every(({ path }) => path !== text);
  const handlers = new Map<string, Models.CapabilityHandler>();

  function addCapability(
    capability: Models.Component,
    controller: Function | { getter: Function }
  ) {
    const { type, path, name } = capability;
    debug('register capability', type, path, controller);
    if (!isUniquePath(path)) {
      debug('path is not unique', name, type, path);
      throw new Error(`DUPLICATE_PATH_DETECTED: ${name}`);
    }
    capabilities.push(capability);
    handlers.set(decodeURIComponent(name), { componentType: type, controller });
  }

  const pathPrefix = ComponentFactory.buildPathPrefix(
    adapterName,
    deviceIdentifier
  );

  buttons.forEach(({ param }) =>
    addCapability(
      ComponentFactory.buildButton(pathPrefix, param),
      buttonHandler!.bind(undefined, param.name)
    )
  );

  sliders.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildRangeSliderSensor(pathPrefix, param),
      controller
    );
    addCapability(
      ComponentFactory.buildRangeSlider(pathPrefix, param),
      controller
    );
  });

  switches.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildSwitchSensor(pathPrefix, param),
      controller
    );
    addCapability(ComponentFactory.buildSwitch(pathPrefix, param), controller);
  });

  textLabels.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildCustomSensor(pathPrefix, param),
      controller
    );
    addCapability(
      ComponentFactory.buildTextLabel(pathPrefix, param),
      controller
    );
  });

  imageUrls.forEach(({ param, controller }) => {
    addCapability(
      ComponentFactory.buildCustomSensor(pathPrefix, param),
      controller
    );
    addCapability(
      ComponentFactory.buildImageUrl(pathPrefix, param),
      controller
    );
  });

  sensors.forEach(({ param, controller }) =>
    addCapability(ComponentFactory.buildSensor(pathPrefix, param), controller)
  );

  discovery.forEach(({ controller }) => {
    const { type, path, name } = ComponentFactory.buildDiscovery(pathPrefix);
    debug('register route', type, path);
    if (!isUniquePath(path)) {
      debug('path is not unique', name, type, path);
      throw new Error(`DUPLICATE_PATH_DETECTED: ${name}`);
    }
    handlers.set(decodeURIComponent(name), { componentType: type, controller });
  });

  return {
    capabilities,
    handlers
  };
}
