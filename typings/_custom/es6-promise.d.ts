declare class Promise<T> {
  constructor (fn: (resolve: T | Promise<T>, reject: any) => any);

  then (fn: (value: T) => any): Promise<any>;
  catch (fn: (value: any) => any): Promise<any>;

  static reject(reason: any): Promise<any>;
  static resolve<T>(value: T): Promise<T>;
}

declare module 'es6-promise' {
  var p: typeof Promise;

  module ES6Promise {
    export var Promise: typeof p;

    export function polyfill(): void;
  }

  export = ES6Promise;
}
