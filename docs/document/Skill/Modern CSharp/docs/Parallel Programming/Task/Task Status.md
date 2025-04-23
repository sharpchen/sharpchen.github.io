# Task Status

**One should always access tasks status in either `try..catch` statement or continued tasks**

## Created

Status `Created` is assigned when on task creation but usually seen on tasks created from constructors since other creation methods always start implicitly

```cs
Task task = new Task(() => { });
Console.WriteLine(task.Status); // Created
```

## WaitingForActivation

## WaitingForRun

A task has been scheduled by scheduler but has not yet begun execution

## RanToCompletion

A task ran to end or terminated by `return` or ran to end has status `RanToCompletion`

## Canceled

A successful cancellation happens **when all of the three conditions were satisfied**
- `OperationCanceledException`(or its derived exception type such as `TaskCanceledException`) is thrown
- `token.IsCancellationRequested` is true
- `token` in closure passed to `OperationCanceledException` equals `token` as parameter on task creation

There's a special case that can result in Canceled status when a task requires unwrap.
If the inner task creation was Faulted because of a thrown of `OperationCanceledException`, the unwrap process would set the status of outer task to Canceled.
Otherwise it would just remain Faulted.

```cs
// compiler would choose a Task.Run(Func<Task> function) here
var task = Task.Run(() => {
    throw new OperationCanceledException(); // [!code highlight] 
});

try {
    task.Wait();
} catch (AggregateException) {
    Console.WriteLine(task.Status); // Cancelled // [!code highlight] 
}
// Explicit unwrap have the same behavior
// async was marked here because TaskFactory.StartNew does not have such overload resolution like Task.Run
Task task2 = Task.Factory.StartNew(async () => {
    await Task.Delay(100);
    throw new Exception(); // it's another type of Exception this time // [!code highlight] 
}).Unwrap();

try {
    task2.Wait();
} catch (AggregateException) {
    Console.WriteLine(task2.Status); // Faulted // [!code highlight] 
}
```

## Faulted

Faulted happens on one of the scenarios:

- Any exception besides `OperationCanceledException` was thrown.
- `OperationCanceledException` is thrown but cancellation failed.
- Any exception is not `OperationCanceledException` was thrown on task creation. A wait on the task created anyway results Faulted.


```cs
Task task = Task.Factory.StartNew(() => {
    throw new Exception(); // not an OperationCanceledException // [!code highlight] 
});

try {
    task.Wait();
} catch (AggregateException) {
    Console.WriteLine(task.Status); // Faulted // [!code highlight] 
}
```
