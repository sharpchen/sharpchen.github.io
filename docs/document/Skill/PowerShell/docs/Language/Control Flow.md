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

## Null-Conditional Operator <Badge type="info" text="PowerShell 7+" />

This feature is basically the same as in `C#` except a bracing `{}` is required around variable because `?` is valid as part of variable name.

```ps1
$null.Bar() # exception raised # [!code error] 
${null}?.Bar() # ok

$null[0] # exception raised here # [!code error] 
${null}?[0] # ok

$null ?? 'I am not null'

$baz ??= 'I am new value'
```

## Ternary Operator <Badge type="info" text="PowerShell 7+" />

No need to explain, same as in `C#`.

## Pattern Matching

Switch statement behaves similarly when the input is a singular object but can enumerate when the input is a collection.
It has a few different patterns available:

- Constant: matching by primitive literal.
- Type: matching by target type with `-is` operator.
- Regex: matching by regex string, specifically for `string`.
- Wildcard: matching by wildcard string, specifically for `string`.

### Synopsis

`switch` in PowerShell differs from c-like languages in:
- condition can be a procedure(scriptblock) so you can perform more nested and complex determine
    ```ps1
    switch (1) {
        { $_ -is [int] } { "Int32" }
    }
    ```
- can have implicit return, each time the case matches yields the result into the final array, or just the singular result when only one case matches
    ```ps1
    $foo = switch ($bar) { <# ... #> }
    $foo -is [System.Object[]] # True
    ```
- `default` block is not required(`$null` will be returned when no case is matched)
- can match for not only a singular object but an collection
    ```ps1
    $foo = switch (1, 2, 3) {  }
    ```
- use `continue` to skip current enumeration
    ```ps1
    switch (1, 2) {
        1 { continue } # I don't want to preceed with this value 1, next!
        2 { "aha" }
    } # aha
    ```

There's three options available `switch`(specifically for `string` macthing):
- `-Exact`: the default option that matches the string by literal, can be elided
- `-Regex`: match by regex condition
- `-Wildcard`: match by wildcard condition
- `-CaseSensetive`: case-sensitive matching, can be combined with any of other three options

### Constant Pattern

Constant pattern is specifically for numbers and strings.

While `switch` has dedicated options for strings but those does not apply on other literals.
However, when a non-string type is tried to match the string case by no matter which option you specified, it will be evaluated to string.

```ps1
$foo = 1
$bar = switch -Exact ($foo) {
    1 { "one" }
    2 { "two" }
    3 { "three" }
    1 { "one" }  # reachable # [!code warning] 
    '1' { "stringified one" } # matched too! # [!code highlight] 
}

$bar = switch ($foo) { # -Exact can be elided # [!code highlight] 
    1 { "one"; break }
    2 { "two" }
    3 { "three" }
    1 { "one" }  # not reachable  # [!code highlight] 
    default { "ok I am the last resort" }
}
```

### Type Pattern

Nothing else

```ps1
switch ("foo") {
    { $_ -is [string] -and $_.Length -gt 0 } { 'all right' }
}
```

### Regex & Wildcard Pattern

I don't have much to say

```ps1
switch -Regex -CaseSensetive ("hello") {
    "h\d+" { "..." }
    "H\w+" { "..." }
}

```

## Trap

`trap` is been called as a statement in PowerShell worlatchedd, but this is more like a `trap` block, for it:
- serve as a isolated process for handling any error raised in the script or function
- can be defined anywhere inside the script or function

But what makes it different from *block* is, you can specify multiple `trap` for different error types.
**And PowerShell only run the most specific `trap` statement for the error**

> [!NOTE]
> Use `$_` to access the captured error object inside `trap`

> [!WARNING]
> Do not defined more than one `trap` for a same error type, only the first would be executed

```ps1
param()

trap {
    "Any error was triggered"
}

trap [System.StackOverflowException] {
    "A dedicated exception happened"
}
```

`trap` does not break the process, but only executes when particular error happens unless, you use `break`.

```ps1
param()

trap {
    "Stop here"
    break
}

ErrorHere

Write-Host "Not reachable here" # [!code warning] 
```

> [!NOTE]
> `continue` is also available in `trap`, the only difference is it does not write the error to error stream
