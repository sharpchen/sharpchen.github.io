# Add Packages and Manage Config File

There's two ways to install packages using home-manager.

- `home.packages`
- `programs.<pkg_name>`

## Install only

`home.packages` provides a explicit way to include what package should be installed.

```nix
{ config, pkgs, ... }: {
  home.packages = with pkgs; [
    git
    neovim
    ripgrep
    openssh
    lazygit
  ];
}
```

**However, you won't be able to config the package in a same place.**

```nix
{ cofig, pkgs, ... }: {
  home.file.".gitconfig" = {
    text = ''
      [user]
          name = "foo"
          email = "example@bar.com"
    ''
  };
}
```
