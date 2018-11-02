import * as Models from '../../models';
export declare function validateItemParams(params: any): any;
export declare function validateRow<T>(definitions: ReadonlyArray<T>, type: 'tiles' | 'buttons'): void;
export declare function validateLimit(limit?: number): number;
export declare function validateList(list: Models.ListBuilder): void;
export declare function validateThumbnail(thumbnail?: string): void;
export declare function validateButton(params: {
    title?: string;
    iconName?: 'shuffle' | 'repeat' | undefined;
}): void;
export declare function validateButtonIcon(iconName: 'shuffle' | 'repeat' | undefined): "shuffle" | "repeat" | undefined;
export declare function validateUIAction(action?: string): string | undefined;
