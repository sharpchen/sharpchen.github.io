# Understanding String Formatting

## Padding & Alignment

Composite formatting syntax supports three semantic for

- the padding length of each interpolation 
- the direction of each padding for interpolation
- the format of each interpolation

What's padding? It fills out a string to a specified length using spaces. 
If the specified length is less than the length of the string, string remains the same.
You can specify the direction to be left or right.

```cs
// pad spaces on left
"123".PadLeft(20);
//                 123
```

The second syntax in composite formatting is a optional integer for the interpolation:

- specify direction of padding by `-`(pad spaces on left) and pad on right by default
- length of padding

```cs
string.Format("{0,20}", 123);
//                 123
string.Format("{0,-20}", 123);
// 123                ^ ends here
```

## Format Convention

### Numeric Format

- `G` for **G**eneral
- `C` for **C**urrency with decimal precision supported
- `B` for **B**inary numeric
- `D` for padding **integers** to specified trailing digit count
- `E` for **E**xponential format
    - `e` for lowercase, `1.23e+02` for example.
- `F` for **F**ixed-point numeric
- `N` for **N**umeric
    - formats to `ddd,ddd.ddd...`, trailing precision specifier is allowed
- `P` for **P**ercentage
- `X` for he**X**adecimal
    - `x` for lowercase hexadecimal
    - trailing number after `X` or `x` left pads to length with `0`
- `R` for **R**ound-trip
    - supported for  `Double`, `Single`, `Half` and `BigInteger` only.
    - ensures the converted string represents the exact precision of the number.


## `ToString` & `IFormattable`
