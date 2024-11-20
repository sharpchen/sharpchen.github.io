# Alias

## Set an Alias

```ps1
New-Alias <alias> <cmd_name>
```

> [!TIP]
> Use `nal` alias for `New-Alias`.

> [!note]
> `New-Alias` throws when the alias already exist while `Set-Alias` will override it.

## Override an Alias

```ps1
Set-Alias <alias> <cmd_name>
```

> [!TIP]
> Use `sal` alias for `Set-Alias`.

## Checkout Alias

- Check out by alias

```ps1
Get-Alias <alias>
```

> [!TIP]
> Use `gal` alias for `Get-Alias`.

Or use `Get-Command`

```ps1
Get-Command <alias>
```

- Check out by command name

```ps1
Get-Alias -Definition <cmd_name>
```

## Builtin Aliases

Powershell ships with some builtin aliases, checkout by this command:

```ps1
Get-Alias | Where-Object { $_.Options -match 'ReadOnly|Constant' }
```

> [!note]
> Do not use custom aliases for public repository.

> [!CAUTION]
> Not all builtin aliases are available in all system. See [removed aliases](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/unix-support?view=powershell-7.4#aliases-not-available-on-linux-or-macos) 

## Differ from Bash

Alias in powershell is only a name alias for a command, it can never take any predetermined parameters or flags like in bash.

```sh
alias gl='git log' # fine
```

```ps1
New-Alias gl 'git log' # not allowed! # [!code error] 
```

Should use function instead.

```ps1
function gl {
    git log
}
```
