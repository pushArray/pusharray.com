import * as utils from './string';

export function Getter(target: any, key: string): void {
  let getter = () => this[key];
  Object.defineProperty(target, utils.trimUnderscores(key), {
    get: getter,
    enumerable: true,
    configurable: true
  });
}

export function Setter(target: any, key: string): void {
  let setter = (val: any) => {
    this[key] = val;
  };
  Object.defineProperty(target, utils.trimUnderscores(key), {
    set: setter,
    enumerable: true,
    configurable: true
  });
}
