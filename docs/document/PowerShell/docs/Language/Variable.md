# Variable

## Declaration & Reference

Variable declaration and variable referencing shares a identical syntax.

Variable name must starts with `$` but `$` is not part of the name.

```ps1
$var = 'foo'
echo $var
```

## Variable Provider

PowerShell has builtin PSProvider for all variables named `Variable:`

## Item Cmdlet for Variables

You may use Item cmdlets for manipulating variables since they're from a PSDrive.
Typically useful when manipulating in batch.

When `-ItemType` unspecified and `-Path` were a path from variable drive, `New-Item` creates a variable.

```ps1
ni -Path Variable:process -Name process -Value (gps)
```

There's not much necessity for using Item cmdlets for variables, you may use them but it doesn't seem to be straightforward.

## Variable Cmdlet

- `Get-Variable`: retrieve variables from scope
- `New-Variable`: create variables with more options available
- `Set-Variable`: override value for variables
- `Remove-Variable`: delete variables from scope or pattern
- `Clear-Variable`: set variable to null

> [!NOTE]
> All these variable cmdlets supports `-Name` that accepts pipeline input by property.

It's more recommended to use variable cmdlets since it supports more parameters to work with

- `Scope`: work with variables in certain scope

