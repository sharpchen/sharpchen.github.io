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
> ```ps1
> [int[]]$foo = 1, 2, 3
> ```

> [!TIP]
> Prefer `,...` to create an array with single element, it has less ambiguity.

> [!NOTE]
> Things like `1,2,3` itself is an expression, you can capture them as an object.
> But it cannot spread out items except a weird `,(1,2,3)`.
>```ps1
>(1,2,3).Length # 3
>
>(,(1,2,3)).Length # 3 # does spread items # [!code highlight] 
>
>(,@(1,2,3)).Length # 1 # does not spread items # [!code highlight] 
>
>((gci), (gci ..)).Length # 2 # [!code highlight] 
> ```

### Collect from Expressions

`@()` actually collects from expressions, and all items from expressions will be flattened into a whole array.
So it can be another way to spread out arrays into one.

- Use `;` to separate expressions for flatten arrays from them.
- Use `,` to separate expressions if you want them to be sub-array.

```ps1
@((1, 2, 3), (1, 2, 3)).Length # 2
@((1, 2, 3); (1, 2, 3)).Length # 6

@((ls), (ls ..)).Length # 2
@(ls; ls ..).Length # > 0
```

## Access an Item

Powershell allows indexer syntax to access one or more items at a time.

```ps1
@(1,2,3)[0] # 1
@(1,2,3)[0, 2] # 1, 3
```

## Concatenation

Generates new array from two concatenated.

```ps1
((1,2,3) + (1,2,3)).Length # 6
```

## Repetition

Use `*` to repeat the array content for certain times.

```ps1
((1,2,3) * 3).Length # 9
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

## Multi-Dim Array

You'll have to create Multi-Dim array from .NET type constructor only.

```ps1
$foo = [int[,]]::New(2, 2) # 2 * 2 array
```
