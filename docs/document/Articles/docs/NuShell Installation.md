# NuShell Installation

## Installation

On windows:

```bash
winget install nushell
```

Run `nu` to enter NuShell.

:::info
For more installation, see: [Installing Nu](https://www.nushell.sh/book/installation.html)
:::

## Integrates with VSCode

Add new profile in `settings.json`.

```json
{
    "terminal.integrated.profiles.windows": {
        "NuShell": {
            "path": "C:\\Program Files\\nu\\bin\\nu.exe",
            "overrideName": true
        }
    },
}
```

To use NuShell as default integrated shell, value should coherent to profile name.

```json
{
    "terminal.integrated.defaultProfile.windows": "NuShell"
}
```

## Integrates with Windows Terminal

:::info
Windows Terminal will automatically register a profile for NuShell
:::

## Configuration

Unlike `bash`, `nu` separates environment variables and start up scripts into two files: `env.nu` and `config.nu`.
