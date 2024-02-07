# Installing ArchWSL

## Install

```bash
scoop bucket add extras
```

```bash
scoop install archwsl
```

Check installed subsystem list

```bash
wsl --list --verbose
```

## Init Arch

:::tip
See: [Setup after install](https://wsldl-pg.github.io/ArchW-docs/How-to-Setup/#setup-after-install)
:::

## Set as default subsystem

```bash
wsl --set-default arch
```

Check default subsystem

```bash
wsl --status
```

## Set pacman mirror

Open config file, uncomment predefined mirror urls suitable for your region.

```bash
sudo nano /etc/pacman.d/mirrorlist
```
