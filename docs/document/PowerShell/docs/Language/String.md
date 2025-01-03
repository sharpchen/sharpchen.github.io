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

### Special Characters

Other special characters should only be escaped by `` ` ``, and only available in a double quote string or double quote here string.

```ps1
"Line with a new line `n"

@"
`tstarts with tab
"@

'no escape happened here! `n'
```

## Arithmetic with Numeric

PowerShell will try to convert the string on the right operand to the same type as left operand.
Exception will be raised if conversion failed.

```ps1
1 + '2' # 3
'2' + 1 # '21'
[datetime]::Now + '00:00:15:00' # adds 15 minutes
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

### Enumerate in Replace <Badge type="info" text="PowerShell 6+" />

`-replace` allows access to the macthed object by `$_` typed as `System.Text.RegularExpressions.Match` in a scriptblock to perform a more flexible action when replacing.

```ps1
# Transform captured group in replace
'John Smith' -replace 'John', { $_.Value.ToLower() }
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

## Grep

`Select-String` is a builtin cmdlet that does the similar thing like `grep` in gnu coreutils.
It can select one or more lines that matches the specified regex.

`Select-String` returns one or more `Microsoft.PowerShell.Commands.MatchInfo` that majorly includes:
- Matches as `System.Text.RegularExpressions.Match[]`
- Line: content of the matched line
- LineNumber: line number of the matched line

- `-SimpleMatch`: prevent interpretation of `-Pattern` to a regex.
- `-NotMatch`: returns lines that doesn't match the `-Pattern`.
- `-Path`: try match the name of a dir or content of a file
- `-Raw`: return matched string instead of `MatchInfo`
- `-Quiet`: return flag that indicates whether the match succeeded(`$true`) or not(`$null`)
- `-AllMatches`: match all occurrences for each line.
- `-List`: match first occurrence in file.
- `-NoEmphasis`: cancel highlighting for matches

- Grep single line from pipeline

```ps1
# -Pattern is positional
help sls | sls -Pattern 'Position\??\s*\d'
```

- Grep multiple lines from above and below

```ps1
# include 3 lines above and 5 lines below the macthed line
help sls | sls 'Position\??\s*\d+' -Context 3,5
```

- Grep from pipeline passed by property(`-Path`)

```console
PS ~> gci /nix/store/ -dir | sls 'roslyn'

/nix/store/m4npcw66155bbi8i7ipp0bbp54wdwwlg-roslyn-ls-4.13.0-3.24577.4
/nix/store/np6bigb7d3lvpinw0mrdvj38xi67q6sa-roslyn-ls-4.12.0-2.24422.6
```

- Match from a file, `sls` has different format for content from `-Path` which includes line number.

```ps1
sls -Path ./foo.txt -Pattern 'foo'
gci *foo.txt | sls 'foo'
```

- Filter files match certain pattern quickly(doc said it **is the most efficient way**)

```ps1
gci -file | sls -Pattern 'foo' -List | foreach Path
```

## Convert to String

There's two way of general string conversion from object.

- formatting by `Out-String`
- `ToString`

`ToString` is sometimes limited since there might not be always a override available, so it just returns the type fullname.
While formatting is more generalized as we usually see in console output, especially when pipe it to a cmdlet to do text manipulation.
That's the reason why we have `Out-String`, which converts object to its formatted representation.

```ps1
gci | Out-String | sls 'foo'
```

`Out-String` has a dedicated parameter `-Stream` which allow it to pipe the string single line each time.
And PowerShell has a builtin function `oss` as an alias for `Out-String -Stream`

```ps1
gci | Out-String | sls 'foo' # match the entire string
gci | oss | sls 'foo' # match the matched line only
```

## String Evaluation in Interpolation

### Collection

Collections like Array and HashTable are formatted by certain separator defined by `$OFS`(Output Field Separator)

```ps1
"$(1, 2, 3)" # 1 2 3
```

> [!NOTE]
> `$OFS` is not a builtin variable, you'll have to create it manually or pwsh uses space ` ` as the separator.
