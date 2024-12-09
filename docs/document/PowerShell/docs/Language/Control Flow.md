# Control Flow

## Falsy Values

- `$false`
- `$null`
- Empty string
- Numeric zeros
- Empty collections implemented `IList`.
- Single-item collection that contains falsy value, `@(0)`, `@($null)` for example.

> [!NOTE]
> You can cast falsy values to boolean.
>```ps1
>[bool]@() # False
>```

## Newline Indicator

Use `` ` `` to indicate a new line if you do want to finish a long command invocation across multiple lines.

```ps1
gci `
-File `
-Filter '*.mp4'
```

> [!warning]
> **A space is required before the backtick.**
> **And no any chacracter is allowed after the backtick.**

> [!TIP]
> Stop using backticks! They're ugly! Use hashtable splatting instead.
>```ps1
>$table = @{
>  Filter = '*.mp4';
>  File = $true
>}
>gci @table
>```

## Multi-Line Piping

### Trailing Piper

In multiple piping, we can use trailing `|` to indicate the new line, PowerShell regconizes these lines as a whole command piping.

```ps1
gps |
  foreach CPU |
  sort -desc 
```

### Leading Piper <Badge type="info" text="PowerShell 7+" />

Starting with PowerShell 7, `|` is allowed as the first non-space chacracter in a new line.

```ps1
gps | foreach CPU
  | sort -desc # [!code highlight] 
```

## Command Chaining

### Multi-Command in Single Line

Use `;` to separate commands in the same line.
All commands are executed in order.

```ps1
cd ..; gci -rec -file; echo hello
```

### Chaining And & Or <Badge type="info" text="PowerShell 7+" />

In PowerShell 7, `&&` and `||` were introduced to do the same command chaining as bash does.


## Pattern Matching

Switch statement behaves similarly when the input is a singular object but can enumerate when the input is a collection.
It has a few different patterns available:

- Constant: matching by primitive literal.
- Type: matching by target type with `-is` operator.
- Regex: matching by regex string, specifically for `string`.
- Wildcard: matching by wildcard string, specifically for `string`.

### Constant Pattern

### Type Pattern

### Regex Pattern

### Wildcard Pattern


