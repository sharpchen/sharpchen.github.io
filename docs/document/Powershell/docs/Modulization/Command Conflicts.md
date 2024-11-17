# Command Conflicts

Commands from modules usually ships with a prefixed name to distinguish name conflicts.
`Az` module for example, it always prefix its commands with `Az`.

```console
$ gcm Get*Az* | select -First 5

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           Get-AzADServicePrincipalCredential                 7.6.0      Az.Resources
Alias           Get-AzAksClusterUpgradeProfile                     6.0.4      Az.Aks
Alias           Get-AzApplicationGatewayAvailableSslOptions        7.10.0     Az.Network
Alias           Get-AzApplicationGatewayAvailableWafRuleSets       7.10.0     Az.Network
Alias           Get-AzApplicationGatewayBackendHttpSettings        7.10.0     Az.Network
```

## Command Fullname

One solution is specifying the fullname of the command.

```ps1
ModuleName\Get-Foo # use `\` as separator
```

## Add Custom Prefix

If a module doesn't have a prefix for its cmdlet, you can customize prefix for it on import.

```ps1
ipmo '<module>' -Prefix Foo
# assuming `Get-Bar` is from `<module>`
# `Get-Bar` -> `Get-FooBar`
Get-FooBar
```

