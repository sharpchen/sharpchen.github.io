# Alias

## Set an Alias

```ps1
New-Alias <alias> <cmd_name>
```

> [!note]
> `New-Alias` throws when the alias already exist while `Set-Alias` will overrides it.

## Override an Alias

```ps1
Set-Alias <alias> <cmd_name>
```

## Checkout Alias

- Check out by alias

```ps1
Get-Alias <alias>
```

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

> [!TIP]
> Use functions to do alias with predetermined parameters in your profile.

