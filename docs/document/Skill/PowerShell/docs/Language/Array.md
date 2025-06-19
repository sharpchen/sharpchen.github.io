# Array

## Creation

```ps1
$foo = 1,2,3
$foo = @(1,2,3)

$foo = ,1 # with only one item

$foo = 1..10 # from inclusive range 1 to 10

$foo = @() # empty array
```

> [!NOTE]
> The default type of a array literal is `object[]`, you can annotate with a type.
> To create an empty array with fixed size, invoke `new()` constructor, this is also strongly typed.
> ```ps1
> [int[]]$foo = 1, 2, 3
> $bar = [int[]]::new(5)
> ```

> [!TIP]
> Prefer `,...` to create an array with single element, it has less ambiguity.

> [!NOTE]
> Things like `1,2,3` itself is an expression, you can capture them as an object.
> But it cannot spread out items except a weird `,(1,2,3)`.
>```ps1
>(1,2,3).Length # 3
>
>$(1,2,3).Length # 3 this has different semantic but with same result
>
>(,(1,2,3)).Length # 3 # does spread items # [!code highlight]
>
>(,@(1,2,3)).Length # 1 # does not spread items # [!code highlight]
>
>((gci), (gci ..)).Length # 2 # [!code highlight]
> ```

### From Expression and Statement

`@()` collects from expressions or statements like control flows that implicitly returns.
You can choose either flatten items from expressions or treat them as a sub-array.

- Use `;` to separate expressions for flatten arrays from them.
- Use `,` to separate expressions if you want them to be sub-array.

```ps1
@((1, 2, 3), (1, 2, 3)).Length # 2
@((1, 2, 3); (1, 2, 3)).Length # 6

@((ls), (ls ..)).Length # 2
@(ls; ls ..).Length # > 0

@(
    if ($true) {
        'yield this value to the array'
        'yield this value again'
    }
).Length # 2
```

### From Enumerator

Similar to expression, you can collect items from a `IEnumerator`.

```ps1
$foo = @{
    Name = 'foo'
    Age = 18
}

@($foo.GetEnumerator()).Length # 2, System.Collections.DictionaryEntry from the HashTable # [!code highlight]
```

### From Range

Range operator can create array from integer range and character range inclusively from both sides.

> [!NOTE]
> character range was added in PowerShell 6

```ps1
1..10 # 1 to 10 inclusively
'a'..'z' # a to z inclusively
```

If the *end* is less than the *start*, the array counts down from *start* to *end*

```ps1
5..1 # 5 4 3 2 1
5..-1 # 5 4 3 2 1 0 -1
```

## Access Item

Powershell allows indexer syntax to access one or more items at a time or use `Select-Object`.

```ps1
@(1,2,3)[0] # 1
@(1,2,3) | select -index 1 # 2
@(1,2,3)[0, 1] # 1, 2 returns an array though
```

> [!NOTE]
> The default value of a array item is `$null`.
> Since it's a dynamic language, there's no error raised when index is out of the range.

## Concatenation

Generates new array from two concatenated or with new item.

```ps1
((1,2,3) + (1,2,3)).Length # 6
(1,2,3) + 4 # 1,2,3,4
```

> [!NOTE]
> Can use `+=` when you operate on a array variable.

## Repetition

Use `*` to repeat the array content for certain times.

```ps1
((1,2,3) * 3).Length # 9
```

A practical usage of repetition is initialization with same value to the whole array.

```ps1
@(255) * 100 # Fill up array sized 100 with 255 to all elements
```

## Slicing

Use range operator to slice an array.

```ps1
(1..10)[0..5] # 1 to 6

(1..10)[-3..-1] # 8 to 10, last 3 items

# Reversed slicing
(1..10)[-1..-3] # 10, 9, 8; last 3 items in a reversed order

((1..10)[-1..-1]) -is [Array] # True, slicing always returns array
```

> [!NOTE]
> Differ from `C#`, range operator in Powershell is inclusive from both sides.

### Range Unions

You can specify multiple ranges for slicing with `+`, selected item will be collected together.
Separate different ranges by `+` to generate a range union.

> [!NOTE]
> A range can be a single index or simple range

```ps1
# Select 1 to 3, 5 to 6, and a single 8
(1..10)[0..2+4..5+7]
```

## Subtraction

To subtract a collection from another collection, you can certainly use `LINQ` or use a simple pipeline.

```ps1
@(1,2,3) | where { @(1, 2) -notcontains $_ } # 3
```

## Equality Checking

Collections behave differently in Powershell on equality checking, they're not based on reference but the contained items.

- `<arr> -eq <item>`: returns all items in `<arr>` equal to `<item>`.
- `<arr> -ne <item>`: returns all items in `<arr>` not equal to `<item>`.
- always returns `object[]` even for single result or no result.

```ps1
1,1,2,3 -eq 1 # 1,1
'a','b','c' -ne 'a' # 'b', 'c'

# the whole item is an array so no result is returned.
1,1,2,3 -eq 1,2 # empty array
```

> [!TIP]
> You can use `-ne` to exclude single item from a collection.

> [!NOTE]
> To do reference checking, use `[object]::ReferenceEquals`.

## Null Checking

Checking null for collections is a quirk in PowerShell, `$arr -eq $null` checks all items instead of the whole array.

```ps1
$arr = 1,2,3

$arr -eq $null # empty array

$null -eq $arr # False, the result we expected # [!code highlight]
```

> [!TIP]
> Always leave array as the right operand on null checking.

## To List

PowerShell allows direct casting a array to an `ArrayList` or generic `List<T>`.

```ps1
using namespace System.Collections.Generic

[List[int]]@(1,2,3)

[System.Collections.ArrayList]@(1,2,3)
```

## Filtering & Transformation by Keyword Operators

Keyword operators has special functionalities on collections.
`-match`, `-notmatch`, `-replace`, `-split` handles for all items in the left operand collection, the result is always an array.

```ps1
# Returns items that matches the regex
@('John', 'Jane', 'Janet') -match 'Jane' # Jane, Janet.
(gci -file) -match '.*txt$' # FileInfo with FullName matches to the pattern
(@('John', 'Jane', 'Janet') -notmatch 'Jane') -is [Array] # True, only John matches and still an array.

@('John', 'Jane', 'Janet') -replace 'J','K' # Kohn Kane Kanet
'1,2,3','1,2,3' -split ',' # 1 2 3 1 2 3, strings
```

> [!NOTE]
> If current item for `-match` or `-notmatch` is not a string, Powershell evaluates it to string by certain strategy.

> [!TIP]
> Match and replace is case-insensitive by default. Use `-cmatch`, `-cnotmatch`, `-creplace`, `-csplit` for **case-sensitive** scenarios.

## Deconstruction

```ps1
$a, $b, $c = 1,2,3 # $a = 1, $b = 2, $c = 3
$a, $b = 1,2,3 # $a = 1, $b = 3 This might not be expected # [!code warning]
```

> [!WARNING]
> You should only use deconstruction when **you need the first and the last item returned** or **you're pretty sure there's only two element will be returned**.

## Multi-Dim Array

You'll have to create Multi-Dim array from .NET type constructor only.

```ps1
$foo = [int[,]]::New(2, 2) # 2 * 2 array
```
