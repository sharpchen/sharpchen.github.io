# Control Flow

## Falsy Values

- `$false`
- `$null`
- Empty string
- Numeric zeros
- Empty collections implemented `IList`.

> [!NOTE]
> You can cast falsy values to boolean.
>```ps1
>[bool]@() # False
>```

## Newline Indicator

## Command Chaining

### Multi-Command in Single Line

Use `;` to separate commands in the same line.
All commands are executed in order.

```ps1
cd ..; gci -rec -file; echo hello
```

### Chaining And & Or <Badge type="info" text="PowerShell 7+" />

In PowerShell 7, `&&` and `||` were introduced to do the same command chaining as bash does.
