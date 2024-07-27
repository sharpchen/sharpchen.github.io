# Path Literal

Paths are natively presented in `nix` instead of as strings

## Path interpolation

Path can be created from string evaluation

```nix
rec {
    user = "john";
    home = /home/${user}/ 
}
```

:::info
Path interpolation requires at least one slash before any value were interpolated.
`${user}/${email}` wound be lowered as a division operation while `./${user}/${email}` is a path
:::

## Path concatenation

```nix
./foo/bar + "file.txt"
```
