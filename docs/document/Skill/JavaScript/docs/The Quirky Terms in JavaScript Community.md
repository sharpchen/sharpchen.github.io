# The Quirky Terms in JavaScript Community

> [!TIP]
> Most of web terms can be found on https://developer.mozilla.org/en-US/docs/Glossary

## Source-to-Source Compiler

Aka *transpiler*, it translate higher version of JavaScript to lower one, to adopt older JavaScript runtime in browser.
The TypeScript complier is also a transpiler for JavaScript, if you only write TypeScript in JavaScript syntax.
A Source-to-Source complier for JavaScript is usually used together with *bundler*.

## Bundler

A bundler compacts your JavaScript codebase in certain way so that the browser can download it easier.
We need bundlers for three main reasons: **HTTP Efficiency**, **Module Support**, and **Asset Management**.
If your codebase contains massive source files, the browser has to send massive amount of http requests to download them, which would cause noticeable lag on page loading.
The bundler is for **squashing all these JavaScript source files into a small amount of equivalence**.
It also **eliminates unused code** from both user code and library(namely [Tree-Shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)), to minimize code base as much as possible.

## Polyfill

Whatever bundler or complier converting your code base for browser with older api, it might need to manually append certain implementation that does not exist in the old runtime.
For example, `String.prototype.includes` is only available since `ES7`, if you use that function in your codebase, bundler has to add the implementation for older version of runtime that does not support `ES7`.

```js
// Example: Polyfilling the modern String.includes method
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    // This is the "manual" way to find a string using older methods
    return this.indexOf(search, start) !== -1;
  };
}
```

> [!NOTE]
> See: https://developer.mozilla.org/en-US/docs/Glossary/Polyfill

