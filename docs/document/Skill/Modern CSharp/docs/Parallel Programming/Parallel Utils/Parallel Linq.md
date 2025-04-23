# Parallel Linq

*Parallel Linq* is an extension to process your query in a parallel manner and Linq style.
Just like `Parallel` class, *Parallel Linq* is based on `Task` and are all blocking operations too.

- `ParallelEnumerable.AsParallel`: to convert a enumerable to a `ParallelQuery<T>`
- Parallel counterpart of linq operators such as `Select`, `Sum`...
- `ParallelEnumerable.AsSequential`: to convert a `ParallelQuery<T>` back to normal `IEnumerable<T>`
- `ParallelEnumerable.WithCancellation`: pass cancellation token
- `ParallelEnumerable.WithMergeOptions`: control how to buffer the scheduled iterations

## `ParallelQuery` is `IEnumerable`

`ParallelQuery<T>` is a simple wrapper on `IEnumerable<T>`, some of the implementations were overridden in the class itself, the rest were implemented as extension on `ParallelEnumerable`.
The compiler would choose another version of linq operator from `ParallelEnumerable` extension when the compile-time type is a `ParallelQuery<T>`.

```cs
public class ParallelQuery<TSource> : ParallelQuery, IEnumerable<TSource> { /* ... */ }
```

### `AsParallel` & `AsSequential` & `AsEnumerable`

- `ParallelEnumerable.AsParallel()` is for converting a enumerable to `ParallelQuery`
- `ParallelEnumerable.AsSequential()` is an extension dedicated for `ParallelQuery<T>`
    - does not change runtime type of source
    - but would notify the compiler to force the source to pick general implementations from `Enumerable` extension
    - all subsequent operations would became sequential which is not in parallel
- `ParallelEnumerable.AsEnumerable()` is a common extension on `IEnumerable<T>`, however `ParallelEnumerable.AsEnumerable` exists to unwrap the backing enumerable when working with `ParallelQuery<T>`
    - identical to `ParallelEnumerable.AsSequential()`

```cs
_ = Enumerable.Range(1, 100)
   .AsParallel()
   .Select(x => x)  // ParallelEnumerable.Select // [!code highlight] 
   .AsEnumerable()
   .Select(x => x) // Enumerable.Select // [!code highlight] 
   .AsSequential()
   .Select(x => x) // Enumerable.Select // [!code highlight] 
```

> [!NOTE]
> They're all deferred execution

## Preserve Ordering

`AsOrdered` makes sure the subsequent operation in parallel would preseve order of the original enumerable.

```cs
var seq = Enumerable.Range(1, 100);
var ordered = Enumerable.Range(1, 100)
   .AsParallel()
   .AsOrdered() // [!code highlight] 
   .Select(x => x);

Console.WriteLine(seq.SequenceEqual(ordered)); // always true // [!code highlight] 
```

However, preseving ordering would be consuming anyway, so you could disable it when ordering does not matters anymore using `ParallelEnumerable.AsUnordered`

```cs
var ordered = Enumerable.Range(1, 100)
   .AsParallel()
   .AsOrdered() // [!code highlight] 
   .Select(x => x)
   .AsUnordered(); // cancel the ordering preservation // [!code highlight] 
```

> [!NOTE]
> See [Order Preservation](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/order-preservation-in-plinq#query-operators-and-ordering)

## Cancellation & Exception

It's basically a functional version of parallel loop, so exception handling and cancellation is just as the same as `Parallel` class.

- use `ParallelEnumerable.WithCancellation` to specify a cancellation token
- cancellation is special so please catch it as `OperationCanceledException`
- other exceptions from all iterations are just wrapped in `AggregateException`
- **remember to evaluate the query** otherwise such cancellation or exception would never be triggered

```cs
var parallelSeq = ParallelEnumerable.Range(1, 100);
var cts = new CancellationTokenSource(2000);

var query = parallelSeq
    .WithCancellation(cts.Token)
    .Select(x => {
        Thread.Sleep(2000);
        cts.Token.ThrowIfCancellationRequested(); // [!code highlight] 
        if (int.IsOddInteger(x)) throw new Exception("a normal exception was thrown");
        return x * x;
    });

try {
    // you must consume query // [!code highlight] 
    _ = query.ToList(); // [!code highlight] 
} catch (AggregateException ex) {
    ex.Handle(iex => {
        switch (iex) {
            case Exception:
                Console.WriteLine(ex.Message);
                return true;
            default:
                return false;
        }
    });
} catch (OperationCanceledException) {
    Console.WriteLine($"{nameof(OperationCanceledException)} was thrown");
}
```

## Merge Option

Parallel iterations were scheduled as groups, so buffering is enabled by default and the size of group is dependent on the system.

- `ParallelMergeOptions.AutoBuffered`: the default option, buffering made by internal design
- `ParallelMergeOptions.Default`: alias to `AutoBuffered`
- `ParallelMergeOptions.FullyBuffered`: source not available until all iteration were finished
- `ParallelMergeOptions.NotBuffered`: yield item immediately whenever available

:::code-group

```cs[FullyBuffered]
var query = ParallelEnumerable.Range(1, 100);
    .WithMergeOptions(ParallelMergeOptions.FullyBuffered) // [!code highlight] 
    .Select(x => {
        Thread.Sleep(Random.Shared.Next(100));
        Console.WriteLine("produced");
        return x;
    });

foreach (var _ in query) {
    Console.WriteLine("consumed");
}

// consume only happens after all were produced when FullyBuffered is specified
// produced
// produced
// produced
// ...
// consumed
// consumed
// consumed
```

```cs[NotBuffered]
var query = ParallelEnumerable.Range(1, 100);
    .WithMergeOptions(ParallelMergeOptions.NotBuffered) // [!code highlight] 
    .Select(x => {
        Thread.Sleep(Random.Shared.Next(100));
        Console.WriteLine("produced");
        return x;
    });

foreach (var _ in query) {
    Console.WriteLine("consumed");
}

// consuming happens as long as one was available
// produced
// consumed
// produced
// consumed
// produced
// ...
// consumed
```
:::

## Performance Enhancement

### Local Storage

`ParallelEnumerable.Aggregate` is exactly the role the perform local storage, the following example uses one of its most flexible overload.

```cs
var size = Directory.EnumerateFiles(@"c:/Users//User/Projects/nix-config", "*", SearchOption.AllDirectories)
    .AsParallel()
    .Aggregate( // [!code highlight] 
        seed: 0L, // [!code highlight] 
        updateAccumulatorFunc: (localSum, curr) => localSum + new FileInfo(curr).Length, // iteration // [!code highlight] 
        combineAccumulatorsFunc: (sum, localSum) => sum + localSum, // add up when each group was finished // [!code highlight] 
        resultSelector: i => i / 1024D // post action to transform the result // [!code highlight] 
    ); // [!code highlight] 

Console.WriteLine($"size in kb: {size}"); // [!code highlight] 
```
