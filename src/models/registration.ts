export namespace Registration {
  export interface Options {
    type: string;
    headerText: string;
    description: string;
  }

  export type RegisterFunction<TCredentials = any,TResult = any> = (credentials: any) => TResult | PromiseLike<TResult>;

  export type IsRegisteredFunction = () => boolean | PromiseLike<boolean>;

  export interface Controller {
    register: RegisterFunction;
    isRegistered: IsRegisteredFunction;
  }
}
