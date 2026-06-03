# TypeScript-Specific Primitive Types

As a superset of JavaScript, TypeScript has some of its own primitive types as **keywords**.
They're also sets of certain concept of JavaScript types

| keyword  | js concept               |
| -------- | ------------------------ |
| `null`   | `typeof foo == "null"`   |
| `object` | `typeof foo == "object"` |
| Item1.3  | Item2.3                  |
| Item1.4  | Item2.4                  |

- `number`: direct mapping of JavaScript runtime type `number`
- `bigint`: direct mapping of JavaScript runtime type `bigint`
- `null`: literally _null_
- `undefined`: literally _undefined_

## Mapping to JavaScript Runtime Type

Keywords like `string`, `number`, `bigint`, `symbol` and so on are direct mappings for JavaScript runtime type(inspected by `typeof` operator).

## Erased Types

> [!NOTE]
> Literal types like `true` and `false` are not considered.

Some keyword types are concepts only specific to TypeScript.

1. `any`: literally any type, turns off the type checking
2. `unknown`: I don't know the type just like `any`, but would error out when trying to access anything from it or passing it to anywhere.
3. `void`: no return at return
4. `never`: never reaches the return, or meaning an empty type set

```ts
type Empty = Exclude<null, null> extends never ? true : false;
```

5. `object`: meaning an object is possibly `null`, also covers JavaScript runtime `function` type

```ts
// a function is also `object` in TypeScript
type True = (() => void) extends object ? true : false;
type True = null extends object ? true : false;
```

6. `{}`: meaning a _non-null_ and _non-undefined_ `object`

```ts
// from utility types:
type NonNullable<T> = T & {};

type True = Exclude<object, null | undefined> extends {} ? true : false;
```

7. `[...]`: array/tuple type, corresponds to `Array<T>` interface

```ts
type True = [] extends object ? true : false;
type True = [] extends Array<any> ? true : false;
type True = [] extends any[] ? true : false;
```

- `unique symbol`: enforces symbol uniqueness at compile-time.

`symbol` type only describes the uniqueness at JavaScript runtime, `unique symbol` making it **nominal** at language level.

```ts
let sym1: symbol = Symbol('foo');
// a unique symbol has to be const
const sym2: unique symbol = Symbol('bar');

let sym3: typeof sym2 = sym2;

sym3 = sym1; // [!code error]
```

> [!NOTE]
> A `const` symbol is `unique` by default.
>
> ```ts
> const foo = Symbol('foo');
> const bar = Symbol('bar');
>
> // This comparison appears to be unintentional because the types 'typeof foo' and 'typeof bar' have no overlap. // [!code error]
> if (foo === bar) { } // [!code error]
> ```
