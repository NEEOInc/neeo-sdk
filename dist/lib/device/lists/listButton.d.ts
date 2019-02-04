import * as Models from '../../models';
export declare class ListButton {
    readonly isButton: boolean;
    readonly title?: string;
    readonly iconName?: 'shuffle' | 'repeat';
    readonly inverse?: boolean;
    readonly actionIdentifier?: string;
    constructor(params: Models.ListButtonParameters);
}
