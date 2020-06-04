
Reproduction to reproduce `ngtypecheck` being referenced in dts files.

```cmd
yarn
yarn build
cat dist/src/index.d.
/// <reference path="index.ngtypecheck.d.ts" />
export declare const foo = "bar";
```
