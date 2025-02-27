# Concurrent Collections


## `ConcurrentDictionary`

All operations of `ConcurrentDictionary<,>` including methods, properties and indexer are thread-safe.
There's some unique methods dedicated to `ConcurrentDictionary<,>` rather than `Dictionary<,>`

- `AddOrUpdate`: add or update the value dependent on old value.
- `GetOrAdd`: get or add the value dependent on the key.
- `TryRemove(key, out var value)`: remove if key exists.

> [!TIP]
> If the value you would add or update  does not dependent on the existing value, using indexer would be better.
> If you care to **get** the value, always use `TryGet*` or `GetOrAdd` to avoid exceptions.

```cs
ConcurrentDictionary<string, string> dict = [];

string? val;

// if key is registered, update with the transformed value
// if key is not registered, callback wouldn't be called
val = dict.AddOrUpdate("key", "newValue", (key, old) => $"transformed {old} for {key}");
// add with transformed key 
// or 
// update with transformed with key and old value.
val = dict.AddOrUpdate(
    "key",
    key => $"transformed from {key} on add",
    (key, old) => $"transformed {old} for {key} on update"
);

// if the key is not registered, add with the generated value
// or just return the value
val = dict.GetOrAdd("foo", key => $"generated using {key}");
// add with raw value
val = dict.GetOrAdd("foo", "newValue");

// value is the value corresponds to the key
if (dict.TryRemove("key", out string? value))
    Console.WriteLine($"value {value} has been removed");
```

## `ConcurrentQueue`

```cs
using System.Collections.Concurrent;

ConcurrentQueue<string> queue = [];

queue.Enqueue("foo");

if (queue.TryDequeue(out var result))
    Console.WriteLine(result);

if (queue.TryPeek(out var head))
    Console.WriteLine(head);
```

## `ConcurrentStack`

```cs
using System.Collections.Concurrent;

ConcurrentStack<int> stack = [];

stack.Push(1);
stack.PushRange([2, 3, 4]);

if (stack.TryPeek(out var top))
    Console.WriteLine(top);

if (stack.TryPop(out var result))
    Console.WriteLine(result);

// pop a range to another collection
// the new container should have valid Length or Count
int[] dest = new int[stack.Count];
if (stack.TryPopRange(dest, startIndex: 0, count: stack.Count) > 0)
    Console.WriteLine(string.Join(", ", dest));

// or pop them all directly
if (stack.TryPopRange(dest) > 0)
    Console.WriteLine(string.Join(", ", dest));
```

## `ConcurrentBag`

`ConcurrentBag<T>` is a collection that its order is not guaranteed. But each peek or take within the same thread always returns the same value added by the thread.

```cs
using System.Collections.Concurrent;

ConcurrentBag<int> bag = [];

var tasks = Enumerable.Range(1, 10).Select(i => {
    return Task.Run(() => {
        Console.WriteLine($"i: {i}");
        bag.Add(i);
        if (bag.TryPeek(out var result)) // [!code highlight] 
            Console.WriteLine($"Peek: {result}"); // result is always the i been added within the same thread // [!code highlight] 
    });
});

Task.WaitAll(tasks);

if (bag.TryPeek(out var result))
    Console.WriteLine(result); // random when access from main thread
```

That is because `ConcurrentBag` creates dedicated list for each thread so each thread wouldn't have to content for a same list, and you can only access those items been added within the same thread.

```cs
var tasks = Enumerable.Range(1, 10).Select(i => {
    return Task.Run(() => {
        bag.Add(i); bag.Add(i); bag.Add(i); // add 3 times in the thread // [!code highlight] 

        while (bag.TryTake(out var result)) // [!code highlight] 
            Console.WriteLine(result); // write i for 3 times since it was added 3 times within the same thread // [!code highlight] 
    });
});
```

## `BlockingCollection`

Dedicated concurrent collections except `ConcurrentDictionary` implements a special interface `IProducerConsumerCollection<T>`

```cs
// Defines methods to manipulate thread-safe collections intended for producer/consumer usage.
// This interface provides a unified representation for producer/consumer collections 
// so that higher level abstractions such as BlockingCollection<T> can use the collection as the underlying storage mechanism.
public interface IProducerConsumerCollection<T> : IEnumerable<T>, IEnumerable, ICollection
{
    void CopyTo(T[] array, int index);

    T[] ToArray();

    bool TryAdd(T item);

    bool TryTake([MaybeNullWhen(false)] out T item);
}
```

`BlockingCollection<T>` is a dedicated **wrapper** to serve for any `IProducerConsumerCollection<T>` by limiting the maximum concurrent item count could a inner `IProducerConsumerCollection<T>` have.
If the limit were reached, any operation on it including **producing** and **consuming** would be blocked(methods without indicator such as `Add`) or failed(methods such as `TryAdd`) on the thread.
Such **Producer-Consumer** pattern is done by indicators returned from `bool IProducerConsumerCollection<T>.TryAdd(out var _)` and so on...

> [!NOTE]
> - **consume**: meaning the item was taken and removed from the inner concurrent collection
> - **produce**: adding a item to the collection

```cs
using System.Collections.Concurrent;

BlockingCollection<int> items = new(new ConcurrentBag<int>(), boundedCapacity: 5); // [!code highlight] 
CancellationTokenSource cts = new();

var produce = Task.Run(() => {
    while (true) {
        cts.Token.ThrowIfCancellationRequested();
        var next = Random.Shared.Next(1, 9);
        if (items.TryAdd(next)) // would fail if reached the boundedCapacity // [!code highlight] 
            Console.WriteLine($"{next} was produced");
        // no throttling here so producing is way faster than consuming // [!code highlight] 
    }
}, cts.Token);

var consume = Task.Run(() => {
    foreach (var item in items.GetConsumingEnumerable()) {
        cts.Token.ThrowIfCancellationRequested();
        Console.WriteLine($"{item} was consumed");
        Thread.Sleep(Random.Shared.Next(500, 1000)); // throttling
    }
}, cts.Token);

Console.ReadKey();
cts.Cancel();
```

As you run the example you would find even the producer should produce faster but it blocks the appending when it reached the limit.
