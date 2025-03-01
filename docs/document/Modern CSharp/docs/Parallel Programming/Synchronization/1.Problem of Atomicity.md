# Why Lock?

## What is Atomicity

An operation cannot be interrupted is atomic.

- Assignment to reference type
- Direct assignment to value type
- Reads and writes for <=32bit value types on 32bit-platform
- Reads and writes for <=64bit value types on 64bit-platform

### Example

An write to a value type property calculates a temporary value and assigns it to the backing field.
So there's a gap when you calculate such temporary value so other thread might come in to mess up the operation.

The follwing example demonstrates how a  bank account deposit and withdraw 100 times with a same amount simultaneously which not always results a non-zero value.

```cs
BankAccount account = new();

// modify the value concurrently // [!code highlight] 
var deposits = Enumerable.Range(1, 100)
    .Select(_ => Task.Run(() => account.Deposit(100))); // [!code highlight] 
var withdraws = Enumerable.Range(1, 100)
    .Select(_ => Task.Run(() => account.Withdraw(100))); // [!code highlight] 

Task.WaitAll([.. deposits, .. withdraws]);

Console.WriteLine(account.Balance); // not always 0  // [!code warning] 

public class BankAccount
{
    public int Balance { get; private set; }
    public void Deposit(int amount) { Balance += amount; }
    public void Withdraw(int amount) { Balance -= amount; }
}
```

## Solution

- Use `Monitor` or `lock` keyword
- `InterLocked` static utils dedicated for **integer types**, it's **more performant** than `lock`
    ```cs
    public class BankAccount
    {
        private int _balance; // [!code ++] 
        public int Balance { get => _balance; private set => _balance = value; }

        public void Deposit(int amount)
        {
            Interlocked.Add(ref _balance, amount); // [!code ++] 
        }
        public void Withdraw(int amount)
        {
            Interlocked.Add(ref _balance, -amount); // [!code ++] 
        }
    }
    ```
- `Mutex` to handle synchronization for threads and processes
