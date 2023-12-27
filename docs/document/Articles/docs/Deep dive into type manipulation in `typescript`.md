# Deep dive into type manipulation in `typescript`?

## Inline type parameter declaration

### List pattern like

::: code-group

```cs
Span<int> span = Enumerable.Range(1, 100).ToArray().AsSpan();
Random.Shared.Shuffle(span);
var condition = span is [var first, .. var _]; // always true
```

```ts
type First<T extends any[]> = T extends [infer TFirst, ...infer _] ? TFirst : never;
type A = First<[1, 2, 3]>; // type A = 1;
type B = First<[null, 'a', 'b']>; // type B = null;
type C = First<[]>; // type C = never
```

:::

### Property pattern like

::: code-group

```cs
var condition = new[] { 1, 2, 3 } is { Length: var length };
```

```ts
type Length<T extends any[]> = T extends { length: infer TLength } ? TLength : never;
```

:::

- `typescript` uses `infer` to declare a type parameter inline, while `C#` uses `var` to declare a inline variable.
- Two language both uses `_` as discard symbol.

## Loop over a type

Since a type is a set, we can loop over it in conditional clause, however, implicitly.
Let's implement `Exclude<T, U>` from scratch.

```ts
type MyExclude<T, U> = T extends U ? never : T;
type Union = 'a' | 'b' | 'c';
type A = MyExclude<Union, 'c'>; // 'a' | 'b'
type B = MyExclude<Union, 'b' | 'c'>; // 'a'
```

If interpret it as a loop using collection to represent a type union, it should be equivalent to

```ts
const T = ['a', 'b', 'c'];
const U = ['b', 'c'];
const Excluded: string[] = [];
T.forEach(t => {
    if (!U.some(u => u === t)) {
        Excluded.push(t);
    }
});
```

Well, equality checked on type level though.
