# Functional Quick Start

## Function as Primitive

## Type Composition

The shape of type and behaviors are isolated.
Functions as first-class citizens, **they don't belong to any type but modules.**

```fsharp
type Point = { X: float; Y: float }

module Point =
    let distance p1 p2 =
        sqrt ((p2.X - p1.X) ** 2.0 + (p2.Y - p1.Y) ** 2.0)

    let translate dx dy point =
        { point with
            X = point.X + dx
            Y = point.Y + dy }

let p1 = { X = 1.0; Y = 2.0 }
let p2 = Point.translate 3.0 4.0 p1
```

<!-- TODO: add example to show type composition -->
<!-- TODO: add description about function as objective and value as subjective -->

## Hindley-Milner Type System

```fsharp
let add a b = a + b
let foo = add 1 2 // inferred as int -> int -> int
let bar = add 1.0 2,0 // can't infer // [!code error]
```

<!-- TODO: add more appropriate example -->

## Immutable Value

Values are immutable since constructed by default.

```fsharp
let p1 = { X = 1.0; Y = 2.0 }
// there's no even a assignment statement for variable in fsharp
// fsharp use = to check equality
let cond: bool = p1.X = 0 // [!code highlight]
```

> [!NOTE]
> fsharp does have ability to mark variable and field as `mutable` but definitely not recommended unless necessary.

## How to Construct Values

There's two kinds of value construction in functional languages

- Record
    - creation on literal(with inference)
    - direct access to members
    - best for pure data abstraction
- Single-Case Discriminated Union
    - requires constructor function on creation
    - requires deconstruction on pattern matching to access the members
    - best for types that require semantic identification, validation

```fsharp
type Student = { name: string; age: int } // record
type Person = Person of name: string * age: int // case type with constructor

let person: Person = Person("foo", 18)

printfn
    "%A"
    (match person with // requires deconstruction // [!code highlight]
     | Person(name, _) -> name) // [!code highlight]

let student = { name = "foo"; age = 18 } // the target type is inferred here
let _ = student.name // dot accessor for records // [!code highlight]
```

## Discriminated Unions

**Discriminate Unions** uses new type to **wrap** over a known type to provide extra **label/description**.
Such semantic difference is enforced by **nominal type system**. The following example shows how to define a `Shape` union with sub-types,
the subjective relation is **not done by object inheritance** but by simple grouping since we don't need to maintain the statue thanks to **immutability**.

```fsharp
type Shape =
    // `of` clause defines constructor
    | Circle of float // float is type for the unnamed parameter
    | EquilateralTriangle of double
    | Square of double
    | Rectangle of double * double // two unnamed parameter definition typed as double, separated by *
```

> [!NOTE]
> There's no multiple constructors in fsharp

> [!NOTE]
> Typescript as a structural typing language doesn't have discriminated union but union simply because there's no nominal system.
>```ts
>// NOTE: they're not wrapped as nominal types
>type LogLevel =
>    | 'error'
>    | 'infor'
>    | 'debug'
>    | 'trace'
>```

## Pattern Matching

On the basis of **constructor** and **DU** we can have **Pattern Matching**.

## Functor

## Applicative

## Monad
