# Object and Collection

Nix has only two kinds of collection:
- Attribute Set: a similar concept to object literal.
- List: generic bucket for elements.

## Attribute Set

Set is similar to object literal in some languages like javascript and lua.
Properties of a set are called attributes in `nix`

```nix
{ username = "john smith"; email = "example@example.com"; }
```

Attribute name can be any string including interpolated string.

```nix
let foo = "bar";
baz = {
    ${foo} = 0
} in { }
```

### Recursive Set

Attributes can reuse value from other attributes in scope, the set should annotate with leading `rec`

> [!TIP]
> The attribute order doesn't matter.

```nix
rec {
    area = height * width;
    height = 10;
    width = 5;
}
```

### Expanding Attributes

```nix
let
    foo = 123;
in
{
    inherit foo;
}

# equvalent to

let
    foo = 123;
in
{
    foo = foo;
}
```

Can expand multiple attributes from another attribute set:

```nix
let
    foo = { bar = 123; baz = "123"; };
in
{
    inherit (foo) bar baz;
}

# equvalent to

let
    foo = { bar = 123; baz = "123"; };
in
{
    bar = foo.bar;
    baz = foo.baz;
}

```

### Access Attribute

Use `.` to access attribute of a set with either identifier or key string.

```nix
let languages = {
    "C#" = "OOP";
    Rust = "Multi-Paradigm";
    Lua = "dynamic scripting";
}; lua = "Lua"; in {
    language."C#";
    language.Rust;
    language.${lua}
}
```

### Searching Path Validation

Use `?` to validate whether the search path exists in an attribute set.

```nix
let
  foo = {
    bar = null;
    baz = {
      qux = 123;
    };
  };
in
[ 
  (foo ? bar)
  (foo.baz ? qux)
  (foo ? baz.qux) # [!code highlight] 
]
```

### Merging

`//` operator will try to merge left and right operand, if attribute with same name has different values, the value from right operand will be taken.

```nix
{ foo = null; bar = null } // { foo = 1; baz = null }
# retuns { foo = 1; bar = null; baz = null; }
```

### Callable Set

Specifying `__functor` meta attribute to make the attribute set to be a callable function as well.
The functor can have a parameter `self` that targets to the attribute set itself. 
The nested function takes the actual paramter can be applied to the functor.

```nix
let
foo = {
    __functor = self: x: builtins.toString x;
};
in
    foo 123 # x is 123 here
```

## Equality Checking

List and set are compared by their structure, not their references.

```nix
let 
    foo = { bar = { baz = {} }; }; 
    qux = { bar = { baz = {} }; };
in
    assert foo == qux; # true
```

## List

List elements are separated by spaces

```nix
["a" 1 { foo = "bar" } (func 1)]
```

> [!NOTE]
> To evaluate value returned from a function as a element of list, enclose it by `()`.

### Concatenation

```nix
["a", 1 { foo = "bar" }] ++ [1 2 3]
```

