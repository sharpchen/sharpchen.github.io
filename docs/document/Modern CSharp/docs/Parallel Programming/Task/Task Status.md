# Task Status

## Created

Status `Created` is assigned when on task creation but usually seen on tasks created from constructors since other creation methods always start implicitly

```cs
Task task = new Task(() => { });
Console.WriteLine(task.Status); // Created
```

## WaitingForRun

A task has been scheduled by scheduler but has not yet behun execution

## RunToCompletion

Implying a task has completed successfully.
A task ran to end or terminated by returing a value has status `RunToCompletion`

## Canceled

A successful cancellation happens **when all of the following were satisfied**
- `OperationCanceledException`(or its derived exception type) is thrown
- `token.IsCancellationRequested` is true
- `token` in closure passed to `OperationCanceledException` equals `token` as parameter

```cs
var task = Task.Run(() =>
{
    throw new OperationCanceledException(); // [!code highlight] 
});

try
{
    task.Wait();
}
catch (AggregateException)
{
    Console.WriteLine(task.Status); // Cancelled // [!code highlight] 
}
```

## Faulted

Faulted happens on:

- Any exception besides `OperationCanceledException` was thrown.
- `OperationCanceledException` is thrown && (`token.IsCancellationRequested` is false || `token` in closure passed to `OperationCanceledException` != `token` as parameter)

```cs
var task = Task.Run(() =>
{
    throw new Exception(); // not an OperationCanceledException // [!code highlight] 
});

try
{
    task.Wait();
}
catch (AggregateException)
{
    Console.WriteLine(task.Status); // Faulted // [!code highlight] 
}
```
