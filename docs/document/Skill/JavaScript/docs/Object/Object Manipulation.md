# Object Manipulation

## Merging

- `Object.assign`
  - mutates left-hand-side
  - since `ES5`
  - iterates `enumerable` own properties

- `...`
  - creates new object
  - since `ES9`
  - iterates `enumerable` own properties


```js
let original = { a: 1, b: 2 };

// mutates original
let objectClone = Object.assign(original, { foo: 'foo' }); // [!code warning]

// or create new object
let objectClone = Object.assign({}, original, { foo: 'foo' });

// spread operator always create new object
let objectClone = { ...object };
```
