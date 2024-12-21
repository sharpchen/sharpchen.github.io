# Measure

`Measure-Object` is a common utility to calculate statistics of pipeline input with following usage:

First kind of measurement is for property.

- Average of property by `-Average`
- Sum of property by `-Sum`
- Max of property by `-Maximun`
- Min of property by `-Minimum`
- Standard Derivation of property by `-StandardDerivation`
- Measure all available statistics by `-AllStats`

Another kind of measurement is for string and string array.

- Line count of input by `-Line`
- Word count of input by `-Word`
- Character count of input by `-Character`


> [!NOTE]
> Use `measure` alias for `Measure-Object`.

## Calculate for Property

The usage can flexible depend on your need.
`-Property` accepts a `PSPropertyExpression` which can be implicitly created from a **property name**, **scriptblock** or **wildcard**.
`Measure-Object` will return a `Microsoft.PowerShell.Commands.GenericMeasureInfo` when calculate for property.

- Calculate for a same property by `-Property` and specify statistics options you need.

```ps1
# Calculate sum and max for Length
gci | measure -Property Length -Sum -Max
# -Property is positional
gci | measure Length -Sum -Max

# Calculate Max in unit GB
gci | measure { $_.Length / 1GB } -Max 
```

> [!tip]
> You can always pass one or more valid `PSPropertyExpression` to `-Property`, it returns one or more `GenericMeasureInfo`
>```ps1
>gci | measure Length, Name
>```

Wildcard is a special case, all matched property will be calculated one by one. So it might return multiple `GenericMeasureInfo`.

```ps1
# measures for properties like Name, FullName and so on.
# Compared as string
(gci | measure *ame -Max).Count # 5, multiple return!
```


### Measure a HashTable <Badge type="info" text="PowerShell 6+" />

I think Extended property should be preferred if name conflict exists, haven't test it yet.

```ps1
@{ Name = 'John'; Age = 18 }, @{ Name = 'Jane'; Age = 21 } | measure Age -Max
```

> [!NOTE]
> `-Maximun` and `-Minimum` only requires the property to be comparable while other flags requires to be numeric.

> [!NOTE]
> If no any flag were passed, `measure` only contains a available `Count` while other properties remain `$null`.

## Calculate for String

The usage is pretty much the same as property.
The only thing worth noting is string array still treated as a whole instead of enumerating over it.
And each element is treated as single line. This is useful for the source being piped from `Get-Content`.
Measurement for text returns `Microsoft.PowerShell.Commands.TextMeasureInfo`.

```ps1
('hello', 'world' | measure -Word -Line).Words # 2
('hello', 'world' | measure -Word -Line).Lines # 2
```
