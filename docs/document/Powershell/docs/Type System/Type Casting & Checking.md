# Type Casting & Checking

## Casting

Prepend a type accelerator or type name before a variable or expression.

```ps1
[System.IO.FileInfo[]](gci -file)
```

### Safe Casting & Convertion

`-as` acts the similar as `as` in `C#`, it tries to convert object to target type, returns `$null` if failed.
The left operand can be:
- type name as string
- type accelerator
- type accelerator name as string 

```ps1
$foo -as [object]
(Get-Date) -as 'string' # convert to date string
(Get-Date) -as 'System.String'
```

> [!NOTE]
> All objects can be casted to `string`.

## Checking

`-is` and `-isnot` acts the same as `is` and `is not` in `C#`.
