# Where

- Filter with custom scriptblock by `-FilterScript`
- Filter by property by `-Property`
- Tons of overloads for binary operators for mimicking direct expression.

> [!NOTE]
> Use `?` or `where` alias for `Where-Object`

## Filter By

- Property

```ps1
# -Property is positional
gci -file | where -Property Exists
```

- Script block

```ps1
# -FilterScript is positional
gci -file | where -FilterScript { $_.CreationTime -gt [DateTime]::Now.AddDays(-5) }
```

## Expression-Like

`Where-Object` contains a lot of parameters to emulate expression-like syntax with `-Property`.

```ps1
gci -file | where Extension -eq '.ps1'
# equivalent to 
gci -file | where { $_.Extension -eq '.ps1' }
```

> [!NOTE]
> See: `help where`
