# Reader & Writer Lock

A Reader-Writer Lock (often implemented as `ReaderWriterLock` in .NET) is a synchronization primitive that allows multiple threads to read a shared resource simultaneously but ensures exclusive access when writing to the resource. 
The primary advantage of a reader-writer lock is that it allows for higher concurrency when multiple threads are reading the resource, while still ensuring mutual exclusion for write operations.

## Usage

- `EnterWriteLock` and `EnterReadLock`
- `ExitWriteLock` and `ExitReadLock`

> [!TIP]
> Use `TryEnter*` and `TryExit*` if a timeout is required.

```cs
internal class Program
{
    private static readonly ReaderWriterLockSlim _lock = new();
    private static void Main(string[] args)
    {
        var collection = Enumerable.Range(1, 10).ToArray();
        var tasks = Enumerable.Range(1, 10).Select(_ =>
        {
            return Task.Run(() =>
            {
                try
                {
                    _lock.EnterWriteLock();
                    collection[Random.Shared.Next(collection.Length)] = 111;
                }
                finally
                {
                    _lock.ExitWriteLock();
                }
            });
        });

        Task.WaitAll(tasks);
        Console.WriteLine(string.Join(", ", collection));
    }
}
```

## Upgradable Lock

Since write lock and read lock are atomic, you can't combine the two operation as one atomic, it can be interrupted by another thread when before you enter write/read lock on current thread.
So Upgradable Lock simply provides a way to perform reading and writing as one atomic operation.

```cs
internal class Program {
    private static readonly ReaderWriterLockSlim _lock = new();
    private static void Main(string[] args) {
        var collection = Enumerable.Range(1, 10).ToArray();
        var tasks = Enumerable.Range(1, 10).Select(_ => {
            return Task.Run(() => {
                try {
                    _lock.EnterUpgradeableReadLock(); // [!code highlight] 
                    Console.WriteLine(string.Join(", ", collection));
                    try {
                        _lock.EnterWriteLock(); // allows you to enter write lock // [!code highlight] 
                        collection[Random.Shared.Next(collection.Length)] = 111;
                    } finally {
                        _lock.ExitWriteLock(); // [!code highlight] 
                    }
                } finally {
                    _lock.ExitUpgradeableReadLock(); // [!code highlight] 
                }
            });
        });

        Task.WaitAll(tasks);
    }
}
```

## Conclusion

- Use `ReaderWriterLockSlim` for a more performant experience instead of old `ReaderWriterLock`.
- Reader & Writer Lock allows **exclusive access for writing** but allows **multiple threads for reading**.
- Do not use `ReaderWriterLockSlim` on dotnet framework projects, use old `ReaderWriterLock`.
- Use `EnterUpgradeableReadLock` if you need to combine read and write as one atomic operation.
