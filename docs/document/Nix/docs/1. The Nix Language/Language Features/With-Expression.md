# With-Expression

## Deconstruct from set into scope

`with` keyword can be used to introduce variables from a attribute set into current scope:

```nix

let foo = { bar = "???"; baz = "!!!" }; in 
    ${foo.bar} + ${foo.baz} # `bar` and `baz` are introduced
```

equivalent to

```nix
let foo = { bar = "???"; baz = "!!!" }; in 
    with foo;
    ${bar} + ${baz} # `bar` and `baz` are introduced
```

```nix
f = { x ? 1, y ? 2, ... }@args: with args; x + y + z
```

```nix
foo = rec {
  p = { x = 1; y = 1; };
  bar = with p; [ x y ];
};
```

## Importing from another module

When another module is imported, all attributes will be deconstructed from the set into scope.

```nix
let foo = null; in 
    with (import ./foo.nix);
```

## Practical usage

```nix
{ config, pkgs, ... }:

{
    home.packages = with pkgs; [
        git
        ripgrep
        neovim
    ];
}
```
