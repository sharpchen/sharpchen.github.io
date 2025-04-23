# Sort

- Sort by `-Property`
    - Sort by single property
    - Sort by property asc/desc then by another property asc/desc
    - Sort by calculated value
- Descending by `-Descending`
- Distinct by `-Unique`
- Preserve input order when two order weights equivalently by `-Stable` <Badge type="info" text="PowerShell 6.2.0+" />
- Case-Sensitive sort for strings by `-CaseSensitive` 
- Take a count from start or end of sorted by `-Top` or `-Bottom` <Badge type="info" text="PowerShell 6+" />

> [!WARNING]
> `sort` alias is only available on Windows.

## Sort By

- By single property

```ps1
gci -file | Sort-Object -Property Length
```

- Then by

```ps1
# sort by Extension then by Length, both ascending
gci -file | Sort-Object Extension, Length
# sort by Extension descending then by Length descending
gci -file | Sort-Object @{ e = 'Extension'; desc = $true }, @{ e = 'Length'; desc = $true } # [!code highlight] 
```

- Sort by calculated value

```ps1
gci -file | Sort-Object { $_.Name.Length }
```
