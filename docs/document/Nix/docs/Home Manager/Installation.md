# Installation

## Add channel for home-manager

- Unstable

```bash
nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager && nix-channel --update
```

- Stable(24.05)

```bash
nix-channel --add https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz home-manager && nix-channel --update
```

## Install

```bash
nix-shell '<home-manager>' -A install
```

:::info
`<home-manager>` is the channel alias you in previous step. Replace it by yours if necessary.
:::

After this command, `home-manager` should be available.
