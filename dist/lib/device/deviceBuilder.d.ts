import * as Models from '../models';
export declare class DeviceBuilder implements Models.DeviceBuilder {
    readonly buttons: Array<{
        param: Models.ButtonDescriptor;
    }>;
    readonly deviceidentifier: string;
    readonly sensors: Array<{
        param: Models.SensorDescriptor;
        controller: Models.SensorDescriptor.Controller;
    }>;
    readonly discovery: Array<{
        controller: Models.DiscoveryResult.Controller;
    }>;
    readonly sliders: Array<{
        param: Models.SliderDescriptor;
        controller: Models.SliderDescriptor.Controller;
    }>;
    readonly switches: Array<{
        param: Models.SwitchDescriptor;
        controller: Models.SwitchDescriptor.Controller;
    }>;
    readonly textLabels: Array<{
        param: Models.TextLabelDescriptor;
        controller: {
            getter: Models.TextLabelDescriptor.Controller;
        };
    }>;
    readonly imageUrls: Array<{
        param: Models.ImageDescriptor;
        controller: {
            getter: Models.ImageDescriptor.Controller;
        };
    }>;
    readonly directories: Array<{
        param: Models.DirectoryDescriptor;
        controller: Models.DirectoryDescriptor.Controller;
    }>;
    readonly registration: any[];
    readonly additionalSearchTokens: string[];
    readonly deviceCapabilities: string[];
    readonly devicename: string;
    buttonHandler?: Models.ButtonHandler;
    hasPowerStateSensor: boolean;
    manufacturer: string;
    type: Models.DeviceTypes;
    setup: Models.DeviceSetup;
    deviceSubscriptionHandlers?: Models.DeviceSubscriptionHandler.Controller;
    driverVersion?: number;
    private icon?;
    private initializeFunction?;
    private subscriptionFunction?;
    private specificname?;
    private timing?;
    constructor(name: string, uniqueString?: string);
    setManufacturer(manufacturer?: string): this;
    setDriverVersion(version: number): this;
    setType(type?: string): this;
    setIcon(iconName: any): this;
    setSpecificName(specificname?: string): this;
    addAdditionalSearchToken(token: string): this;
    build(): Models.DeviceAdapterModel;
    enableDiscovery(options: {
        headerText?: string;
        description?: string;
        enableDynamicDeviceBuilder?: boolean;
    }, controller: Models.DiscoveryResult.Controller): this;
    supportsTiming(): boolean;
    defineTiming(param: Models.TimingSpecifier): this;
    registerSubscriptionFunction(controller: Models.SubscriptionFunction): this;
    registerInitialiseFunction(controller: Models.InitialiseFunction): this;
    registerDeviceSubscriptionHandler(controller: Models.DeviceSubscriptionHandler.Controller): this;
    addButton(param: Models.ButtonDescriptor): this;
    addButtonGroup(groupName: string): this;
    addButtonHandler(controller: Models.ButtonHandler): this;
    enableRegistration(options: Models.Registration.Options, controller: Models.Registration.Controller): this;
    addSlider(param: Models.SliderDescriptor, controller: Models.SliderDescriptor.Controller): this;
    addSensor(param: Models.SensorDescriptor, controller: Models.SensorDescriptor.Controller): this;
    addPowerStateSensor(controller: Models.SensorDescriptor.PowerStateController): this;
    addSwitch(param: Models.SwitchDescriptor, controller: Models.SwitchDescriptor.Controller): this;
    addTextLabel(param: Models.TextLabelDescriptor, controller: Models.TextLabelDescriptor.Controller): this;
    addImageUrl(param: Models.ImageDescriptor, controller: Models.ImageDescriptor.Controller): this;
    addDirectory(param: Models.DirectoryDescriptor, controller: Models.DirectoryDescriptor.Controller): this;
    addCapability(capability: string): this;
    addButtonHander(controller: Models.ButtonHandler): void;
    private checkDirectoryRole;
}
