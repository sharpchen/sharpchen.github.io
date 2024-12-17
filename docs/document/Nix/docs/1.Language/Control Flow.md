# Control Flow

Nix is a functional language to behave as no side-effect, all variables are isolated in scope and all controls flow statement can have implicit return.

## Let-in

`let..in` statement is used to create a isolated scope to perform operation on variable declared after `let` and requires a return after `in`.

```nix
let
    foo = 1;
in
    foo # foo is returned
```

Since it supports implicit return, you store the value to a variable.

```nix
let
  foo = # [!code highlight] 
    let # [!code highlight] 
      bar = 123; # [!code highlight] 
    in # [!code highlight] 
    bar + 1; # [!code highlight] 
in
foo
```

> [!NOTE]
> Child scope inside `let..in` statement can access variables from parent scope.

## Value Fallback

```nix
foo or "foo"
# equvalent to
if foo != null then foo else "foo"
```

## With Local Expanding

`with` works similarly to `let..in`, it creates a new scope and implicitly declares all attributes of a set as variables into the new scope.
```nix
let
  foo = {
    bar = 123;
    baz = 123;
  };
in
with foo;
{
  inherit bar; # foo.bar and foo.baz is available in scope as variables # [!code highlight] 
  inherit baz; # [!code highlight] 
}
```

If a attribute expanded by `with` conflicts with any variable in scope by its name, **the variable is preferred**.

```nix
let
  foo = {
    bar = 123;
  };
  bar = 456; # [!code highlight] 
in
with foo;
{
  inherit bar; # bar = 456 # [!code highlight] 
}
```

## Assertion


