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
enum Foo {
    None = 0b0000,
    Bar  = 0b0001,
    Baz  = 0b0010,
    Qux  = 0b0100,
    Goo  = 0b1000,
    All  = 0b1111
}
// powers can be easily done by left shifting
[Flags]
enum Foo {
    None = 0,
    Bar  = 1,
    Baz  = 1 << 1,
    Qux  = 1 << 2,
    Goo  = 1 << 3,
    All  = ~(~0 << 4)
}
```

## Bit Masking

Bit mask is a common pattern that works like a filter to include or exclude or test bits.
The mask can refer to a integer represented as binary, a sequence of integers or a matrix of integers. The classical usage is a singular number.

### Bit Checking

A common usage of mask is checking whether **certain position of bit is set**

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
int mask = 0b_0001 << position; // generate a special number 0100
bool positionIsSet = (number & mask) != 0;
```

This is particularly similar as how we tell whether a union of enum contains a enum flag.

Since each enum member has **only one bit set**, the union in the following example has two bits set, only when the set bit from the flag being checked overlaps with any bit of the union can it evaluate to non-zero result.

**And in fact the operation `(union & flag)` should be equal to the flag itself.**

> [!WARNING]
> You have to make sure the enum member or integer to be checked is a valid member or it may evaluate to unexpected value.

```cs
// one         0100
// two         0010
// union       0110
// union & two 0010 become two again!
Foo foo = Foo.Bar | Foo.Qux;
_ = (foo & Foo.Qux) != 0; // True
_ = (foo & Foo.Qux) == Foo.Qux; // True
_ = (foo & Foo.Goo) != 0; // False
_ = (foo & Foo.Goo) == Foo.Goo; // False

[Flags]
enum Foo {
    None = 0,
    Bar  = 1,
    Baz  = 1 << 1,
    Qux  = 1 << 2,
    Goo  = 1 << 3,
    All  = ~(~0 << 4)
}
```

### Set & Unset & Toggle

Similar to checking a bit, setting and unsetting require a same mask but different operation.

- set a bit: `number | (1 << position)`
- unset a bit: `number & ~(1 << position)`
- toggle a bit: `number ^ (1 << position)`

## Radix Conversion

A same number represented in different radix are identical.
Radix Conversion is manipulating the form of **symbolic notation**, it indeed involves some calculation to do the transformation, but **nothing changes the number's nature**.

### Binary to Hexadecimal

Binary to Hexadecimal is a great example about the symbolic nature of number radix format.
The Hexadecimal definition forcibly split Binary form into pieces by *4 bits*.
Meaning that one digit of Hexadecimal form contains 4 bits, and each digit of Hexadecimal has `$2^4=16$` possible variations.

> [!NOTE]
> The split begin from tail to head, and zero-padding the head if the rest has no enough digits.

To convert Binary to Hexadecimal, we convert binary form to decimal for each part of the split.
You may realize that the maximum value of the group of four is no larger than `0b1111`, which is `15`, the *Maximum Single-Digit Value* in radix `16`.
And then we convert decimal to Hexadecimal by its linear mapping, `0-15` to `0-9-A-F`

```
binary:  0100|1000|1101|0001
decimal: ___4|___8|__13|___1
hex:     ___4|___8|___D|___1

0b0100100011010001 == 0x48D1
```

You can notice that Binary to Hexadecimal conversion is purely a **compression** on the symbolic notation of Binary.
Or we can say **Hexadecimal is a language of Binary**. To convert it back, you **decompress** the Hexadecimal to Binary.


> [!TIP]
> Do not translate Hexadecimal to Decimal to think it in your head, the language is a intermediate of thought.
> If you translate *apple* in English before you say it out in another language, you're confusing yourself.

> [!IMPORTANT]
> Decimal is not a *compression* form for Binary, because `10` is not power of `2`

> [!NOTE]
> Octal is a legacy radix we won't discuss.

### Convert to Decimal

As aforementioned, decimal is the intermediate format, although not recommended, we constantly need to convert other radix to decimal.
The universal solution is very easy to understand, simply **factor** the number to the **power of its base**.
For each digits, we construct an entry of `base^(digit_idx-1)*digit_value` and sum them up.

$$
\begin{gather}
\mathtt{0x6D5} = (16^2 \times 6+16^1 \times 13+16^0 \times 5) = 1749
\end{gather}
$$

$$
\begin{gather}
\mathtt{0b1101} = (2^3 \times 1+2^2 \times 1+2^1 \times 0+2^0 \times 1) = 13
\end{gather}
$$

