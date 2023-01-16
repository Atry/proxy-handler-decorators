/* eslint-disable @typescript-eslint/ban-types */
/**
 * Class decorators for proxy handlers.
 *
 * [![npm package][npm-img]][npm-url]
 * [![Build Status][build-img]][build-url]
 * [![Downloads][downloads-img]][downloads-url]
 * [![Issues][issues-img]][issues-url]
 * [![Code Coverage][codecov-img]][codecov-url]
 * [![Commitizen Friendly][commitizen-img]][commitizen-url]
 * [![Semantic Release][semantic-release-img]][semantic-release-url]
 *
 * [build-img]:https://github.com/Atry/proxy-handler-decorators/actions/workflows/release.yml/badge.svg
 * [build-url]:https://github.com/Atry/proxy-handler-decorators/actions/workflows/release.yml
 * [downloads-img]:https://img.shields.io/npm/dt/proxy-handler-decorators
 * [downloads-url]:https://www.npmtrends.com/proxy-handler-decorators
 * [npm-img]:https://img.shields.io/npm/v/proxy-handler-decorators
 * [npm-url]:https://www.npmjs.com/package/proxy-handler-decorators
 * [issues-img]:https://img.shields.io/github/issues/Atry/proxy-handler-decorators
 * [issues-url]:https://github.com/Atry/proxy-handler-decorators/issues
 * [codecov-img]:https://codecov.io/gh/Atry/proxy-handler-decorators/branch/main/graph/badge.svg
 * [codecov-url]:https://codecov.io/gh/Atry/proxy-handler-decorators
 * [semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
 * [semantic-release-url]:https://github.com/semantic-release/semantic-release
 * [commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
 * [commitizen-url]:http://commitizen.github.io/cz-cli/
 *
 * @example
 * ```typescript doctest
 * import {
 *   getTarget,
 *   AllowGetTarget,
 *   Mapped,
 *   DefaultToPrimitive,
 *   DefaultToStringTag,
 *   TargetAsThis,
 * } from 'proxy-handler-decorators';
 * import { DefaultProxyHandler } from 'default-proxy-handler/lib/index';
 *
 * let counter = 0;
 * function addBang(words: string[]): string[] {
 *   counter++;
 *   return words.map((word) => `${word}!`);
 * }
 *
 * @AllowGetTarget
 * @Mapped<string[]>(addBang)
 * @DefaultToPrimitive
 * @DefaultToStringTag
 * @TargetAsThis
 * class MappedProxyHandler extends DefaultProxyHandler<string[]> {}
 * const mappedProxyHandler = new MappedProxyHandler();
 *
 * const proxy = new Proxy(['hello', 'world'], mappedProxyHandler);
 * expect(counter).toBe(0);
 * expect(proxy).toEqual(['hello!', 'world!']);
 * expect(counter).toBeGreaterThan(0);
 *
 * counter = 0;
 * expect(proxy).toEqual(['hello!', 'world!']);
 * expect(counter).toBeGreaterThan(0);
 *
 * expect(getTarget(proxy)).toEqual(['hello', 'world']);
 * ```
 *
 * @module
 */

import { DecorateAll } from 'decorate-all';

/**
 * A decorator to bind `this` to the proxy target for all instance methods on
 * the proxy.
 */
export function TargetAsThis<
  T extends object,
  SuperClass extends {
    new (...args: any[]): ProxyHandler<T>;
  }
>(superClass: SuperClass): SuperClass {
  return class TargetAsThis extends superClass {
    override get(target: T, p: string | symbol, receiver: any) {
      const property: unknown = (super.get ?? Reflect.get)(target, p, receiver);
      if (typeof property === 'function') {
        const wrappedFunction = function (
          this: any,
          ...argArray: any[]
        ): unknown {
          return Reflect.apply(
            property,
            this === receiver ? target : this,
            argArray
          );
        };
        Object.defineProperty(wrappedFunction, 'name', {
          value: property.name,
          writable: false,
        });
        return wrappedFunction;
      } else {
        return property;
      }
    }
  };
}

/**
 * A decorator to add a default implementation of `[Symbol.toPrimitive]` method
 * to the proxy.
 */
export function DefaultToPrimitive<
  T extends object,
  SuperClass extends {
    new (...args: any[]): ProxyHandler<T>;
  }
>(superClass: SuperClass): SuperClass {
  return class DefaultToPrimitive extends superClass {
    override get(target: T, p: string | symbol, receiver: any) {
      const property: unknown = (super.get ?? Reflect.get)(target, p, receiver);
      if (property === undefined) {
        switch (p) {
          case Symbol.toPrimitive:
            return (hint: 'string' | 'number' | 'default') => {
              switch (hint) {
                case 'string':
                  return String(target);
                case 'number':
                  return Number(target);
                case 'default':
                  return target.valueOf();
              }
            };
          default:
            return property;
        }
      } else {
        return property;
      }
    }
  };
}

/**
 * A decorator to add a default implementation of `[Symbol.toStringTag]` method
 * to the proxy.
 */
export function DefaultToStringTag<
  T extends object,
  SuperClass extends {
    new (...args: any[]): ProxyHandler<T>;
  }
>(superClass: SuperClass): SuperClass {
  return class DefaultToStringTag extends superClass {
    override get(target: T, p: string | symbol, receiver: any) {
      const property: unknown = (super.get ?? Reflect.get)(target, p, receiver);
      if (property === undefined) {
        switch (p) {
          case Symbol.toStringTag: {
            const prototype: undefined | Record<any, unknown> =
              Object.getPrototypeOf(target);
            const constructor: unknown = prototype?.constructor;
            if (typeof constructor === 'function') {
              return constructor.name;
            } else {
              return;
            }
          }
          default:
            return property;
        }
      } else {
        return property;
      }
    }
  };
}

const getTargetSymbol = Symbol();

/**
 * Returns the proxy target if `proxy` is a proxy and its proxy handler has the
 * {@link AllowGetTarget} decorator, or `undefined` otherwise.
 */
export function getTarget<T>(maybeProxy: T): T | undefined {
  return (maybeProxy as { [getTargetSymbol]?: T })[getTargetSymbol];
}

/**
 * The decorator to enable {@link getTarget} function.
 */
export function AllowGetTarget<
  T extends object,
  SuperClass extends {
    new (...args: any[]): ProxyHandler<T>;
  }
>(superClass: SuperClass): SuperClass {
  return class AllowGetTarget extends superClass {
    override get(target: T, p: string | symbol, receiver: any) {
      switch (p) {
        case getTargetSymbol:
          return target;
        default:
          return (super.get ?? Reflect.get)(target, p, receiver) as unknown;
      }
    }
  };
}

export function Mapped<T extends object>(
  mapper: (from: T) => T
): (proxyHandlerConstructor: {
  new (...args: any[]): ProxyHandler<T>;
}) => void {
  return DecorateAll(
    (
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>
    ) => {
      if (Object.prototype.hasOwnProperty.call(Reflect, propertyKey)) {
        const originalValue: (target: T, ...restAugments: any[]) => unknown =
          descriptor.value;
        descriptor.value = (target: T, ...restAugments: any[]) =>
          originalValue(mapper(target), ...restAugments);
      }
    },
    { deep: true }
  );
}
