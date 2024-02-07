# Validity of discard `_` in csharp

As a valid identifier in `C#`, there's different scenarios for `_` to behave as a regular reference or a true discard.

## What might broke `_`?

When `_` as a typed variable or member of a type, it's a true identifier

```cs
int _ = 1;
Console.WriteLine(_);
Console.WriteLine(Shared._); // valid

static class Shared 
{
    public static int _ = 1;
}
```

`_` inside for deconstruction, parameter list and inline `out` can be typed, but they're all valid discards.

```cs
// Typed discards
(int _, var _) = (1, "1");
int.TryParse("1", out var _);
var f = (int _, string _) => Console.WriteLine(_); // error CS0103: The name '_' does not exist in the current context
Console.WriteLine(_); // error CS0103: The name '_' does not exist in the current context

// Untyped discards
_ = 1;
_ = "1";
(_, _) = (1, "1");
int.TryParse("1", out _);
// you can't have a untyped delegate...
Console.WriteLine(_); // error CS0103: The name '_' does not exist in the current context
```

However, untyped discards can be broke if there exists a true `_` identifier.

```cs
int _ = 1;
(_, _) = ("1", 1); // Cannot assign string to int
int.TryParse("1", out _) // Assign to _, it's not a discard now
```

:::tip
That's why we should prefer typed discard if we do need to be cautious about declared `_`
:::

:::info
`C#` is going to make `_` as discards everywhere? See: [Open issues: Breaking changes](https://github.com/dotnet/csharplang/issues/7918)
:::
