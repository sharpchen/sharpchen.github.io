# Understanding String Encoding

## Encoding

Strings are represented as raw bytes at memory, bytes are chaotic unless we invent a rule to read/write them in manner.
Encodings are standards for both translating raw bytes into characters and writing characters into raw bytes.

In other words, characters are truths while Encodings are languages for the truths, **Encoding is the language of language**.

- **Binary**: The Language of Electricity.
- **Hex**: The Language of Binary Groups.
- **Encoding**: The Language of Characters.
- **Character Set**: The Truth of Human Expression.

## Coded Character Set

A **Character Set** is certain set of concrete symbols, such as _A_ to _Z_ in human language.
A **Coded Character Set** is a Character Set with each item uniquely mapped to a numeric value.[^1]
These numeric values are named as **Code Points**.

[Coded Character Set](https://en.wikipedia.org/wiki/Character_encoding#Coded_character_set)

### Coded Charset is a Map

A _coded character set_ is a character set with each item uniquely mapped to a numeric value.[^1]
A character set has no real index, they theoretically exist on math, but to represent its range on computer, we have to cope with the size of integers.

> [!NOTE]
> In Unix and Unix-like systems, the term _charmap_ is commonly used.

### Encoding as Charset?

In the early days of computing, we don't have a intermediate map like Coded Character Set for encodings, we encode everything directly into bytes and vice versa.
Encoding itself became the _de facto_ Coded Character Set when there's no intermediate map, this is the very reason why so many _ancient_ encodings are also listed along with UTF encodings in your editor.
ASCII for example, it sets `65` as the concrete value in byte of `A` while `65` is also the "code point" of `A` in ASCII table, meaning that it does not have any abstraction gap.

> [!NOTE]
> Of course ASCII has no concept of _code point_, we just borrow the idea from Unicode to adapt the mental model of Unicode over ASCII.

```cs
// "code point" in ASCII is identical to its character presence in byte
// meaning that it has no abstraction gap
_ = Encoding.ASCII.GetBytes("AB") is [65, 66]; // true
_ = Encoding.ASCII.GetBytes("AB") is [(byte)'A', (byte)'B']; // true
```

## Unicode

### Universal Character Set

**Universal Character Set(UCS)** is a Coded Character Set design by Unicode.
It originally contain `2^16` characters to cover all human characters at that time, using 16-bit(2 bytes) value.
This initial version of UCS is known as **UCS-2**, 2 means it takes 2 bytes to represent any characters in its set(by code point).

#### What is Plane

But obviously we can imagine that our civilization keep evolving and creates more and more symbols to be added to UCS.
Apparently 16-bit isn't enough to represent them all, Unicode started to design larger range for UCS.
The original `2^16` range of UCS was named as **Basic Multilingual Plane(BMP)** afterward, which includes most commonly used characters.
Unicode added extra 16 planes(17 in total) for future use, namely _supplementary planes_.
Each supplementary planes has same amount of slots, which is _65536_

$$
\begin{align}
& 2^{16} = 65536 && \text{Code points in single plane} \\
& 2^{16} \times 16 = 2^{20} = 1048576 && \text{Code Points in supplementary planes} \\
& 2^{16} \times 17 = 1114112 && \text{Code Points in all planes} \\
\end{align}
$$

Not all of slots of those planes are assigned with code point, it's just a pre-allocation.

```cs
// 'A' is in BMP
_ = new Rune('A').Plane is 0;
// thumb-up emoji is in plane 1
_ = "👍".EnumerateRunes().Select(r => r.Plane).ToArray() is [1];
```

#### Surrogate Pair

Anything beyond **BMP** in UCS are of surrogate pair, two surrogates can be composed as 4-byte(`Int32`) code points.
Only code points within certain range can be composed as part of the surrogate.
The possible value of surrogates is selectively chosen from BMP, grouped as _high surrogates_(D800-DBFF) and _low surrogates_(DC00-DFFF), each has 1024 candidates in its range.
Meaning that we have 1024 times 1024 possibilities to represent characters beyond BMP, exactly the same amount of code points in supplementary planes.

<!-- TODO: why 1024 * 1024? -->

> [!NOTE]
> The high surrogates and low surrogates, `1024+1024=2048` in total, are _reserved surrogates_ in BMP.

$$
\begin{gather}
\text{high surrogates $\times$ low surrogates $\Rightarrow$ supplementary planes} \\
1024 \times 1024 = 2^{20}
\end{gather}
$$

Given that 2048 code points are reserved surrogates, we have remaining 1,112,064 code points available for actual use.

$$
\begin{gather}
\text{BMP} - \text{reserved surrogates} + \text{supplementary planes} = \text{available code points} \\
2^{16} - 2048 + 2^{20} = 1,112,064
\end{gather}
$$

Unicode officially named the characters in BMP and those composed by surrogates as **Unicode Scalar Value**.
Due to the variable-bit nature of UCS, some languages have a dedicated type to describe Unicode Scalar Value.
`System.Text.Rune` is a implementation since .NET Core 3.0, the term _Rune_ came from Go programming language[^2].

```cs
// Too many characters in character literal [CS1012]
_ = '👍'; // [!code error]

// .NET calculates it by 16-bit as single char
//  a surrogate pair contains 32-bit which results Length in 2
_ = "👍".Length is 2; // it's a surrogate
// System.Text.Rune is a proper abstraction on Unicode Scalar Value
_ = "👍".EnumerateRunes().Count() is 1; // it's a single unit in Unicode
```

Two surrogates are not combined directly by their form into new a code point, there's a simple transformation calculation formula.

$$
\begin{gather}
Surrogate\ Code\ Point \ Calculation \\
\mathtt{0x10000} + (high\ surrogate - \mathtt{0xD800}) \times \mathtt{0x400} + (low\ surrogate - \mathtt{0xDC00})
\end{gather}
$$

C# has a `\u` escape syntax for 4-digits hex for UCS code points, and `\U` for 8-digits hex code points(primarily for calculated code points of surrogates).

```cs
Console.WriteLine("\U0001F44D" == "👍");
```

> [!NOTE]
> `Rune.Value` is the calculated code point value.

#### Combining Character[^3]

One character might have counterpart/variant in other cultures, with a little modification.
Chinese pin-yin has _diacritics(变音符号)_ on _final(韵母)_, a `ü` is a modification on `u`, appending diacritic on `ü` can make it a final `ǚ`.
Here `u` is the **Base Letter** and the diacritics are **Combining Marks**[^4].

> [!IMPORTANT]
> [_Combining Mark_](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-7/#G18195) is just one of the types of _Combining Character_ in Unicode specification.
> We can inspect [the category of a Unicode characters](#unicode-category) using `Rune.GetUnicodeCategory`.

Most of these letter with diacritics have dedicated code point on BMP, which is called [**Precomposed character**](https://en.wikipedia.org/wiki/Precomposed_character):

```cs
// They're all on BMP
_ = "u".Length is 1;
_ = "ü".Length is 1;
_ = "ǚ".Length is 1;
_ = new Rune('u').Plane is 0;
_ = new Rune('ü').Plane is 0;
_ = new Rune('ǚ').Plane is 0;
```

But they also have a **composed form**, which combines _base letter_ with _combining mark_, as the specification describes:

> In the Unicode Standard, all combining characters are to be used in sequence following the base characters to which they apply.[^5]

We can "unpack" the characters being combined using [Normalization](#unicode-normalization)

The benefit of inventing yet another form to represent existing characters is, the composing form can enforce corresponding encoding to read _base letter_ before _combining marks_,
making older versions of Unicode encoding implementations able to display the _base_ and leave _combining characters_ as non-character(box/question mark).

This preserved some backward compatibility, a typical example is emoji, they're also composable.
A emoji can be composed with a regular _base_ `👍`(U+1F44D) with skin tone (U+1F3FC) in the following example.
When someone receives the emoji with skin tone in old device that has old encoding implementation, it will display a regular thumb-up and a non-character after it since the old encoding doesn't support it.
This composing method preserved important information from the modern world to the ancient clients.

> [!NOTE]
> Both emoji base and skin tones are on Plane 1, their 5-digit code points already implied this.

```cs
_ = "👍".Length is 2; // it's a surrogate pair
// emoji with skin tone is 64-bit
_ = "👍🏼".Length is 4;
// System.Text.Rune is a proper abstraction on Unicode Scalar Value
_ = "👍".EnumerateRunes().Count() is 1; // it's a single unit in Unicode
// emoji with skin tone is also scalar value in Unicode but not in C# Rune
_ = "👍🏼".EnumerateRunes().Count() is 2;

// confirms that regular thumb-up is head of skin tone version
Console.WriteLine("👍🏼".EnumerateRunes().First().Value == "👍".EnumerateRunes().First().Value);
```

#### Unicode Normalization

The term **Unicode Normalization** then appeared to describe conversion between these composing and non-composing form mentioned above.
Before discussing normalization, we must understand the difference between **Canonical** and **Compatible**.

> Conceptually, compatibility characters are characters that would not have been encoded in the Unicode Standard except for compatibility and round-trip convertibility with other standards.
> Such standards include international, national, and vendor character encoding standards.[^6]

That is, even though Unicode has a composing strategy to represent characters as many as possible, it has to retain the backward-compatibility for older encodings.
So there's some composed-like characters such as `¼` is actually a non-composable. But the standard also specified it as a decomposable, named as a dedicated [Normalization Form](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
C# has `string.Normalize(NormalizationForm)` to convert a string to target form if possible. Of course the byte presence would be different in another possible normalization form.

```cs
byte[] original = Encoding.Unicode.GetBytes("¼");
byte[] decomposed = Encoding.Unicode.GetBytes("¼".Normalize(NormalizationForm.FormKD));

// byte presence is different
_ = original.SequenceEqual(decomposed) is false;
// string normalizations are not identical on comparison
_ = ("¼" == "¼".Normalize(NormalizationForm.FormKD)) is false;
```

> Keywords for compatibility decomposable characters include: \<initial>, \<medial>, \<final>, \<isolated>, \<wide>, \<narrow>, \<small>, \<square>, \<vertical>, \<circle>, \<noBreak>, \<fraction>, \<sub>, \<super>, and \<compat>.[^7]

> [!NOTE]
> See: [Full list of decomposable characters](https://www.compart.com/en/unicode/decomposition), `¼` is under keyword `<fraction>`.

```cs
// ǚ is not compatibility character
_ = "ǚ".Normalize(NormalizationForm.FormD)
       .EnumerateRunes()
       .Select(r => r.Value)
       .ToArray() is ['u', '̈', '̌'];

// ¼ is compatibility character
_ = "¼".Normalize(NormalizationForm.FormKD)
       .EnumerateRunes()
       .Select(r => r.Value)
       .ToArray() is ['1', '⁄', '4'])
```

#### Scalar Value & Grapheme

<!-- TODO: Grapheme and scalar value are different! -->

#### Unicode Category

Any Unicode character has its named group in the specification, we may use `Rune.GetUnicodeCategory` to inspect it.
The classification is rather trivial in the Unicode specification, it currently has 29 types of characters.

```cs
_ = Rune.GetUnicodeCategory(
 "é".Normalize(NormalizationForm.FormD)
    .EnumerateRunes()
    .ElementAt(1) // the diacritic is a NonSpacingMark
) is UnicodeCategory.NonSpacingMark;

_ = Rune.GetUnicodeCategory(
    "👍🏼".EnumerateRunes()
        .ElementAt(1) // skin tone is a ModifierSymbol
) is UnicodeCategory.ModifierSymbol;
```

### Universal Transformation Format

> [!TIP]
> _UTF_ is in fact a derived format based on _Universal Coded Character Set(UCS)_.
> This implies that **we always have Coded Character Set before we implement a Encoding**, we need the map as a guide of transformation.
> The charset itself is already an [Interface](#unicode-as-interface), a intermediate presence, allowing one to implement **conversion from one encoding to another**.

**UTF16** is the direct child implemented upon UCS.
As aforementioned, UCS originally only represent characters in 16-bit code point, so UTF16 adopted the 16-bit minimum length to represent character in byte naturally.
In UTF16-first languages like C#, we might have `char` type as an abstraction layer for characters in Plane 0.

```cs
sizeof(char) == 2 * sizeof(byte) // 2 * 8 = 16bits
```

The **BMP**, the first plane of UCS contains characters that, **each of its byte presence in UTF16 are identical to its code point**, because why not?
This implies UTF16 originally had no intermediate mapping just like ASCII until surrogates were added.

#### Little & Big Endian

TODO: figure out what's [word size](<https://en.wikipedia.org/wiki/Word_(computer_architecture)#Word_size_choice>) and how CPU process certain size when writing string bytes.
TODO: and how such architecture difference requires BOM on UTF16.

<!-- Each byte in hexadecimal is part of the code point of the character. -->
<!-- For example, letter `A`(in little endian) has `0x41` as first byte, `0x00` as second byte, we can compose it to the exact `U+0041` code point of `A`. -->
<!-- For surrogate pairs(in little endian), the first 2 bytes is *high-surrogate*, the last two is *low-surrogate*, if the first 2 bytes fall under D800-DBFF the decoder knows it's reading a surrogate pair. -->
<!---->
<!-- The problem is, single byte in UTF16 is not sufficient to indicate the character's Plane. -->

For files, a non-visible indicator character is required to tell the byte-order(aka endian) which precedes the first actual value, namely **a byte order mark (BOM)**.

- `U+FEFF`: Indicates Big endian
- `U+FFFE`: Indicates Little endian

```cs
_ =          Encoding.Unicode.GetBytes("A") is [65, 0];
_ = Encoding.BigEndianUnicode.GetBytes("A") is [0, 65];

// the endian affects on each 16-bit
_ =          Encoding.Unicode.GetBytes("👍") is [061, 216, 077, 220];
_ = Encoding.BigEndianUnicode.GetBytes("👍") is [216, 061, 220, 077];
```

#### Why UTF8 and UTF32?

UTF16 is not ASCII compatible because it requires 16bits for code unit while ASCII as an encoding requires only 8bits.
UTF8 was then invented primarily for backward compatibility with ASCII, and to be more memory/storage efficient.

The byte count of UTF8 characters varies **from 1 to 4**, making it memory efficient.

1. `U+0000` to `U+007F`(0-127): ASCII characters take **1 byte**.
2. `U+0080` to `U+07FF`(128-2047): Latin, Cyrillic alphabets etc, take **2 bytes**.
3. `U+0800` to `U+FFFF`(2048-65535): The rest characters of BMP, take **3 bytes**
4. `U+010000` to `U+10FFFF`(65536-1114111): Characters of surrogate pair, take **4 bytes**.

You can notice that UTF8 takes one more byte than UTF16 for representing most of BMP characters.
Meaning that UTF8 is more memory-efficient when content is primarily made of ASCII characters.
While UTF16 would out-perform when content contains more BMP characters like CJK characters.

Almost all old C/C++ libraries prefer UTF8 due to its ASCII compatibility, because `char` type in C has 8-bit size.
UTF8 also prevailed on the web since its more compact, has higher transmission-efficiency, because html document always has more ASCII than CJK characters.

UTF8 doesn't have endian issue like UTF16, because it knows how long should it read next when reading current byte.
Each byte already implied the range of the character located, the ranges was specifically designed because we have **distinct leading binary digits** for these ranges.

Once you read `A` which is of binary `01000001`, the leading `0` implies its a ASCII character, we should only read one byte and consider this byte as a whole character.
If the current byte is `11100101`, then we know we should read next two bytes to consider the three as a whole.
This design made UTF8 extremely comprehensive at byte presence, **with no byte-order issue**.

| First Byte Bit Pattern | Meaning                       | Total Bytes          |
| ---------------------- | ----------------------------- | -------------------- |
| 0xxxxxxx               | ASCII Character               | 1 Byte               |
| 110xxxxx               | Latin, Cyrillic alphabets etc | 2 Bytes              |
| 1110xxxx               | The rest characters of BMP    | 3 Bytes              |
| 11110xxx               | Characters of surrogate pair  | 4 Bytes              |
| 10xxxxxx               | Continuation Byte             | (Invalid as a start) |

> **UTF32** is simply a radical evolution over UTF16, it takes 32-bit for every character, making it consistent but super consuming, also has byte-order problem.

### Unicode as Interface

To convert UTF16 to UTF8, we use UCS as an interface. We first convert UTF16 bytes into their code points and then convert code points to UTF8 bytes.
**So UTF encodings are implementations about how to convert bytes to UCS code points and vice versa.**

## How Input Method Works

## How Text Copying works

[^1]: https://unicode.org/glossary/#coded_character_set

[^2]: https://learn.microsoft.com/en-us/dotnet/fundamentals/runtime-libraries/system-text-rune?source=recommendations#rune-in-net-vs-other-languages

[^3]: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-2/#G1708

[^4]: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-2/#G1821

[^5]: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-7/#G18202

[^6]: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-2/#G11062

[^7]: https://en.wikipedia.org/wiki/Unicode_compatibility_characters#Compatibility_character_types_and_keywords
