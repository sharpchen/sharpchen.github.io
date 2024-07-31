# nix-channel

## Add channel

```bash
nix-channel --add <url> [<channel_alias>]
```

:::info
`channel_alias` is optional, defaults to `nixpkgs`
:::

## List channel

```bash
nix-channel --list
```

## Remove channel

```bash
nix-channel --remove <channel_alias>
```

## Update channel

You'll need to fetch channel info after adding new channels

```bash
nix-channel --update [<...channel_alias>] # update all or specific channels
```
