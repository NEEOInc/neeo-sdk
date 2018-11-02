import { ButtonHandler } from './buttonHandler';
import { ButtonDescriptor } from './descriptors/buttonDescriptor';
import { DirectoryDescriptor } from './descriptors/directoryDescriptor';
import { ImageDescriptor } from './descriptors/imageDescriptor';
import { SensorDescriptor } from './descriptors/sensorDescriptor';
import { SliderDescriptor } from './descriptors/sliderDescriptor';
import { SwitchDescriptor } from './descriptors/switchDescriptor';
import { TextLabelDescriptor } from './descriptors/textLabelDescriptor';
import { DeviceAdapterModel } from './deviceAdapter';
import { DeviceSetup } from './deviceSetup';
import { DeviceSubscriptionHandler } from './deviceSubscriptionHandler';
import { DeviceTypes } from './deviceTypes';
import { DiscoveryResult } from './discoveryResult';
import { InitialiseFunction } from './initialiseFunction';
import { Registration } from './registration';
import { SubscriptionFunction } from './subscriptionFunction';
import { TimingSpecifier } from './timingSpecifier';
export interface DeviceBuilder {
    readonly manufacturer: string;
    readonly deviceidentifier: string;
    readonly directories: Array<{
        param: DirectoryDescriptor;
        controller: DirectoryDescriptor.Controller;
    }>;
    readonly buttons: ReadonlyArray<{
        param: ButtonDescriptor;
    }>;
    readonly discovery: ReadonlyArray<{
        controller: DiscoveryResult.Controller;
    }>;
    readonly switches: ReadonlyArray<{
        param: SwitchDescriptor;
        controller: SwitchDescriptor.Controller;
    }>;
    readonly sliders: ReadonlyArray<{
        param: SliderDescriptor;
        controller: SliderDescriptor.Controller;
    }>;
    readonly textLabels: ReadonlyArray<{
        param: TextLabelDescriptor;
        controller: {
            getter: TextLabelDescriptor.Controller;
        };
    }>;
    readonly sensors: ReadonlyArray<{
        param: SensorDescriptor;
        controller: SensorDescriptor.Controller;
    }>;
    readonly imageUrls: ReadonlyArray<{
        param: ImageDescriptor;
        controller: {
            getter: ImageDescriptor.Controller;
        };
    }>;
    readonly hasPowerStateSensor: boolean;
    readonly additionalSearchTokens: ReadonlyArray<string>;
    readonly deviceCapabilities: ReadonlyArray<string>;
    readonly devicename: string;
    readonly type: DeviceTypes;
    readonly setup: DeviceSetup;
    readonly buttonHandler?: ButtonHandler;
    readonly deviceSubscriptionHandlers?: DeviceSubscriptionHandler.Controller;
    readonly registration: any[];
    readonly driverVersion?: number;
    setManufacturer(manufacturer?: string): this;
    setDriverVersion(version: number): this;
    setType(type: DeviceTypes): this;
    setIcon(icon: 'sonos'): this;
    setSpecificName(value: string): this;
    addAdditionalSearchToken(token: string): this;
    build(adapterName: string): DeviceAdapterModel;
    enableDiscovery(configuration: {
        headerText: string;
        description: string;
        enableDynamicDeviceBuilder: boolean;
    }, controller: DiscoveryResult.Controller): this;
    supportsTiming(): boolean;
    defineTiming(deviceTiming: TimingSpecifier): this;
    registerSubscriptionFunction(controller: SubscriptionFunction): this;
    registerInitialiseFunction(controller: InitialiseFunction): this;
    addButton(button: ButtonDescriptor): this;
    addButtonGroup(groupName: string): this;
    addButtonHandler(handler: ButtonHandler): this;
    addSlider(param: SliderDescriptor, controller: SliderDescriptor.Controller): this;
    addSensor(param: SensorDescriptor, controller: SensorDescriptor.Controller): this;
    addPowerStateSensor(controller: SensorDescriptor.PowerStateController): this;
    addSwitch(param: SwitchDescriptor, controller: SwitchDescriptor.Controller): this;
    addTextLabel(param: TextLabelDescriptor, controller: TextLabelDescriptor.Controller): this;
    addImageUrl(param: ImageDescriptor, controller: ImageDescriptor.Controller): this;
    addDirectory(configuration: DirectoryDescriptor, controller: DirectoryDescriptor.Controller): this;
    addCapability(capability: 'alwaysOn' | 'bridgeDevice' | 'dynamicDevice' | 'addAnotherDevice'): this;
    enableRegistration(options: Registration.Options, controller: Registration.Controller): this;
    registerDeviceSubscriptionHandler(controller: DeviceSubscriptionHandler.Controller): this;
}
