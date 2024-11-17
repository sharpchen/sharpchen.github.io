# Load Modules

## Custom Module Path

Powershell automatically scans modules at certain locations.
Inspect existing module path by:

:::code-group
```ps1[Windows]
$env:PSModulePath -split ';' # windows
```
```ps1[Linux/Mac]
$env:PSModulePath -split ':' # linux/mac
```
:::

You can add your module location inside your profile file.

```ps1
$env:PSModulePath += [IO.Path]::PathSeparator + '<path>'
```

## Lazy Loading

Powershell lazily loads a module when member from it is called.

## Loaded Modules

Inspect all loaded modules in current session:

```ps1
Get-Module
```

Check whether certain module name is loaded:

```ps1
Get-Module -Name '<name>'
```

> [!TIP]
> Use `gmo` alias for `Get-Module`.

## Import Modules

Import a module in current session.

```ps1
Import-Module -Name '<name>'
```
> [!TIP]
> Use `ipmo` alias for `Import-Module`.

## Unload Modules

Unload a module from current session.

```ps1
Remove-Module '<name>'
```

> [!TIP]
> Use `rmo` alias for `Remove-Module`.
