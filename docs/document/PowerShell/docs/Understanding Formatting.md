# Understanding Formatting

## Formatting Strategy

1. Looks for pre-defined formatting specification(View) in `*.format.ps1xml` files.
2. Follow instruction like `Format-Table`.
3. Direct `ToString` for 
    - primitive types in .NET
    - objects without any public property

> [!NOTE]
> Since PowerShell 6.0, pre-defined formatting specification are presented in `C#` source code.
> You can still load your own specification by `ps1xml` files.

> [!NOTE]
> To formatting

## Format as Table

- Format by `-Property` with specific property names or calculated property

```ps1
gps | ft -Property Name,ID # pick two columns
gps | ft @{ n = 'CMD'; e = 'Name' } # create custom column by calculated property
```

- Toggle headers by `-HideTableHeaders`
- Format with custom View by `-View`
- Group by property `-GroupBy`
- Enable word wrap by `-Wrap`
- `-RepeatHeader` to make sure each page has a header for certain pager like `less`, `more` and `Out-Host -Paging`

```ps1
# display groups separately
gci -file | ft -GroupBy Extension
```
