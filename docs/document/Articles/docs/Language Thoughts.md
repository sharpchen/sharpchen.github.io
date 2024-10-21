# Language Thoughts

## Target

- static/strong type
- structural and nominal(compiletime and runtime)
- reference type by default, has value type
- functional features
    - records
    - pipe
    - immutability by default

## Type declaration

Structure and function member should be declared separately.

```ts
type Foo {
    foo: string,
    f: () => int
}

impl Foo {
    toString(): string {
        return Foo::type.name
    }
}
```

## Conversion operator

Should happens between nominal types.

```ts
let foo = Foo {} as Bar

type Foo {
    static operator as(this: Foo): Bar {
        return this as Bar // recursive calling?
        return {} as Bar
    }
}

type Bar {
    
}
```

## Compile time shape

Declare a compile time type to do strict structure typing.
Will be erased after compilation.

- `type` for declaring a nominal type.
- `shape` for declaring a structure type.

```ts
shape Point {
    x, y: double
}

let p = { x = 1f, y = 2f } shape as Point // `statisfies` in typescript
let p = shape Point {  x = 1f, y = 2f  } // or reversed? which one is more intuitive?
let p: shape Point = {  x = 1f, y = 2f  } // even this? just like golang
let f = (obj: unknown) => {
    obj as Point  // type assertion upon unknown
}
```

## Unit type

Mimicking abstraction upon primitive data types.

### Motivation

A custom literal can be useful for data calculating.
It should offer benefits:

- static type checking
- unit type composition inference for arithmetic operation
- default format string

### Unit type mechanism

**Problem**: Should it be a operator like custom literals in cpp? Or just a wrapper type for the data?
- Cpp approach lacks of type info since it just simply returns a same type.
- If each unit type is nominal, we will have `m*m` conversion explosion.
- Another way is extension upon the data type, but it's just a problem of form.

```ts
let foo = 360deg
let bar = 6.28rad // for literal
let baz = Math.PI<rad> // for non literal, or (Math.PI)rad ? What if we need a tuple in future? this also conflicts with generic property?
let a = 2 * 3deg // evaluates to (2 * 3)deg, unit type as target type always
let b = 1 - 2deg // error: only scalars can be applied, should do (1 - 2)deg instead
let f = (): <rad> => 1rad // bracketed annotation for differ from normal types

// a nominal unit type can store state
type unit 'deg' for int | double {
    
}

type unit 'rad' for double | int {

}
// shape units are checked at compiletime, no state stored
shape unit 'cm' for Numeric
shape unit 's' for Numeric
```

### Unit type manipulation

Inspired by fsharp - Units of Measure

```ts

```

TimeSpan or Interval can be a good example for unit type, but different unit type like `ms`, `s` or `min` should be evaluated to a same type.

```ts
let a = 1min
let b = 60s
let c = 60_000ms
// so it's a operator returns TimeSpan, not a type???
type unit 's' for Numeric as TimeSpan {

}
```

### Questions

- How to do reflection? Is it necessary?
    - fsharp only do compiletime check, unit types are erased at runtime.

## Compile-Time evaluation and flows

## Type composition

```ts
type Foo {
    foo: int,
    bar: string
}
type Bar {
    ...Foo, // [!code highlight] 
    foo: double, // override foo property
    baz: any
}
```

Or use `with` for better semantic?

```ts
type Foo = {
    foo: int,
    bar: string
}
type Bar = Foo with { foo: double, baz: any } // [!code highlight] 
```

## Constant members

Constants as special members, including functions and fields.

```ts
// should be evaluated at compile-time
function foo(): const string { // implies the function returns const
    return "I am an constant"
}

type Foo {
    foo: const string = foo() // only constant can be assigned from an constant generator function
    bar: const string = "I am also an constant"
    fn = (): const string => "foo"
}

_ = Foo::foo // use :: to access constant members
_ = Foo::fn() // this evaluates to an constant too

```

### Reflection constants

Some reflection properties should be just constants.
Any type should have some default constant members like `name`, `fullName`, `namespace`(if we do plan to design the module system like this)
Which means they're preserved constants.

```ts

type Bar {
    typeName: any  // preserved member name can not be set // [!code error] 
}
// Use `::` as constant accessor.
_ = Foo::typeName // -> `Foo`
_ = Bar::name
```

## Default parameter mutation

```ts
type Person {
    name: string
    age: uint
}
function foo(arg: Person = { name = "John", age = 18 }): void {

}
// use `default` to represent the default value of the parameter
foo(default with { name = "jane" })
```
