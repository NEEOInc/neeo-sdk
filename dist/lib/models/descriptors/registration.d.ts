export interface Options {
    type: string;
    headerText: string;
    description: string;
}
export declare type RegisterFunction<TCredentials = any, TResult = any> = (credentials: any) => TResult | PromiseLike<TResult>;
export declare type IsRegisteredFunction = () => boolean | PromiseLike<boolean>;
export interface Controller {
    register: RegisterFunction;
    isRegistered: IsRegisteredFunction;
}
