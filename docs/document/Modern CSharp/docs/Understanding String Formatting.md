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

- specify direction of padding by `-`(leave interpolated on left) and pad on right by default
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

#### Arbitrary Format Composition

Composite formatting supports a dedicated syntax to represent any numeric format by following convention

- `0` to fill the unreached length
- `#` to represent a single digit, does not fill up any or throw error when the `#` does not match the digits
    ```cs
    double foo = 123.456;
    // shorter before decimal point and longer after
    // but still the same
    foo.ToString("##.#####################"); // 123.456
    // rounded
    foo.ToString("###.##"); // 123.46
    // if the format does not match the numeric(no decimal point here), will not preceed after
    foo.ToString("##,##"); // 123
    ```
- `.` to represent decimal point
- `,` as group separator, real representation depends on `NumberFormatInfo.NumberGroupSeparator`, separated by `NumberFormatInfo.NumberGroupSizes`
- `%` multiply the numeric with 100 and convert it to localized string
- `‰` multiply the numeric with 1000 and convert it to localized string
- exponential format fits `[eE][+-]?0+`, see: [documentation](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-numeric-format-strings#the-e-and-e-custom-specifiers)
- `;` to represent conditional solution for negative, zero and positive numeric within on format
    ```cs
    // first section for positive value
    // second section for negative value
    // third section for zero
    string fmt = "+#.#;-#.#;I am zero";
    123.ToString(fmt); // +123 
    (-123).ToString(fmt); // -123
    0.ToString(fmt); // I am zero
    ```
- `\` to escape any special character above

## `ToString` & `IFormattable`


## Formatting Strategy
