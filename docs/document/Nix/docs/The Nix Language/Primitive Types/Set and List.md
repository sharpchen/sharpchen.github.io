# Set and List

## Set

Set is similar to object literal in some languages like javascript and lua.
Properties of a set are called attributes in `nix`

```nix
{ username = "john smith"; email = "example@example.com" }
```

Attribute name can be any string including interpolated string.

```nix
let foo = "bar";
baz = {
    ${foo} = 0
} in { }
```

### Recursive set

Attributes can reuse value from other attributes in scope, the set should annotate with leading `rec`

```nix
rec {
    area = height * width;
    height = 10;
    width = 5;
}
```

### Attribute inheriting


```nix
let foo = "???"; baz = "!!!"; in {
    inherit foo baz;
    bar = "bar";
}

# equivalent to

let foo = "???"; baz = "!!!" in {
    foo = foo;
    baz = baz;
    bar = "bar";
}
```

Inherit from another set:

```nix
let foo = { bar = "!!!"; baz = "???" }; in {
    inherit (foo) bar baz;
}

```
equivalent to
```nix
let foo = { bar = "!!!"; baz = "???" }; in {
    bar = foo.bar;
    baz = foo.baz;
}
```

### Accessing attributes

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

### Telling whether a set has a attribute

Use `?` operator to tell whether a key or attribute path is registered in a set

```nix
let foo = { bar = null; baz = { qux = 123 }; }; in
    if foo ? bar then trace "bar exists in foo"; # bar is the key name
    if foo ? baz.qux then trace "baz.qux exists in foo"; # baz.qux is the attribute path
    if foo.baz ? qux then trace "qux exists in foo.baz"
```

## Updating a set

`//` operator will try to merge left and right operand, if attribute with same name has different values, the value from right operand is taken.

```nix
{ foo = null; bar = null } // { foo = 1; baz = null }
# retuns { foo = 1; bar = null; baz = null; }
```

## List

List elements are separated by spaces

```nix
["a" 1 { foo = "bar" } (func 1)]
```

:::info
To evaluate value returned from a function as a element of list, enclose it by `()`.
:::

### List concatenation

Use `++` operator

```nix
["a", 1 { foo = "bar" }] ++ [1 2 3]
```

## Comparsion

List and set are compared by their structure, not their references.

```nix
let 
    foo = { bar = { baz = {} }; }; 
    qux = { bar = { baz = {} }; };
in
    assert foo == qux; true # true

```
