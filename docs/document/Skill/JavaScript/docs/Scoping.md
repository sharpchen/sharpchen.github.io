# Scoping

## Global Scope

### Global Variable

### Global Object

Global Object is a globally accessible storage for every global Variable.
That's is, every global variable are stored within the Global Object.

```js
var foo = 'foo'
console.log(globalThis.foo) // 'foo'
console.log(typeof globalThis.undefined) // 'undefined'
console.log(globalThis.foo) // 'foo'
```
