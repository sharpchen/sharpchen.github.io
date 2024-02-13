# Linq quick start

:::info Dependencies used
This article uses [`Dumpify`](https://github.com/MoaidHathot/Dumpify?tab=readme-ov-file) to display objects on console.
:::

## Filtering

### `Where`

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Where(x => x > 3).Dump();
```

```console
╭──────────────────────────────╮
│ WhereEnumerableIterator<int> │
├──────────────────────────────┤
│ 4                            │
│ 5                            │
│ 6                            │
╰──────────────────────────────╯
```

### `OfType`

```cs
IEnumerable<object> items = [1, 2, 3, "4", 5, "6"];
items.OfType<string>().Dump();
```

```console
╭───────────────────────────────╮
│ <OfTypeIterator>d__66<string> │
├───────────────────────────────┤
│ "4"                           │
│ "6"                           │
╰───────────────────────────────╯
```

:::info
`OfType<T>()` offers type info for compiler to determine the element type, however `Where` does not.
:::

## Partitioning

### `Skip`

### `SkipLast`

### `Take`

### `TakeLast`

### `SkipWhile`

### `TakeWhile`

## Projection

### `Select`

Generates elements from source.

```cs
IEnumerable<int> items = [1, 2, 3];
items.Select(x => x * 2).Dump();
```

### `Select` with index

`Select` has an overload to contain index of the element.

```cs
IEnumerable<char> items = ['a', 'b', 'c'];
items.Select((x, index) => $"{index}: {x}").Dump();
foreach (var (value, index) in items.Select((x, i) => (x, i)))
{
    // ...
}
```

### `SelectMany`

`SelectMany` simply flatten **two levels** of collection into one that with generated elements.

:::code-group

```cs
IEnumerable<IEnumerable<int>> items = [[1, 2, 3], [4, 5, 6]];
items.SelectMany(x => x).Dump();
```

```console[result]
╭──────────────────────────────────────────────────────────╮
│ SelectManySingleSelectorIterator<IEnumerable<int>, char> │
├──────────────────────────────────────────────────────────┤
│ '<'                                                      │
│ '>'                                                      │
│ 'z'                                                      │
│ '_'                                                      │
│ '_'                                                      │
│ 'R'                                                      │
│ 'e'                                                      │
│ 'a'                                                      │
│ 'd'                                                      │
│ 'O'                                                      │
│ 'n'                                                      │
│ 'l'                                                      │
│ 'y'                                                      │
│ 'A'                                                      │
│ 'r'                                                      │
│ 'r'                                                      │
│ 'a'                                                      │
│ 'y'                                                      │
│ '`'                                                      │
│ '1'                                                      │
│ '['                                                      │
│ 'S'                                                      │
│ 'y'                                                      │
│ 's'                                                      │
│ 't'                                                      │
│ 'e'                                                      │
│ 'm'                                                      │
│ '.'                                                      │
│ 'I'                                                      │
│ 'n'                                                      │
│ 't'                                                      │
│ '3'                                                      │
│ '2'                                                      │
│ ']'                                                      │
│ '<'                                                      │
│ '>'                                                      │
│ 'z'                                                      │
│ '_'                                                      │
│ '_'                                                      │
│ 'R'                                                      │
│ 'e'                                                      │
│ 'a'                                                      │
│ 'd'                                                      │
│ 'O'                                                      │
│ 'n'                                                      │
│ 'l'                                                      │
│ 'y'                                                      │
│ 'A'                                                      │
│ 'r'                                                      │
│ 'r'                                                      │
│ 'a'                                                      │
│ 'y'                                                      │
│ '`'                                                      │
│ '1'                                                      │
│ '['                                                      │
│ 'S'                                                      │
│ 'y'                                                      │
│ 's'                                                      │
│ 't'                                                      │
│ 'e'                                                      │
│ 'm'                                                      │
│ '.'                                                      │
│ 'I'                                                      │
│ 'n'                                                      │
│ 't'                                                      │
│ '3'                                                      │
│ '2'                                                      │
│ ']'                                                      │
╰──────────────────────────────────────────────────────────╯
```

:::

The selected `x` is the one to be flattened.
That's why we get a `char` sequence represents the concrete type name of `x`(`` <>z__ReadOnlyArray`1[System.Int32]&lt>z__ReadOnlyArray`1[System.Int32] ``).

:::code-group

```cs
IEnumerable<IEnumerable<int>> items = [[1, 2, 3], [4, 5, 6]];
items.SelectMany(x => x.ToString()).Dump();
```

```console[result]
╭─────────────────────────────────────────────────────────╮
│ SelectManySingleSelectorIterator<IEnumerable<int>, int> │
├─────────────────────────────────────────────────────────┤
│ 1                                                       │
│ 2                                                       │
│ 3                                                       │
│ 4                                                       │
│ 5                                                       │
│ 6                                                       │
╰─────────────────────────────────────────────────────────╯
```

:::

### `SelectMany` with index

```cs
IEnumerable<IEnumerable<int>> items = [[1, 2, 3], [4, 5, 6]];
items.SelectMany((x, i) => x.Select(x => $"{i}: {x}")).Dump();
```

```console
╭──────────────────────────────────────────────────────╮
│ <SelectManyIterator>d__232<IEnumerable<int>, string> │
├──────────────────────────────────────────────────────┤
│ "0: 1"                                               │
│ "0: 2"                                               │
│ "0: 3"                                               │
│ "1: 4"                                               │
│ "1: 5"                                               │
│ "1: 6"                                               │
╰──────────────────────────────────────────────────────╯
```

### `Index`

:::info
Coming from `.NET 9`...
:::

### `Cast`

Similar to `OfType`, `Cast` provides type info for compiler instead of using `Select` to cast objects, but it throws `InvalidCastException` if the element is not of the target type.

```cs
IEnumerable<int> items = [1, 2, 3];
items.Cast<string>(); // error
```

### `Chunk`

`Chunk` is opposite to `SelectMany`, it groups elements into chunks with size.

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Chunk(5).Dump();
```

```console
╭───────────────────────────╮
│ <ChunkIterator>d__70<int> │
├───────────────────────────┤
│ ╭───┬────────╮            │
│ │ # │ int[5] │            │
│ ├───┼────────┤            │
│ │ 0 │ 1      │            │
│ │ 1 │ 2      │            │
│ │ 2 │ 3      │            │
│ │ 3 │ 4      │            │
│ │ 4 │ 5      │            │
│ ╰───┴────────╯            │
│ ╭───┬────────╮            │
│ │ # │ int[1] │            │
│ ├───┼────────┤            │
│ │ 0 │ 6      │            │
│ ╰───┴────────╯            │
╰───────────────────────────╯
```

## Conditional Check

### `Any` <Badge type="info" text="immediate execution" />

### `All` <Badge type="info" text="immediate execution" />

### `Contains` <Badge type="info" text="immediate execution" />

## Manipulation

### `Append`

### `Prepend`

## Aggregation

### `Count` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Count().Dump(); // 6
items.Count(x => x > 3).Dump(); // 3
```

### `TryGetNonEnumeratedCount` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.TryGetNonEnumeratedCount(out var count1).Dump(); // true
items.Where(x => x > 3).TryGetNonEnumeratedCount(out var count2).Dump(); // false
```

### `Sum` <Badge type="info" text="immediate execution" />

### `Average` <Badge type="info" text="immediate execution" />

### `LongCount` <Badge type="info" text="immediate execution" />

### `Aggregate` <Badge type="info" text="immediate execution" />

`Aggregate` is a very special extension to perform iteration from previous context to next context.
It has three overloads:

#### First overload

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Aggregate((sum, current) => sum + current).Dump();
// equivalents to sum:
items.Sum().Dump();
```

To perform concatenation to generate a cvs row or something like that:

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Select(x => x.ToString()).Aggregate((context, current) => $"{context}, {current}").Dump();
// "1, 2, 3, 4, 5, 6"
IEnumerable<char> chars = ['a', 'b', 'c'];
chars.Select(x => x.ToString()).Aggregate((context, current) => $"{context}, {current}").Dump();
// "a, b, c"
```

#### Second overload

The second overload of `Aggregate` takes an initial value.

```cs
IEnumerable<int> items = [1, 2, 3, 4, 5, 6];
items.Aggregate(10, (sum, current) => sum + current).Dump(); // 31
```

To generate a header for csv rows:

```cs
IEnumerable<Person> people = [new("John", 30), new("Jane", 20), new("Modi", 18)];
people.Select(x => $"{x.Name}, {x.Age}")
    .Aggregate(
        $"Name, Age,{Environment.NewLine}",
        (context, current) => $"{context.TrimEnd(',')} {current}{Environment.NewLine}"
    )
    .Dump();
// "Name, Age,
// John, 30
// Jane, 20
// Modi, 18
// "
record class Person(string Name, int Age);
```

#### Third overload

The third overload of `Aggregate` takes an initial value and a result selector.
The result selector takes the final result from iteration.

```cs
IEnumerable<int> items = [1, 2, 3];
items.Aggregate(10, (sum, current) => sum + current, x => x / 2F).Dump(); // (10 + 1 + 2 + 3) / 2f = 8
```

## Element Operators

### `First` <Badge type="info" text="immediate execution" />

### `FirstOrDefault` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<int> items = [];
items.FirstOrDefault().Dump(); // 0
items.FirstOrDefault(-1).Dump(); // -1
```

### `Single`, `SingleOrDefault` and `Last`, `LastOrDefault` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<int> items = [1, 2, 3];
IEnumerable<int> single = [1];
IEnumerable<int> empty = [];
items.Single().Dump(); // System.InvalidOperationException: Sequence contains more than one element
items.SingleOrDefault().Dump(); // System.InvalidOperationException: Sequence contains more than one element
items.SingleOrDefault(-1).Dump(); // System.InvalidOperationException: Sequence contains more than one element

single.Single().Dump(); // 1
single.SingleOrDefault().Dump(); // 1
single.SingleOrDefault(-1).Dump(); // 1

empty.Single().Dump(); // System.InvalidOperationException: Sequence contains no elements
empty.SingleOrDefault().Dump(); // 0
empty.SingleOrDefault(-1).Dump(); // 0
```

### `ElementAt` and `ElementAtOrDefault` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<int> items = [1, 2, 3];
items.ElementAt(100).Dump(); // System.IndexOutOfRangeException: Index was outside the bounds of the array.
items.ElementAtOrDefault(100).Dump(); // 0
```

### `DefaultIfEmpty`

```cs
IEnumerable<int> items = [];
items.DefaultIfEmpty().Dump(); // [0]
items.DefaultIfEmpty().Count().Dump(); // 1
```

## Conversion

### `ToLookUp` vs `GroupBy`

#### `ToLookUp` <Badge type="info" text="immediate execution" />

```cs
IEnumerable<Person> people = [new("John", 30), new("Jane", 30), new("Modi", 18), new("John", 12)];
var a = people.ToLookup(x => x.Age).Dump();
people.ToLookup(x => x.Age)[30].Dump(); // John: 30, Jane: 30
people.ToLookup(x => x.Name)["John"].Dump(); // John: 30, John: 18
record class Person(string Name, int Age);
```

#### `GroupBy`

```cs
IEnumerable<Person> people = [new("John", 30), new("Jane", 30), new("Modi", 18), new("John", 12)];
people.GroupBy(x => x.Age).Dump(); // No indexer, but group as the same
record class Person(string Name, int Age);
```

## Generators

### `Range` <Badge type="info" text="immediate execution" />

### `Repeat` <Badge type="info" text="immediate execution" />

Repeat a value for a number of times.

```cs
Enumerable.Repeat(-1, 3).Dump(); // [-1, -1, -1]
```

### `Empty` <Badge type="info" text="immediate execution" />

### `AsEnumerable`

### `AsQueryable`

## Set Operations

### `Distinct`

### `DistinctBy`

### `Union`

### `UnionBy`

### `Intersect`

### `IntersectBy`

### `Except`

`Except` only includes the elements in the first sequence but not in the second.

```cs
IEnumerable<int> a = [1, 2, 3];
IEnumerable<int> b = [2, 2, 3];
a.Except(b).Dump(); // [1]
```

### `ExceptBy`

### `SequenceEqual` <Badge type="info" text="immediate execution" />

Returns if two sequences are equal by elements and their orders.

```cs
IEnumerable<int> a = [1, 2, 3];
IEnumerable<int> b = [2, 1, 3];
a.SequenceEqual(b).Dump(); // false
a.SequenceEqual(a).Dump(); // true
```

## Joining and Grouping

### `Zip`

```cs
IEnumerable<int> a = ['a', 'b', 'c'];
IEnumerable<char> b = ['a', 'b', 'c'];
IEnumerable<char> c = ['a', 'b', 'c', 'd'];
a.Zip(b).Dump(); // tuples
a.Zip(c).Count().Dump(); // 3, zips minium count of any of two collection
a.Zip(b).First().GetType().Name.Dump(); // ValueTuple`2
a.Zip(b, c).Dump();  // ValueTuple`3
a.Zip(b, c).Count().Dump();  // 3
a.Zip(b, (x, y) => new { Number = x, Character = y }).Dump();
```

### `Join`

`Join` query two data sources and select them into results.

```cs
IEnumerable<Person> people =
[
    new(1, "John", 30),
    new(2, "Jane", 30),
    new(3, "Modi", 18),
    new(4, "John", 12)
];
IEnumerable<Weight> statuses =
[
    new(1, 60),
    new(2, 45),
    new(3, 50),
    new(4, 57)
];

people.Join(
        statuses,
        p => p.Id,
        s => s.PersonId,
        (p, s) => $"Person: {p.Name} weight {s.Kilogram} kilogram"
    )
    .Dump();
record class Person(int Id, string Name, int Age);
record class Weight(int PersonId, int Kilogram);
```

```console
╭───────────────────────────────────────────────────╮
│ <JoinIterator>d__129<Person, Weight, int, string> │
├───────────────────────────────────────────────────┤
│ "Person: John weight 60 kilogram"                 │
│ "Person: Jane weight 45 kilogram"                 │
│ "Person: Modi weight 50 kilogram"                 │
│ "Person: John weight 57 kilogram"                 │
╰───────────────────────────────────────────────────╯
```

### `GroupJoin`

### `GroupBy`

### `Concat`

## Sorting

### `OrderBy` and `OrderByDescending`

### `ThenBy` and `ThenByDescending`

### `Reverse`

## Parallel Linq
