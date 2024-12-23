# String

## String Interpolation

Interpolated string should quote with `"`.

Use `$` to interpolate:
- variable
- expression
- member accessing

```ps1
"Profile Path: $Profile" # variable
"1 + 1 = $(1 + 1)" # expression

# functionaly identical
"cwd: $($pwd.Path)" # Member accessing
"cwd: $pwd"

"$(@(1, 2, 3)[0])"
```

> [!NOTE]
> `$()` is being called **SubExpression Operator** in PowerShell.

## Verbatim String

Verbatim string should quote with `'`.
Can contains new lines and 

```ps1
'
    It''s a verbatim string! 
    and this is a new line!
'
```

> [!NOTE]
> Verbatim string does not allow interpolation in PowerShell which differs from `C#`.

## Raw String

> [!NOTE]
> Raw string is being called **Here String** in PowerShell.

**Here String** typically allows string contents starting at the second line and truncates the last newline.

Use `@'...'@` or `@"..."@` to present Verbatim Here String or Interpolated Here String.

```ps1
@"
    <foo>$Profile</foo>
"@

@'
    {
        "foo": {
            "bar": []
        }
    }
'@
```

> [!NOTE]
> You can have quotation mark `"` in `@"..."@` and for `'` respectively.

## Character Escaping

### Quotation Mark

Use double `"` to escape `"` in a interpolated string.

```ps1
"""""" # ""
"I quote, ""haha!""" # I quote, "haha!"
```

Or use `` ` `` to escape the same quotation mark in the containing quotation.

```ps1
"I quote, `"haha!`""
```

Use double `'` to escape `'` in a verbatim string.

```ps1
'''''' # ''
'I quote, ''haha!''' # I quote, 'haha!'
```

> [!NOTE]
> See [about_Specical_Characters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_special_characters?view=powershell-7.4) 

## Arithmetic with Numerics

PowerShell will try to convert the string on the right operand to the same type as left operand.
Exception will be raised if conversion failed.

```ps1
1 + '2' # 3
'2' + 1 # '21'
[DateTime]::Now + '00:00:15:00' # adds 15 minutes
```

## Comparison

All comparison operators have its case-sensitive version with leading `-c`

- `-gt` -> `-cgt`
- `-lt` -> `-clt`
- ...

```ps1
'Apple' -eq 'apple' # True
'Apple' -ceq 'apple' # False
```

## Split & Join

```ps1
'1,2,3' -split ',' # 1 2 3 as strings
(gci -file) -join ',' # ToString is invoked to evaluated objects to string.
```

## Match & Replace

PowerShell has two kinds of matching strategy for strings.
- `-match` for regex matching.
- `-like` for wildcard matching.

While `-replace` only supports regex.

> [!TIP]
> Match and replace is case-insensitive by default. Use `-cmatch`, `-cnotmatch`, `-creplace`, `-csplit` for **case-sensitive** scenarios.

```ps1
'Janet is a girl' -match 'Jane' # True
'Janet is a girl' -replace '^Janet', 'Jane'
'Janet is a girl' -replace '^Janet', 'Jane' -replace 'is', 'is not' # replace multiple times inline.
```

All previous matches and captured groups can be accessed in `$matches` builtin variable.
`$matches` is a HashTable, you can access named capture group by group name and use index for unamed group.

```ps1
if ('John Smith' -match '^(?<FirstName>\b\w+\b) (\b\w+\b)$') {
    $matches.FirstName # John
    $matches[0] # John Smith
    $matches[1] # Smith
}
```

## Format String

Template string syntax is the same as `C#`.
Standard numeric format like `:C`, `:X` are supported.

```ps1
'This is a {0} string' -f 'format'
```

## Repetition

Use `*` to repeat a string.

```ps1
'abc' * 2 # abcabc
```

## String Evaluation in Interpolation

### Collection

Collections like Array and HashTable are formatted by certain separator defined by `$OFS`(Output Field Separator)

```ps1
"$(1, 2, 3)" # 1 2 3
```

> [!NOTE]
> `$OFS` is not a builtin variable, you'll have to create it manually or pwsh uses space ` ` as the separator.
