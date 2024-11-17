# Modules

## Add Module Repository

Module repository is a registry of powershell modules.
It can be public or privately hosted by yourself.

```ps1
Register-PSRepository <url>
```

## Install a Module

```ps1
Install-Module <name>
```

## Search Modules

Search module to be installed in registered repositories.

```ps1
Find-Module <pattern>
```

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

```ps1
$env:PSModulePath += [IO.Path]::PathSeparator + '<path>'
```
