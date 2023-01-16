<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [proxy-handler-decorators](#proxy-handler-decorators)
  - [Functions](#functions)
    - [AllowGetTarget](#allowgettarget)
    - [DefaultToPrimitive](#defaulttoprimitive)
    - [DefaultToStringTag](#defaulttostringtag)
    - [Mapped](#mapped)
    - [TargetAsThis](#targetasthis)
    - [getTarget](#gettarget)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<a name="readmemd"></a>

# proxy-handler-decorators

Class decorators for proxy handlers.

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

[build-img]:https://github.com/Atry/tail-call-proxy/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/Atry/tail-call-proxy/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/tail-call-proxy
[downloads-url]:https://www.npmtrends.com/tail-call-proxy
[npm-img]:https://img.shields.io/npm/v/tail-call-proxy
[npm-url]:https://www.npmjs.com/package/tail-call-proxy
[issues-img]:https://img.shields.io/github/issues/Atry/tail-call-proxy
[issues-url]:https://github.com/Atry/tail-call-proxy/issues
[codecov-img]:https://codecov.io/gh/Atry/tail-call-proxy/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/Atry/tail-call-proxy
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/

**`Example`**

```typescript doctest
import {
  getTarget,
  AllowGetTarget,
  Mapped,
  DefaultToPrimitive,
  DefaultToStringTag,
  TargetAsThis,
} from 'proxy-handler-decorators';
import { DefaultProxyHandler } from 'default-proxy-handler/lib/index';

let counter = 0;
function addBang(words: string[]): string[] {
  counter++;
  return words.map((word) => `${word}!`);
}

@AllowGetTarget
@Mapped<string[]>(addBang)
@DefaultToPrimitive
@DefaultToStringTag
@TargetAsThis
class MappedProxyHandler extends DefaultProxyHandler<string[]> {}
const mappedProxyHandler = new MappedProxyHandler();

const proxy = new Proxy(['hello', 'world'], mappedProxyHandler);
expect(counter).toBe(0);
expect(proxy).toEqual(['hello!', 'world!']);
expect(counter).toBeGreaterThan(0);

counter = 0;
expect(proxy).toEqual(['hello!', 'world!']);
expect(counter).toBeGreaterThan(0);

expect(getTarget(proxy)).toEqual(['hello', 'world']);
```

## Functions

### AllowGetTarget

▸ **AllowGetTarget**<`T`, `SuperClass`\>(`superClass`): `SuperClass`

The decorator to enable [getTarget](#gettarget) function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `SuperClass` | extends (...`args`: `any`[]) => `ProxyHandler`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `superClass` | `SuperClass` |

#### Returns

`SuperClass`

#### Defined in

[index.ts:191](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L191)

___

### DefaultToPrimitive

▸ **DefaultToPrimitive**<`T`, `SuperClass`\>(`superClass`): `SuperClass`

A decorator to add a default implementation of `[Symbol.toPrimitive]` method
to the proxy.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `SuperClass` | extends (...`args`: `any`[]) => `ProxyHandler`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `superClass` | `SuperClass` |

#### Returns

`SuperClass`

#### Defined in

[index.ts:111](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L111)

___

### DefaultToStringTag

▸ **DefaultToStringTag**<`T`, `SuperClass`\>(`superClass`): `SuperClass`

A decorator to add a default implementation of `[Symbol.toStringTag]` method
to the proxy.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `SuperClass` | extends (...`args`: `any`[]) => `ProxyHandler`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `superClass` | `SuperClass` |

#### Returns

`SuperClass`

#### Defined in

[index.ts:147](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L147)

___

### Mapped

▸ **Mapped**<`T`\>(`mapper`): (`proxyHandlerConstructor`: (...`args`: `any`[]) => `ProxyHandler`<`T`\>) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapper` | (`from`: `T`) => `T` |

#### Returns

`fn`

▸ (`proxyHandlerConstructor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `proxyHandlerConstructor` | (...`args`: `any`[]) => `ProxyHandler`<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:209](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L209)

___

### TargetAsThis

▸ **TargetAsThis**<`T`, `SuperClass`\>(`superClass`): `SuperClass`

A decorator to bind `this` to the proxy target for all instance methods on
the proxy.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `SuperClass` | extends (...`args`: `any`[]) => `ProxyHandler`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `superClass` | `SuperClass` |

#### Returns

`SuperClass`

#### Defined in

[index.ts:75](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L75)

___

### getTarget

▸ **getTarget**<`T`\>(`maybeProxy`): `T` \| `undefined`

Returns the proxy target if `proxy` is a proxy and its proxy handler has the
[AllowGetTarget](#allowgettarget) decorator, or `undefined` otherwise.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `maybeProxy` | `T` |

#### Returns

`T` \| `undefined`

#### Defined in

[index.ts:184](https://github.com/Atry/proxy-handler-decorators/blob/556641b/src/index.ts#L184)
