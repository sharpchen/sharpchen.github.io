# Path Literal

Paths are natively presented in `nix` instead of as strings

## Interpolation

Path can be created from string evaluation

```nix
rec {
    user = "john";
    home = /home/${user}/ 
}
```

> [!NOTE]
> Path interpolation requires at least one slash before any value were interpolated.
>`${user}/${email}` wound be lowered as a division operation while `./${user}/${email}` is a path

## From `NIX_PATH`

Paths from `NIX_PATH` variable can be recognized directly using `<>`.
This is particularly useful when importing a registered nix channel.

```nix
let
    pkgs = import <nixpkgs> {  };
in
    {}
```

## Concatenation

```nix
./foo/bar + "file.txt"
```

## Evaluation

Each evaluation for a path will inform nix to copy the file or directory into nix store.

```console
nix-repl> "${~/projects}"
copying '/home/sharpchen/projects' to the store
```

> [!NOTE]
> You cannot interpolate paths created from `<>`.

