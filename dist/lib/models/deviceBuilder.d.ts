import { ButtonHandler } from './buttonHandler';
import { ButtonDescriptor, Descriptor, DeviceSubscriptionHandler, Directory, Discovery, FavoritesHandler, Image, PlayerWidget, Registration, Sensor, Slider, Subscription, Switch, TextLabel } from './descriptors';
import { DeviceAdapterModel } from './deviceAdapter';
import { DeviceCapability } from './deviceCapability';
import { DeviceSetup } from './deviceSetup';
import { DeviceType } from './deviceType';
import { InitialiseFunction } from './initialiseFunction';
import { TimingSpecifier } from './timingSpecifier';
export interface DeviceBuilder {
    readonly manufacturer: string;
    readonly deviceidentifier: string;
    readonly directories: Array<{
        param: Directory.Descriptor;
        controller: Directory.Controller;
    }>;
    readonly buttons: ReadonlyArray<{
        param: ButtonDescriptor;
    }>;
    readonly discovery: ReadonlyArray<{
        controller: Discovery.Controller;
    }>;
    readonly switches: ReadonlyArray<{
        param: Descriptor;
        controller: Switch.Controller;
    }>;
    readonly sliders: ReadonlyArray<{
        param: Slider.Descriptor;
        controller: Slider.Controller;
    }>;
    readonly textLabels: ReadonlyArray<{
        param: TextLabel.Descriptor;
        controller: {
            getter: TextLabel.Controller;
        };
    }>;
    readonly sensors: ReadonlyArray<{
        param: Sensor.Descriptor;
        controller: Sensor.Controller;
    }>;
    readonly imageUrls: ReadonlyArray<{
        param: Image.Descriptor;
        controller: {
            getter: Image.Controller;
        };
    }>;
    readonly hasPowerStateSensor: boolean;
    readonly additionalSearchTokens: ReadonlyArray<string>;
    readonly deviceCapabilities: ReadonlyArray<DeviceCapability>;
    readonly devicename: string;
    readonly type: DeviceType;
    readonly setup: DeviceSetup;
    readonly buttonHandler?: ButtonHandler;
    readonly deviceSubscriptionHandlers?: DeviceSubscriptionHandler.Controller;
    readonly favoritesHandler?: FavoritesHandler.Controller;
    readonly registration: any[];
    readonly driverVersion?: number;
    setManufacturer(manufacturer?: string): this;
    setDriverVersion(version: number): this;
    setType(type: DeviceType): this;
    setIcon(icon: 'sonos'): this;
    setSpecificName(value: string): this;
    addAdditionalSearchToken(token: string): this;
    build(adapterName: string): DeviceAdapterModel;
    enableDiscovery(configuration: {
        headerText: string;
        description: string;
        enableDynamicDeviceBuilder: boolean;
    }, controller: Discovery.Controller): this;
    supportsTiming(): boolean;
    supportsFavorites(): boolean;
    defineTiming(deviceTiming: TimingSpecifier): this;
    registerSubscriptionFunction(controller: Subscription.Controller): this;
    registerInitialiseFunction(controller: InitialiseFunction): this;
    addButton(button: ButtonDescriptor): this;
    addButtonGroup(groupName: string): this;
    addButtonHandler(handler: ButtonHandler): this;
    addSlider(param: Slider.Descriptor, controller: Slider.Controller): this;
    addSensor(param: Sensor.Descriptor, controller: Sensor.Controller): this;
    addPowerStateSensor(controller: Sensor.PowerStateController): this;
    addSwitch(param: Descriptor, controller: Switch.Controller): this;
    addTextLabel(param: TextLabel.Descriptor, controller: TextLabel.Controller): this;
    addImageUrl(param: Image.Descriptor, controller: Image.Controller): this;
    addDirectory(configuration: Directory.Descriptor, controller: Directory.Controller): this;
    addQueueDirectory(configuration: Directory.Descriptor, controller: Directory.Controller): this;
    addRootDirectory(configuration: Directory.Descriptor, controller: Directory.Controller): this;
    addCapability(capability: 'alwaysOn' | 'bridgeDevice' | 'dynamicDevice' | 'addAnotherDevice'): this;
    addPlayerWidget(handler: PlayerWidget.Controller): this;
    enableRegistration(options: Registration.Options, controller: Registration.Controller): this;
    registerDeviceSubscriptionHandler(controller: DeviceSubscriptionHandler.Controller): this;
    registerFavoriteHandlers(controller: FavoritesHandler.Controller): this;
}
