# Conditional Keys

Instead of iterating over all properties/entries in a type, we can do the following before we transform the target types.

- Filter keys: filter out keys that we don't want to include base on a conditional type expression.
- Transform keys: transform keys before we transform traget type.

## Synopsis

`as` keyword was introduced here to connect with conditional type expression.

```ts
type <name> = {
    [<type> in <type> as <condition>]: <type>
}
```

## Filter Keys

The following example shows how to extract property names that're not singular typed(not an object or a collection).
All keys that didn't satisfies the condition `T[K] extends object` will be replaced as `never`, which is the empty type. In other words, they will be filtered.
And lastly the target type can be arbitrary since we don't need it, all we need is the keys.

```ts twoslash
const foo = {
    bar: 123,
    baz: '123',
    goo: [1, 2, 3],
    foo: { foo: {} }
}

type KeyOfSingularTypedProperty<T> = keyof {
    [K in keyof T as T[K] extends object ? never : K]: any // [!code highlight] 
}

type SingularKeyOfFoo = KeyOfSingularTypedProperty<typeof foo>
```

