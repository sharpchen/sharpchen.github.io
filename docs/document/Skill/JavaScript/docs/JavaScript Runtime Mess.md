# JavaScript Runtime Mess

## Global Object

JavaScript has no specification of Global Object until `ES2020`.
So JavaScript runtime have many different conventional variable for this purpose.
NodeJs has `global`, browsers have `this`, `window`, `self`, `frames`, `parent`, `top` as global object for different context.
`ES2020` added a `globalThis` variable to unify the **interface**.

## Module System

JavaScript has no specification about module system until `ES6`.
Before ECMAScript Module was a thing, the JavaScript community invented some workaround.

CommonJS is one of the **non-standard** module system from NodeJs.
The code containing `require` and `module.exports` we commonly see on internet are of the NodeJs style.
Developers are allowed to manage their codebase in CommonJS module system, and use certain *bundler* to **convert** them to standard JavaScript.

```js
const foo = require('foo')
// ...
module.exports = bar
```

> [!NOTE]
> There's also *AMD (Asynchronous Module Definition)* and *Universal Module Definition (UMD)* but much less common than CommonJS so we don't discuss here.

`ES6` finally introduced a official module system specification, which is implemented in all modern JavaScript runtime, including browsers.

```js
import foo from 'foo'
// ...
export default bar
```

> [!NOTE]
> Although CommonJS isn't a official standard, JavaScript community still made a dedicated file extension `.cjs`(and `.mjs` for ESM) for clearer distinction.
> See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#aside_—_.mjs_versus_.js
