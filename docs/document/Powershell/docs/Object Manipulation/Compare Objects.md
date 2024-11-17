# Compare Objects

## Overview

> [!TIP]
> Use `diff` or `compare` alias for `Compare-Object`

`Compare-Object` is a cmdlet to compare two sources of objects and returns a indicator implying the difference between the two.

`-ReferenceObject` is the base object to compare, `-DifferenceObject` is the right hand side.

```ps1
Compare-Object -ReferenceObject @('abc', 'dfg', 4) -DifferenceObject @('fg', 'abc', 1)
```

```console
InputObject SideIndicator
----------- -------------
fg          =>
1           =>
dfg         <=
4           <=
```

- `<=` implies the difference content came from the `-ReferenceObject`
- `=>` implies the difference content came from the `-DifferenceObject`
- `==` implies the content appeared in both sides.

> [!NOTE]
> `Compare-Object` hides `==` case by default. Use `-IncludeEqual` to display it. And `-ExcludeDifferent` to to hide different cases.
```ps1
diff -ref @('abc', 'dfg', 4) -diff @('fg', 'abc', 1) -IncludeEqual
```

## Compare by Property

You can specify which property to compare.

```ps1
diff @('abc', 'dfg') @('fg', 'abc') -Property Length # compare on string.Length
```

## Comparison Solution

`Compare-Object` will try finding a method to do the comparison, falls back as following:

- `IComparable` interface
- `ToString()` and compare on string

> [!TIP]
> If the object to be compared doesn't implement `IComparable`, you should use `-Property` unless it's a primitive type.
