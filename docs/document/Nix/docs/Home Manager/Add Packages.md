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
To generate any file as well as config file, use `home.file."<file_path>"`

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

## Install and config by builtin option

**For some packages, nix provides builtin options to set them up programmatically**

```nix
{ cofig, pkgs, ... }: {
  programs.git = {
    enable = true;
    userName = "foo";
    userEmail = "example@bar.com";
  };
}
```

*`enable` implies that the package will be installed implicitly.*

:::info
Only few packages has builtin options, how do I know?
Go to [Home-manager Options](https://nix-community.github.io/home-manager/options.xhtml) and search `programs.<pkg_name>`
:::
