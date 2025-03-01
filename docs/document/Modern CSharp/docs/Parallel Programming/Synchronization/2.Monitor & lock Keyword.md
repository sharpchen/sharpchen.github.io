# Monitor & lock Keyword

Locking an object meaning that only one thread can access the object at a time.
Other threads have to wait until the `Monitor` exits.

```cs
BankAccount account = new();

var deposits = Enumerable.Range(1, 100)
    .Select(_ => Task.Run(() => account.Deposit(100))); // [!code highlight] 
var withdraws = Enumerable.Range(1, 100)
    .Select(_ => Task.Run(() => account.Withdraw(100))); // [!code highlight] 

Task.WaitAll([.. deposits, .. withdraws]);
Console.WriteLine(account.Balance); // now always 0 // [!code highlight] 

public class BankAccount
{
    private readonly object _lock = new(); // [!code ++] 
    public decimal Balance { get; private set; }
    public void Deposit(decimal amount)
    {
        lock (_lock) // [!code ++] 
            Balance += amount;
    }
    public void Withdraw(decimal amount)
    {
        lock (_lock) // [!code ++] 
            Balance -= amount;
    }
}
```

> [!NOTE]
> `lock` statement is just a syntax sugar for `Monitor.Enter(obj)` and `Monitor.Exit(obj)`
>```cs
>public void Deposit(decimal amount)
>{
>    Monitor.Enter(_lock); // [!code highlight] 
>    Balance += amount;
>    Monitor.Exit(_lock); // [!code highlight] 
>}
>public void Withdraw(decimal amount)
>{
>    Monitor.Enter(_lock); // [!code highlight] 
>    Balance -= amount;
>    Monitor.Exit(_lock); // [!code highlight] 
>}
>```

## Do Not Lock on Self

Lock on a new object field is always the recommended way. `lock(this)` might work only when the locking happens inside the method body.
If the containing object was locked outside, such operation might cause a deadlock.

Here, the Transfer method locks on the `from` and `to` instances.
If the `BankAccount` class internally uses `lock(this)`, this could lead to a deadlock if two threads attempt to transfer money between the same accounts in opposite directions.

```cs
public class BankAccount
{
    public decimal Balance { get; private set; }
    public void Deposit(decimal amount)
    {
        lock (this)  // [!code warning] 
            Balance += amount;
    }
    public void Withdraw(decimal amount)
    {
        lock (this)  // [!code warning] 
            Balance -= amount;
    }
    public void Transfer(BankAccount from, BankAccount to, decimal amount)
    {
        lock (from) // [!code warning] 
        { // [!code warning] 
            lock (to) // [!code warning] 
            { // [!code warning] 
                from.Withdraw(amount); // [!code warning] 
                to.Deposit(amount); // [!code warning] 
            } // [!code warning] 
        } // [!code warning] 
    }
}
```

## Lock Object <Badge type="info" text=".NET 9" />

`.NET 9` introduced a new dedicated `Lock` type as a replacement for normal `object` field.

`Lock` has three kinds of usages to do the same thing as `lock` statement

- `using (_lock.EnterScope) { ... }`
- `lock` on the `Lock` field just like locking on `object` field.
- `_lock.Enter & _lock.Exit` like `Monitor`

```cs
private readonly Lock _lock = new();
public void Foo() {
    // auto dispose
    using (_lock.EnterScope()) { }

    // or
    _lock.Enter();
    try {
        // 
    } finally {
        _lock.Exit(); 
    }
    // or
    if (_lock.TryEnter()) {
        try {
            // Critical section associated with _lock
        } finally { 
            _lock.Exit(); 
        }
    }
}
```

## Conclusion

- Use `lock` as shorthand for `Monitor.Enter(obj)` and `Monitor.Exit(obj)`
- Always lock on a private object field to prevent deadlock.

