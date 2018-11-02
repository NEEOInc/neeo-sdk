export declare namespace Registration {
    interface Options {
        type: string;
        headerText: string;
        description: string;
    }
    type RegisterFunction<TCredentials = any, TResult = any> = (credentials: any) => TResult | PromiseLike<TResult>;
    type IsRegisteredFunction = () => boolean | PromiseLike<boolean>;
    interface Controller {
        register: RegisterFunction;
        isRegistered: IsRegisteredFunction;
    }
}
