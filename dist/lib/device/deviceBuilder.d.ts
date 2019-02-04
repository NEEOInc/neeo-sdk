import * as Models from '../models';
export declare class DeviceBuilder implements Models.DeviceBuilder {
    readonly buttons: Array<{
        param: Models.ButtonDescriptor;
    }>;
    readonly deviceidentifier: string;
    readonly sensors: Array<{
        param: Models.Sensor.Descriptor;
        controller: Models.Sensor.Controller;
    }>;
    readonly discovery: Array<{
        controller: Models.Discovery.Controller;
    }>;
    readonly sliders: Array<{
        param: Models.Slider.Descriptor;
        controller: Models.Slider.Controller;
    }>;
    readonly switches: Array<{
        param: Models.Descriptor;
        controller: Models.Switch.Controller;
    }>;
    readonly textLabels: Array<{
        param: Models.TextLabel.Descriptor;
        controller: {
            getter: Models.TextLabel.Controller;
        };
    }>;
    readonly imageUrls: Array<{
        param: Models.Image.Descriptor;
        controller: {
            getter: Models.Image.Controller;
        };
    }>;
    readonly directories: Array<{
        param: Models.Directory.Descriptor;
        controller: Models.Directory.Controller;
    }>;
    readonly registration: any[];
    readonly additionalSearchTokens: string[];
    readonly deviceCapabilities: Models.DeviceCapability[];
    readonly devicename: string;
    buttonHandler?: Models.ButtonHandler;
    hasPowerStateSensor: boolean;
    manufacturer: string;
    type: Models.DeviceType;
    setup: Models.DeviceSetup;
    deviceSubscriptionHandlers?: Models.DeviceSubscriptionHandler.Controller;
    favoritesHandler?: Models.FavoritesHandler.Controller;
    driverVersion?: number;
    private icon?;
    private initializeFunction?;
    private subscriptionFunction?;
    private specificname?;
    private timing?;
    private validatePlayerWidget?;
    constructor(name: string, uniqueString?: string);
    setManufacturer(manufacturer?: string): this;
    setDriverVersion(version: number): this;
    setType(type?: string): this;
    setIcon(iconName: any): this;
    setSpecificName(specificname?: string): this;
    addAdditionalSearchToken(token: string): this;
    build(): Models.DeviceAdapterModel;
    enableDiscovery(options: Models.Discovery.Options, controller: Models.Discovery.Controller): this;
    supportsTiming(): boolean;
    supportsFavorites(): boolean;
    defineTiming(param: Models.TimingSpecifier): this;
    registerSubscriptionFunction(controller: Models.Subscription.Controller): this;
    registerInitialiseFunction(controller: Models.InitialiseFunction): this;
    registerDeviceSubscriptionHandler(controller: Models.DeviceSubscriptionHandler.Controller): this;
    registerFavoriteHandlers(controller: Models.FavoritesHandler.Controller): this;
    addButton(param: Models.ButtonDescriptor): this;
    addButtonGroup(groupName: string): this;
    addButtonHandler(controller: Models.ButtonHandler): this;
    enableRegistration(options: Models.Registration.Options, controller: Models.Registration.Controller): this;
    addSlider(param: Models.Slider.Descriptor, controller: Models.Slider.Controller): this;
    addSensor(param: Models.Sensor.Descriptor, controller: Models.Sensor.Controller): this;
    addPowerStateSensor(controller: Models.Sensor.PowerStateController): this;
    addSwitch(param: Models.Descriptor, controller: Models.Switch.Controller): this;
    addTextLabel(param: Models.TextLabel.Descriptor, getter: Models.TextLabel.Controller): this;
    addImageUrl(param: Models.Image.Descriptor, getter: Models.Image.Controller): this;
    addDirectory(param: Models.Directory.Descriptor, controller: Models.Directory.Controller): this;
    addQueueDirectory(params: Models.Directory.Descriptor, controller: Models.Directory.Controller): this;
    addRootDirectory(params: Models.Directory.Descriptor, controller: Models.Directory.Controller): this;
    addCapability(capability: Models.DeviceStaticCapability): this;
    addPlayerWidget(handler: Models.PlayerWidget.Controller): this;
    addButtonHander(controller: Models.ButtonHandler): void;
    private checkDirectoryRole;
}
