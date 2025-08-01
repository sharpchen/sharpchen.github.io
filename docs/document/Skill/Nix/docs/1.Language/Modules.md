# Modules

Generally any nix file is a module, contains either a function or a attribute set.

## Module Identifier

- relative path to a nix file
- keys in `NIX_PATH`: any key in `NIX_PATH` is a valid identifier of nix module.
```sh
$ echo $NIX_PATH

nixpkgs=/nix/var/nix/profiles/per-user/root/channels/nixos:nixos-config=/etc/nixos/configuration.nix:/nix/var/nix/profiles/per-user/root/channels
```

```nix
{
    import = [
        <nixpkgs> # [!code highlight]
    ];
}

# or

let
    pkgs = import <nixpkgs>; # [!code highlight]
in {

}
```
