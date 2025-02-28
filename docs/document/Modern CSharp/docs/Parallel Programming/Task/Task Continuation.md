# Task Continuation

## Continue When

```cs
var task1 = Task.Run(() => {
    Thread.Sleep(1000);
});

var task2 = Task.Run(() => {
    Thread.Sleep(1000);
});

await Task.Factory.ContinueWhenAny([task1, task2], prev => {
    Console.WriteLine($"Tasks {prev.Id} completed.");
});

await Task.Factory.ContinueWhenAll([task1, task2], prev => {
    Console.WriteLine($"Tasks {string.Join(", ", prev.Select(x => x.Id))} completed.");
});
```

### Continue When Results

```cs
var task1 = Task.Run(() =>
{
    return 123;
});

var task2 = Task.FromResult(456);

await Task.Factory.ContinueWhenAny([task1, task2], prev =>
{
    Console.WriteLine($"Tasks {prev.Id} completed.");
    Console.WriteLine($"Result: {prev.Result}");
});

await Task.Factory.ContinueWhenAll([task1, task2], prev =>
{
    Console.WriteLine($"Tasks {string.Join(", ", prev.Select(x => x.Id))} completed.");
    Console.WriteLine($"Result: {string.Join(", ", prev.Select(x => x.Result))}");
});
```
