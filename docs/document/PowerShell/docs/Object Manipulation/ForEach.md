# ForEach

`ForEach-Object`:

- Collecting values from a member(property or method) by `-MemberName`
- Value transformation by `-Process`
- Mimicking a function that accepts pipeline input by `-Begin`, `-Process`, `-End` and `-RemainingScripts`
- Parallel Jobs 

Intrinsic `ForEach` has some overlap with `ForEach-Object`, it's not recommended but worth noting.

- Type conversion
- Collecting values from a member
- Replace a property by new value

> [!TIP]
> Use `foreach` or `%` alias for `ForEach-Object`.

## Collecting Values

- What differs `ForEach-Object` from `Select-Object -ExpandProperty` is `-MemberName` can accept a method name as well.

> [!NOTE]
> See: `help % -Parameter MemberName`

```ps1
# -MemberName is positional
gci | foreach -MemberName Name
# equivalent to 
gci | select -ExpandProperty Name
```

Evaluating from a method member is available, you can even pass parameters by `-ArgumentList`.

```ps1
(1..3 | % GetType | select -first 1) -is [System.Type] # True

'1,2,3' | foreach -MemberName Split -ArgumentList ','
# or
'1,2,3' | foreach Split ','
```

## Value Transformation

The way `ForEach-Object` behaves is collecting implicitly returned values as an array. Every implicitly returned value will be collected as a item.

> [!NOTE]
> See: `help % -Parameter MemberName`

```ps1
# -Process is positional at 0
gci | foreach -Process { $_.Exists, $false } # True, False, True, False...
```

If you do want a `$null` return, use `Out-Null` to swallow the value.

```ps1
# doesn't make much sense though
$null -eq (gci | foreach { $_.Name | Out-Null }) # True
```

## Intrinsic ForEach

### Type Conversion

One of overloads of `ForEach` takes a `System.Type`, and trying to cast all of them to the type.

```ps1
(65..90).ForEach([char]) # A-Z
```

### Collecting Values

```ps1
('1,2,3').ForEach('Split', ',') # ArgumentList allowed
(gci -file).ForEach('Length')
```

### Override Property Value

```ps1
(gci -file).ForEach('CreationTime', (Get-Date))
```
