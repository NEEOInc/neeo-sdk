export interface MessageModel {
    type?: string;
    data?: any;
    raw?: boolean;
    value?: string | number | boolean;
    uniqueDeviceId?: string;
    component?: string;
}
