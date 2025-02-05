# Understanding Bit Operation

## Bit Shifting

### Left & Right Shifting

Left shifting moves the whole bit sequence with specific count to left, `0` will fill up the tail and the leading bits are just discarded.

```cs

uint before = 0b_1001_0000_0000_0000_0000_0000_0000_1001;
uint after = before << 4;
Console.WriteLine($"{nameof(before),6}: {before,32:B32}");
Console.WriteLine($"{nameof(after),6}: {after:B32}");

// before: 10010000000000000000000000001001
//         ^^^^                        ^^^^
//      discarded                   move left

//  after: 00000000000000000000000010010000
//                                 ^^^^
```

Right shifting does it reversely. 
The only difference is, when shifting on *signed* integers, bits would be filled with the sign bit value(`0` for positive, `1` for negative)

```cs
sbyte before = sbyte.MinValue;
sbyte after = (sbyte)(before >> 4);
Console.WriteLine($"{nameof(before),6}: {before:B8}");
Console.WriteLine($"{nameof(after),6}: {after:B8}");

```

> [!NOTE]
> Left & Right Shifting supports only `int`, `uint`, `long`, `ulong`. If you perform shifting on other integer types, the leftoperand is converted as `int`

> [!NOTE]
> If shift count exceeds the bit width or it's a negative integer, the count is determined by
> - if leftoperand is `int` or `uint`: `count = count & 0b_1_1111`
> - if leftoperand is `long` or `ulong`: `count = count & 0b_11_1111`

> [!NOTE]
> Left shifting might discard sign of the number when shift count is greater than 0
>```cs
>int foo = -0b_0001_0001_0001_0001_0001_0001_0001_0001_01;
>Console.WriteLine(foo.ToString("B32"));
>Console.WriteLine((foo << 1).ToString("B32"));
>Console.WriteLine(int.IsPositive(foo << 1)); 
>// 10111011101110111011101110111011
>// 01110111011101110111011101110110
>// True
>```

### Unsigned Right Shifting

> [!NOTE]
> `>>>` was supported since C# 11

If you want to make sure that the empty bits are filled with `0` instead of value of the sign when working with the signed integers, use `>>>`!

```cs
int before = int.MinValue;
int after = before >> 2;
int afterUnsigned = before >>> 2; // [!code highlight] 
Console.WriteLine($"{nameof(before),-20}: {before:B32}");
Console.WriteLine($"{nameof(after),-20}: {after:B32}");
Console.WriteLine($"{nameof(afterUnsigned),-20}: {afterUnsigned:B32}");

// before              : 10000000000000000000000000000000
// after               : 11100000000000000000000000000000
// afterUnsigned       : 00100000000000000000000000000000 // [!code highlight] 
```

> [!NOTE]
> Before `>>>` was added, you had to perform casting to achieve the same
>```cs
>int afterUnsigned = unchecked((int)((uint)before >> 2));
>```

## Bitwise NOT

Reverse value of each bit

```cs
uint before = 0b_0100010;
uint after = ~before;
Console.WriteLine($"{nameof(before),6}: {before,32:B32}");
Console.WriteLine($"{nameof(after),6}: {after:B}");
// before: 00000000000000000000000000100010
//  after: 11111111111111111111111111011101
```

## Bitwise OR & AND & XOR

- bitwise OR `|`: returns `1` for each bit as long as one of the two is `1`, else `0`
- bitwise AND `&`: returns `1` for each bit as long as all of the two is `1`, else `0`
- bitwise XOR `^`: returns `1` if the two bits are different, `0` when identical


## Bitwise on Enum

Enum can be flags when the type is marked with `FlagsAttribute` and ordinary enum members are powers of 2(members represent the `All` or `None` are exceptional)

```cs
[Flags]
enum Foo
{
    None = 0b0000,
    Bar  = 0b0001,
    Baz  = 0b0010,
    Qux  = 0b0100,
    Goo  = 0b1000,
    All  = 0b1111
}
// powers can be easily done by left shifting
[Flags]
enum Foo
{
    None = 0,
    Bar  = 1,
    Baz  = 1 << 1,
    Qux  = 1 << 2,
    Goo  = 1 << 3,
    All  = ~(~0 << 4)
}
```

## Bit Mask

Bit mask is a common pattern that works like a filter to include or exclude or test bits.
The mask can refer to a integer represented as binary, a sequence of integers or a matrix of integers. The classical usage is a singular number.

### Is Bit Set

A common usage of mask is checking whether certain bit **is set**

- a bit **is set** when its value is `1`
- a bit **is cleared** when its value is `0`

A mask is a predefined number with special layout designated to solve specific problem.
The following example shows how a mask is generated for the purpose.

`1` is shifted left to the position we would like to compare, and a bitwise AND is performed.
Only the position matters since other bits are all `0` in the mask.
So only when the bit on the position is set can the operation return non-zero value.

```cs
uint number = 0b_0101;
int position = 2;
int mask = 1 << position; // generate a special number 0100
bool positionIsSet = (number & mask) != 0;
```

This is the particular same case as how we tell whether a union of enum contains a enum flag.
Since each enum member has **only one bit set**, the union in the following example has two bits set, only when the set bit from the flag being checked overlaps with any bit of the union can it evaluate to non-zero.
And in fact the operation `(union & flag)` should be equal to the flag itself.

> [!WARNING]
> You have to make sure the enum member or integer to be checked is a valid member or it may evaluate to unexpected value.

```cs
Foo foo = Foo.Bar | Foo.Qux;
_ = (foo & Foo.Qux) != 0; // True
_ = (foo & Foo.Qux) == Foo.Qux; // True
_ = (foo & Foo.Goo) != 0; // False
_ = (foo & Foo.Goo) == Foo.Goo; // False

[Flags]
enum Foo
{
    None = 0,
    Bar  = 1,
    Baz  = 1 << 1,
    Qux  = 1 << 2,
    Goo  = 1 << 3,
    All  = ~(~0 << 4)
}
```
