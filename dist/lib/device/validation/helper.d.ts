declare function ValidateWrapper(this: any, ...args: any[]): void;
declare namespace ValidateWrapper {
    function isInteger(this: any, ...args: any[]): void;
    function isArray(this: any, ...args: any[]): void;
    function isString(this: any, ...args: any[]): void;
}
export default ValidateWrapper;
