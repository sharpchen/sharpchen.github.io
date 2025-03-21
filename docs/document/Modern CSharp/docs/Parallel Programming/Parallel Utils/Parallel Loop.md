# Parallel Loop

`Parallel` static class provides utilities based on `Task` to perform parallel enumerations, all parallel operation are shipped with a `Task`

- `Parallel.For`: range based parallel enumerations, an simulation of `for` statement
- `Parallel.ForEach`: parallel enumerations for `IEnumerable` and `IAsyncEnumerable`
- async counterpart of `For` and `ForEach`
- optionally run with a `ParallelOptions`: to specify cancellation token, paralleism degree and task scheduler.
- access state of entire loop by a `ParallelLoopState` parameter in callback.

Additionally an `Invoke` exists to run action in parallel.

- `Parallel.Invoke`: invoke multiple actions in parallel

> [!NOTE]
> Each non-async method from `Parallel` are blocking operations that would block the thread until all tasks were terminated.

## For

```cs
var files = Directory.GetFiles(@"C:/Users/User/Projects/nix-config", "*", SearchOption.AllDirectories);

long totalSize = 0;

Parallel.For(0, files.Length, idx => {
    FileInfo info = new(files[idx]);
    Interlocked.Add(ref totalSize, info.Length); // [!code highlight] 
});

Console.WriteLine(totalSize);
```

## ForEach

```cs
string[] files = Directory.GetFiles(@"~/projects/", "*", SearchOption.AllDirectories);

long totalSize = 0;

Parallel.ForEach(files, f => {
    FileInfo info = new(f);
    Interlocked.Add(ref totalSize, info.Length); // [!code highlight] 
});

Console.WriteLine(totalSize);
```

### Enumerate by Step

`Parallel.For` does not provide an overload to skip a count on each iteration. But it could be achieved by using a iterator method.

```cs
int[] numbers = [.. Enumerable.Range(1, 10)];

Parallel.ForEach(Range(1,numbers.Length , 2), idx => {
    _ = numbers[idx]; // [!code highlight] 
});

static IEnumerable<int> Range(int start, int end, int step) { // [!code highlight] 
    for (int i = start; i < end; i += step) { // [!code highlight] 
        yield return i; // [!code highlight] 
    } // [!code highlight] 
} // [!code highlight] 
```

## Break Parallel Loop

Parallel loop methods provides overloads supports extra parameter typed as `ParallelLoopState` for the callback to describe the state of the iterations.
The state could control the termination of iterations, but in a different manner since they're parallel.
Each iteration would start when the scheduler has enough places to activate the tasks, the remaining would still have to wait.

- `ParallelLoopState.Stop()`:
    - Any iteration that hasn't started yet will not be scheduled.
    - Any iteration that is already running will continue to completion.
    - **Does not terminate current thread**

- `ParallelLoopState.Break()`:
    - Any iteration that hasn't started yet(*except the ones with index less than current index*) will not be scheduled.
    - Any iteration that is already running will continue to completion.
    - **Does not terminate current thread**

```cs
Parallel.ForEach(
    Enumerable.Range(1, 2_000_000), // would all that many iterations be started? // [!code highlight] 
    (n, state) => {
        Console.WriteLine(n);
        // let's break on a condition that would hit for real quick
        // so you would see only few iterations were started
        if (int.IsOddInteger(n)) { // [!code highlight] 
            state.Stop(); // [!code highlight] 
        } // [!code highlight] 
    }
);
```

It's hard to exemplify what `Break` does in a concurrent context.

```cs
Parallel.ForEach(
    Enumerable.Range(1, 2_000_000), // would all that many iterations be started? // [!code highlight] 
    (n, state) => {
        // let's break on a condition that would hit for real quick
        // so you would see only few iterations were started
        if (n == 123) {
            state.Break(); // [!code highlight] 
        }

        Console.WriteLine(n); // would still prints 123 after Break() // [!code highlight] 
    }
);
```

You could examine that the `Break` does not terminate the current thread by

```ps1
dotnet run | sls \b123\b
```

> [!NOTE]
> `ShouldExitCurrentIteration` would be true after `Stop()` or `Break()` or any exception was thrown.

> [!TIP]
> Additionally you could use `IsStopped` and `IsExceptional` to coordinate in other running iterations when `Stop()` was called or any exception was thrown from any iteration.

## Exception Handling

Any exception from any iteration would break all other iterations not started yet, and terminate the loop **as soon as all currently running iterations finish.**

Since `Parallel` utils are synchronous and blocking, `AggregateException` could be caught from it. Each iteration could possibly push exceptions to `AggregateException.InnerExceptions`.

