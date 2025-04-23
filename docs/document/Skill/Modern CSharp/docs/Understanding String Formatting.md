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
string.Format("{0,-20:G}", 123);
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

### Arbitrary Numeric Format Composition

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

### DateTime Format

> [!NOTE]
> See [standard datetime format](https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings) and [Arbitrary datetime format](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings) 

### TimeSpan Format

> [!NOTE]
> See [standard TimeSpan format](https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-timespan-format-strings#the-general-long-g-format-specifier) and [Arbitrary TimeSpan format](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-timespan-format-strings) 

### Enum Format

Enum formatting is handled by `Enum.ToString` static methods. They're implicitly called as if they're intrinsic.

There's two scenarios of enum formatting
- singular value

    A valid enum value as integer can be directly evaluated as the enum name.
    More specifically, the format is **G**eneral when there's no format specified.
    If an integer is not a valid value for the enum, compiler does not yell but the default evaluation for it will be the number itself
    ```cs
    Console.WriteLine(((DayOfWeek)0).ToString()); // Sunday
    Console.WriteLine(((DayOfWeek)0).ToString("G")); // Sunday
    Console.WriteLine(((DayOfWeek)7).ToString()); // 7, which is not a member of the enum
    ```
    However, `Enum.ToString` supports `F` format for a invalid value of enum that can be formatted as a union
    > [!NOTE]
    > Respectively you can use `D` and `X` to enforce format a enum or enum union to be decimal numeric and hexadecimal when the enum is a valid flag
    ```cs
    Console.WriteLine(((DayOfWeek)7).ToString("F")); // Monday, Saturday
    Console.WriteLine((Foo.Bar | Foo.Baz).ToString("F")); // Bar, Baz
    enum Foo {
        None = 0b0000,
        Bar  = 0b0001,
        Baz  = 0b0010,
        Qux  = 0b0100,
        Goo  = 0b1000,
        All  = 0b1111
    }
    ```
- bitwise or
    As long as the enum was marked with `FlagAttribute` and all member values are in a powered order, the bitwise or result of any distinct combination can be formatted as the names of enum member separated by comma.
    ```cs
    var foo = (Foo.Bar | Foo.Baz | Foo.Bar).ToString(); // Bar, Baz
    [Flags]
    enum Foo {
        None = 0b0000,
        Bar  = 0b0001,
        Baz  = 0b0010,
        Qux  = 0b0100,
        Goo  = 0b1000,
        All  = 0b1111
    }
    ```


## Custom Formatting

Before we implement a custom process for our format, we have to understand the common interfaces for formatting.

### `IFormatProvider`

`System.IFormatProvider` acts like a wrapper to cover generic solution for formatting.
The return type is `object` which means the *format* to be returned here can be any kind of representation, the use is really dependent on the method that uses the `IFormatProvider`.
The *format* object returned may contain some **culture-related information**, such as negative sign for numerics. And the object is usually a `IFormatProvider` too.

```cs
public interface IFormatProvider {
    object? GetFormat(Type? formatType);
}
```

The parameter is the type of the type should handle the *format* so we can return different formatting solution for different kinds of values.
That is to say, we commonly have a conditional statement inside the implementation of `IFormatProvider.GetFormat`.

`CultureInfo` is typically a `IFormatProvider` that hanles numeric and datetime in `IFormatProvider.GetFormat(Type? type)`

```cs
// implementation in CultureInfo
public virtual object? GetFormat(Type? formatType) {
    if (formatType == typeof(NumberFormatInfo)) {
        return NumberFormat; // [!code highlight] 
    }
    if (formatType == typeof(DateTimeFormatInfo)) {
        return DateTimeFormat;
    }

    return null;
}

// where NumberFormat is a process to generate a NumerFormatInfo based on Culture
public virtual NumberFormatInfo NumberFormat {
    get {
        if (_numInfo == null) {
            NumberFormatInfo temp = new NumberFormatInfo(_cultureData); // [!code highlight] 
            temp._isReadOnly = _isReadOnly;
            Interlocked.CompareExchange(ref _numInfo, temp, null);
        }
        return _numInfo!;
    }
    set {
        ArgumentNullException.ThrowIfNull(value);

        VerifyWritable();
        _numInfo = value;
    }
}
```

The actual usage of `GetFormat` inside the caller method is like

```cs
var provider = new CultureInfo("en-US");
var format = (NumberFormatInfo)provider.GetFormat(typeof(NumberFormatInfo));
```

It's kind of strange that you already know the type of *format* but still, it's just an identification on what kind of the handler should be returned.
And the `Type` should be the optimal solution since we don't know what would be formatted anyway, so we can't say there can here a enumeration as parameter.

### `ICustomFormatter`

Implementing `ICustomFormatter` means the type can handle formatting for a single value as a external handler

- `format`: the format for the value
- `arg`: the value
- `formatProvider`: provider for formatting

```cs
public interface ICustomFormatter {
    string Format(string? format, object? arg, IFormatProvider? formatProvider);
}
```

We always implement both `IFormatProvider` and `ICustomFormatter` if you want to customize your own format for any type(even existing types since `ICustomFormatter` has higher priority)
**That is because composite formatting methods only accepts `IFormatProvider` as an variant supplier**, it's a good practice to do it in a same type.
And the identity as a `ICustomFormatter` should always be provided from `IFormatProvider.GetFormat`

The way to retrieve a `ICustomFormatter` inside a composite formatting method is like

```cs
ICustomFormatter? cf = (ICustomFormatter?)provider?.GetFormat(typeof(ICustomFormatter)); // [!code highlight] 
// .. a super long process to parse the whole format string
if (cf != null) {
    s = cf.Format(itemFormat, arg, provider); // [!code highlight] 
}
```

> [!NOTE]
> `typeof(ICustomFormatter)` is the only possible identification here, because it's a custom, external way.

While in the implementation side, the `ICustomFormatter` should be returned in `IFormatProvider.GetFormat` just like

```cs
class CustomFormatter : IFormatProvider, ICustomFormatter {
    public object GetFormat(Type? formatType) {
      if (formatType == typeof(ICustomFormatter))
         return this; // [!code highlight] 
      else { // ... handle other types }
    }

    public string Format(string? format, object? arg, IFormatProvider? formatProvider) {
        Type? type = arg?.GetType();
        if (type == typeof(long)) {
            //...
        } else if (type == typeof(int)) {
            // ...
        }
    }
}
```

### `IFormattable`

Implementing `IFormattable` means the type itself can handle the formatting for the value it represents.

- `format`: the format for the value
- `formatProvider`: provider used for the formatting

```cs
public interface IFormattable {
    string ToString(string? format, IFormatProvider? formatProvider);
}
```

```cs
class CustomObject : IFormattable {
    
   public string ToString(string format, IFormatProvider? provider) {
      if (String.IsNullOrEmpty(format)) format = "G"; // use G as general // [!code highlight] 
      provider ??= CultureInfo.CurrentCulture; // [!code highlight] 

      switch (format.ToUpperInvariant()) { // [!code highlight] 
         case "G":
         case "C":
         case "F":
         case "K":
         default:
            throw new FormatException(string.Format("The {0} format string is not supported.", format));
      }
   }
}
```

## Formatting Strategy

We already knew that the approaches how dotnet handles formatting for builtin types and custom types.
Those solutions are all tried on methods like `string.Format` with following order.

- If the value to be formatted is `null`, returns `string.Empty`
- If the `IFormatProvider` secified is `ICustomFormatter`, `ICustomFormatter.Format(string? fmt, IFormatProvider? fmtProvider)` would be called
    - If `ICustomFormatter.Format` returns `null` for current value, steps into next solution.
- If `IFormatProvider` is specified
    - If the value is `IFormattable`, `IFormattable.ToString(string fmt, IFormatProvider? fmtProvider)` is called
- `object.ToString` or overrided version was called if all approaches above are failed.

```cs
ICustomFormatter? cf = (ICustomFormatter?)provider?.GetFormat(typeof(ICustomFormatter)); // [!code highlight] 

string? s = null;

if (cf != null) {
    if (!itemFormatSpan.IsEmpty)
        itemFormat = new string(itemFormatSpan);
    s = cf.Format(itemFormat, arg, provider); // [!code highlight] 
}

if (s == null) { // if ICustomFormatter.Format returns null // [!code highlight] 
    // If arg is ISpanFormattable and the beginning doesn't need padding,
    // try formatting it into the remaining current chunk.
    if ((leftJustify || width == 0) &&
        arg is ISpanFormattable spanFormattableArg &&
        spanFormattableArg.TryFormat(_chars.Slice(_pos), out int charsWritten, itemFormatSpan, provider)) {
        // ..
    }

    if (arg is IFormattable formattableArg) { // [!code highlight] 
        if (itemFormatSpan.Length != 0)
            itemFormat ??= new string(itemFormatSpan);
        s = formattableArg.ToString(itemFormat, provider); // [!code highlight] 
    } else s = arg?.ToString();  // object.ToString as the last resort // [!code highlight] 

    s ??= string.Empty; // if all solution were tried but still null // [!code highlight] 
}
```

> [!NOTE]
> `ISpanFormattable` is a more advance topic since .NET 6.

## Formatting in Interpolated String

### Use Culture

Interpolated strings are always formatted using `CultureInfo.CurrentCulture` by default.

- .NET 5 and earlier: `FormattableString` can be used as a wrapper of a interpolated string and use `FormattableString.ToString(IFormatProvider)` to format it by certain culture.

    ```cs
    FormattableString str = $"I am a syntax sugar for {"FormattableString"}";
    _ = str.ToString(CultureInfo.CreateSpecificCulture("en-US"));
    ```

- since .NET 6: using `string.Create(IFormatProvider? provider, ref DefaultInterpolatedStringHandler handler)` is a more performance solution.
    The syntax shorthand is kind of extreme, you don't even have to specify `ref`, compiler will do it for you.

    ```cs
    _ = string.Create(
        CultureInfo.CreateSpecificCulture("en-US"),
        $"I am a syntax sugar for {"DefaultInterpolatedStringHandler"}"
    );
    ```

### Interpolated String Handler

<!--TODO:expalin how a Interpolated string handler work, what is a handler pattern-->
> [!NOTE]
> See [Interpolated String Handler Pattern](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-10.0/improved-interpolated-strings#the-handler-pattern)
> and [Custom Interpolated String Handler](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/performance/interpolated-string-handler) 
