# Multiple Channels with Flakes

You might want to use stable and unstable at the same time.
As mentioned earlier, all attributes are passed from `flake.nix` to `home.nix`.
So adding a new channel is simply adding a new attribute in `flake.nix` and use it in `home.nix`.

## Choose one as your default channel

You should already know that `pkgs` is a essential attribute that we should always assign.
`programs.<pkg_name>` uses `pkgs` attribute implicitly, it's like a default channel solution.
So just pick one channel as you like for it. A lot nix users actually prefer unstable over stable because it's not that unstale.

```nix
{
  description = "Home Manager configuration of sharpchen";

  inputs = {
    # Specify the source of Home Manager and Nixpkgs.
    # Names can be any
    unstablePkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable"; # [!code highlight] 
    stablePkgs.url = "github:nixos/nixpkgs/nixos-24.05"; # [!code highlight] 
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "unstablePkgs";
    };
  };

  outputs = { stablePkgs, unstablePkgs, home-manager, ... }:
    let
      system = "x86_64-linux";
      pkgs = unstablePkgs.legacyPackages.${system}; # choose unstable as pkgs # [!code highlight] 
      stable = unstablePkgs.legacyPackages.${system}; # name non-default channel as you like! # [!code highlight] 
    in {
      homeConfigurations."sharpchen" = home-manager.lib.homeManagerConfiguration {
        inherit pkgs; # export `pkgs` here, this is the only one `pkgs` # [!code highlight] 
        # Specify your home configuration modules here, for example,
        # the path to your home.nix.
        modules = [
          ./home.nix 
        ];

        # Optionally use extraSpecialArgs
        # to pass through arguments to home.nix
        extraSpecialArgs = { inherit stable;  }; # export `stable` as arg here # [!code highlight] 
      };
    };
}
```

Then add the attribute name in the funtion of `home.nix`:

```nix
{ config, pkgs, stable, ... }: # add `stable` here # [!code highlight] 
{
    # ...
    home.packages = [
        stable.harper # [!code highlight] 
        stable.tmux # [!code highlight] 
    ];
}
```