```cs
try {
    Parallel.For(1, 10_000_000, (n, state) => {
        Console.WriteLine(n);

        if (int.IsOddInteger(n))
            throw new Exception(); // multiple thread would throw this
    });
} catch (AggregateException ex) {
    ex.Handle(iex => {
        Console.WriteLine(iex.Message); // write this for multiple times for thrown from multiple threads
        return true;
    });
}

// 9166664
// 833334
// 9999997
// 4166666
// Exception of type 'System.Exception' was thrown.
// Exception of type 'System.Exception' was thrown.
// Exception of type 'System.Exception' was thrown.
// Exception of type 'System.Exception' was thrown.
// Exception of type 'System.Exception' was thrown.
```

### Cancellation is Unique

Cancellation on a parallel loop is unique because it is dedicatedly to cancel the entire loop, not specific running thread.
And the cancellation should only be triggered as if for once and **terminate all iterations not matter they're running or not**.
So expectation made the runtime to propagate `OperationCancelledException` thrown by `token.ThrowIfCancellationRequested` **directly** instead of wrapping it inside a `AggregateException` when the **cancellation is succeeded**.

> [!NOTE]
> Only a succeeded cancellation would propagate `OperationCanceledException` directly, or it would be wrapped inside `AggregateException`.

```cs
CancellationTokenSource cts = new(millisecondsDelay: 2000);

try {
    Parallel.For(
        0,
        10, 
        new ParallelOptions() { CancellationToken = cts.Token },
        _ => { // [!code highlight] 
            while (true) // [!code highlight] 
                cts.Token.ThrowIfCancellationRequested(); // [!code highlight] 
        }
    ); // [!code highlight] 
} catch (AggregateException ex) {
    ex.Handle(iex => {
        if (iex is OperationCanceledException) {
            // not reachable 
            Console.WriteLine($"{nameof(OperationCanceledException)} was caught by {nameof(AggregateException)}");
            return true;
        }
        return false;
    });
} catch (OperationCanceledException) { // [!code highlight] 
    // would hit here since cancellation should be succeeded // [!code highlight] 
    Console.WriteLine($"{nameof(OperationCanceledException)} was propagated directly"); // [!code highlight] 
} // [!code highlight] 
```

## Performance Enhancement

### Thread-Local Storage

If one could calculate partially on **each worker thread**(the thread manages a batch of iterations), and finally add up all partial results to the target variable, it could be much more efficient than contenting one single variable from threads.
Such approach is call **Thread-Local Storage**, a dedicated storage target for each worker thread.
The design is pretty similar to `Enumerable.Aggregate` that folds calculation base on a given initial value on each iteration.

```cs
string[] files = Directory.GetFiles(@"C:/Users/User/Projects/nix-config", "*", SearchOption.AllDirectories);

long size = 0L;
// calculate file size using thread local storage
// to be more efficient
Parallel.ForEach(
    source: files,
    localInit: () => 0L, // initial value for the thread local storage // [!code highlight] 
    body: (f, state, sum) => { // just like a Aggregate but with extra state // [!code highlight] 
        return sum + new FileInfo(f).Length; // [!code highlight] 
    }, // [!code highlight] 
    // add up to target variable when all iterations of a worker thread were finished
    localFinally: sum => Interlocked.Add(ref size, sum)  // [!code highlight] 
);

Console.WriteLine(size);
```

### Partitioning

Partitioning is a trade-off solution when **invoking callback delegates in parallel loop is way too expensive** and **the operation within the delegate body is relatively fast enough**.
So one can partition items from source with specified count into **ranges** and process each range **within a same thread**(because each operation is fast enough), so this reduces the cost of involing delegate callback by reducing the thread count started by the loop.

> [!NOTE]
>`Partitioner` requires collections **with indexer** to work with, it's the only way to represent a range.

```cs
// calculating sum of a large array is a good example for partitioning
// for it has simple operation on adding up
// and to avoid callback on each iteration
// optionally you could avoid resource contention by Thread-Local storage

int[] source = Enumerable.Range(1, 1000 * 1000).ToArray();

var partition = Partitioner.Create(0, source.Length); // auto slice ranges from source // [!code highlight] 

long sumOfArray = 0L;

Parallel.ForEach(
    partition, // iterate on ranges instead // [!code highlight] 
    () => 0L,
    (range, _, sum) => {
        var (start, end) = range; // unpack the tuple // [!code highlight] 
        for (int i = start; i < end; i++) {
            sum = checked(sum + source[i]);
        }
        return sum;
    },
    sum => Interlocked.Add(ref sumOfArray, sum)
);

Console.WriteLine(sumOfArray);

// you can direct sum this using linq // [!code error] 
// because it returns int which might overflow for such a large // [!code error] 
Console.WriteLine(source.Sum() is int);  // System.OverflowException // [!code error] 
```

## Invoke

`Parallel.Invoke` is not really a loop, but I can't find a appropriate place to introduce it.
It simply run multiple actions in a parallel manner as an blocking operation, no async counterpart exist.

```cs
// blocking operation
Parallel.Invoke(
    () => Console.WriteLine(1),
    () => Console.WriteLine(2),
    () => Console.WriteLine(3),
    () => Console.WriteLine(4)
); //  order is not guaranteed
```
