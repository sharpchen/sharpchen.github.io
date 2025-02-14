# Start & Cancel

## Create & Start

Task can be created from the following sources:

- constructors of `Task` and `Task<T>`
- Task creation methods like `Task.Run` and `TaskFactory.StartNew`
- `async` delegates

```cs
var task = new Task(() => Console.WriteLine("hello"));
task.Start(); // runs on another thread asynchronously
```

> [!NOTE]
> Other utils like `Task.Delay` does create task but more specific so they're not been discussed here.

To start a job there's multiple approaches to do the same:

- `task.Start`: a instance method to start the task
- `Task.Factory.StartNew`: create and start at one go
- `Task.Run`: create and start at one go but does not support any argument
- Start from any `async` method: automatically started on invocation.

```cs
_ = Task.Factory.StartNew(() => Console.WriteLine("hello"));
_ = Task.Run(() => Console.WriteLine("hello"));


fooAsync(); // started automatically

 var fooAsync = async () =>
{
    await Task.Run(() => Console.WriteLine("foo"));
}
```

> [!NOTE]
> Continued tasks created by `ContinueWith` cannot `Start()`

### Create Task with Return

Generic tasks come into play when provided delegate would return a result.
The type parameter is exactly the type of return.

```cs
Task<int> task = new Task<int>(() => 123);
task.Start();
```

### Create with Argument

Both `TaskFactory` and `Task` supports an overload to accept **single argument** when the signature contains a parameter
Since only single value is supported, you may need an abstraction when to pass multiple values

```cs
_ = Task.Factory.StartNew((object foo) => // [!code highlight] 
{
    Console.WriteLine(foo.GetType());
}, 123);

var task = new Task((object foo) => Console.WriteLine(foo.GetType()), 123); // [!code highlight] 
task.Start();
```

> [!NOTE]
> `Task.Run` does not support overloads accept an argument

### Create from Async Delegate

`async` is a syntax sugar for creating task from a lambda or `async` method.
Each `async` delegate is like a factory for it's dedicated action only.

```cs
Func<Task> foo = async () =>
{
    await Task.Delay(100);
};

await foo();

Func<int, Task<int>> bar = async (int number) =>
{
    await Task.Delay(1000);
    return number;
};

bar(123).Wait();
```

And it can be super useful when creating a batch of tasks using LINQ:

```cs
_ = await Task.WhenAll(Enumerable.Range(1, 10).Select(async x =>
{
    await Task.Delay(100);
    return x;
}));
```

#### Unwrap

If one need to start a `async` delegate directly using `TaskFactory.StartNew`, `TaskExtension.Unwrap()` is required to get it work as expected.

That is because, `async` delegate is a factory for dedicated task, so the result for starting the delegate directly would be a task created from the delegate instead of the expected result.

```cs
Task<Task<int>> t = Task.Factory.StartNew(async () =>
{
    await Task.Delay(1000);
    return 42;
});

// use this instead!!
Task<int> t2 = Task.Factory.StartNew(async () =>
{
    await Task.Delay(1000);
    return 42;
}).Unwrap();

// functionally you can use await to unwrap but it's definitely not recommended
Task<int> t2 = await Task.Factory.StartNew(async () =>
{
    await Task.Delay(1000);
    return 42;
});

```

> [!TIP]
> `Task.Run` has a implicit auto-unwrap for some of its overloads
>```cs
>Task<int> t = Task.Run(async () =>
>{
>    await Task.Delay(1000);
>    return 42;
>});
>```

### Create from Value

Sometimes you may want to wrap a already available value within a task just to satisfy the type checking.
This is called pre-completed task, can be done by `Task.FromResult`
Such task does not start a new thread and never needed to be awaited.

```cs
Task<int> task = Task.FromResult(42);
Console.WriteLine(task.Result); // Outputs: 42
```

### Create as Continued Task

`Task.ContinueWith` creates a task after the previous task has terminated with certain condition, and it starts simultaneously.
Such condition can be specified by `TaskContinuationOptions` in its overloads.

```cs
Task.Run(async () =>
{
    await Task.Delay(100);
}).ContinueWith(prev =>
{
    Console.WriteLine("Continued task started automatically!");
}).Wait();
```

### `Task.Run` vs `TaskFactory.StartNew`

- `Task.Run`
    - starts with default `TaskCreationOptions.DenyChildAttach` which prevents child tasks, and there's no way to use other option.
    - recommended for Compute-Bound task
    - no overload for passing argument to task
    - uses default scheduler and can not be changed
    - does not require unwrap to run a `async` delegate

- `TaskFactory.StartNew`
    - can do everything `Task.Run` can do(allow child tasks)
    - can have more control on `TaskCreationOptions` and scheduler
    - require unwrap for `async` delegate

> [!NOTE]
> A compute-bound task is a task that primarily uses the CPU for calculations rather than waiting on external resources like disk I/O, network requests, or database queries. 
> These tasks typically involve intensive computations and benefit from parallelism using multiple CPU cores.

```cs
_ = Task.Run(() => { });

// equivalent to

_ = Task.Factory.StartNew(
    () => { },
    CancellationToken.None,
    TaskCreationOptions.DenyChildAttach,
    TaskScheduler.Default
);
```

## Creation Options

<!--TODO: creation options-->

## Task Cancellation

### What Manage it & What Represents it

Two essential types for cancellation are

- `CancellationToken`: a **readonly struct** represents a state of cancellation of a task, it's the only property of its containing class.
    - `CancellationToken.IsCancellationRequested`: represents the whether cancellation is decided from the source.
    - a token cannot be reused after cancellation
    - all tokens from a same source are identical
        ```cs
        // checks backing source only
        public bool Equals(CancellationToken other) => _source == other._source;
        ```
- `CancellationTokenSource` itself is responsible for triggering the cancellation, serve as a control center for all tokens generated from it.
    - `CancellationTokenSource.Token` is a property of type `CancellationToken`, such design allows controlling multiple tokens by single source since token is a readonly struct
    - inform all containing task of any token generated from source to cancel on `Cancel` or `CancelAfter` or `CancelAsync`
    - `IDisposable` as well would be disposed after cancellation
- `OperationCanceledException`: to terminate a task from inside with a Cancelled status.
    - such exception can be catched on wait to handle after cancellation

`OperationCanceledException` is a special exception type dedicated for terminating task.
Compiler recognizes it as special case so it doesn't break the whole program but only terminate the task.

```cs
var cts = new CancellationTokenSource();
var token = cts.Token;
Task task = new(() =>
{
    while (true)
    {
        if (token.IsCancellationRequested)
        {
            throw new OperationCanceledException(token); // does not terminate the whole program // [!code highlight] 
        }
        Console.WriteLine("working with task");
    }
});

task.Start();

cts.Cancel(); // token.IsCancellationRequested changed // [!code highlight] 
```

A better practice is using `token.ThrowIfCancellationRequested()` as a shorthand.

```cs
token.ThrowIfCancellationRequested(); // no if statement needed here // [!code highlight] 
Console.WriteLine("working with task");
```

### CancellationToken as Parameter

Aforementioned examples capture `token` by closure so you can access it inside the task.

What you would find confusing is, task creation methods like `new Task`, `Task.Run`, `Task.Factory.StartNew` all supports a parameter of type `CancellationToken`.(you may set it as parameter in a async method as well)

What is the purpose for passing (a copy of) the token manually even when we still need to cpature it by closure?

Status of a task is partly dependent on the token passed as parameter, a task can only be in a Canceled status **when all of the following were satisfied**
- `OperationCanceledException`(or its derived exception type) is thrown
- `token.IsCancellationRequested` is true
- `token` in closure passed to `OperationCanceledException` equals `token` as parameter

So this checking on whether cancellation suceeded requires a validation on the token which must be passed as parameter, so that the hidden mechanism inside task can examine.

<!--TODO: add example-->

```cs
using CancellationTokenSource cts = new(5000);
CancellationToken token = cts.Token;

Task task = Task.Factory.StartNew(() =>
{
    while (true)
    {
        Console.WriteLine("operation...");
        token.ThrowIfCancellationRequested();
        Thread.Sleep(1000);
    }
}, cts.Token); // it's oke, all tokens from same source are identical

try
{
    task.Wait();
}
catch (AggregateException)
{
    Console.WriteLine(task.Status); // Canceled
}
```

> [!NOTE]
> Pass `CancellationToken.None` to represent task is not cancelable.

### On Cancellation

You can register callbacks to be triggered when a token is requested to cancel.
Callbacks would be triggered before the task is truly terminated.

> [!IMPORTANT]
> The callbacks registered runs synchronously, `CancellationTokenSource.Cancel` does not finish until all callbacks are finished.

```cs
token.Register(() => // [!code highlight] 
{ // [!code highlight] 
    Console.WriteLine("callback triggered"); // [!code highlight] 
}); // [!code highlight] 

Task<int> task = new(() =>
{
    while (true)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine("continuing the task");
    }
});

task.Start();
cts.Cancel();
Console.WriteLine("task finished");
// callback triggered // [!code highlight] 
// task finished
```

Besides `token.Register`, token itself can wait by blocking another thread created by a new task to achieve the same.

```cs
Task<int> task = new(() =>
{
    while (true)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine("continuing the task");
    }
});

Task.Run(() =>
{
    token.WaitHandle.WaitOne(); // wait until the token received any signal // [!code highlight] 
    Console.WriteLine("callback triggerd from another task");
});

task.Start();
cts.Cancel();
Console.WriteLine("task finished");
```

#### After Cancellation

After cancellation simply means chaining a event after previous task, and allowing access to previous task in the callback so you can do things conditionally.

<!--TODO: faulted example is not right, the task is not canceled correctly-->

```cs
var cts = new CancellationTokenSource();
var token = cts.Token;
Task<int> task = new(() =>
{
    while (true)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine("continuing the task");
    }
});

task.ContinueWith(prev => // [!code highlight] 
{ // [!code highlight] 
    if (prev.Status is TaskStatus.Faulted) // [!code highlight] 
    { // [!code highlight] 
        Console.WriteLine("cancelled"); // [!code highlight] 
    } // [!code highlight] 
}); // [!code highlight] 

task.Start();
cts.Cancel();
Console.WriteLine("task finished");
```

### Combined Tokens

<!--TODO: finish this part -->

You may wanted to combine tokens from different sources to perform a simultaneous cancellation even they're from different sources.

### Common Practice

```cs
using (CancellationTokenSource cts = new(timeout))
{
    try
    {
        await task(foo, cts.Token);
    }
    catch (OperationCanceledException)
    {
        Console.WriteLine("canceled");
    }
}
```

## Sleeping on Thread

- `Thread.Sleep`: pauses the thread and allows the scheduler to run another thread while sleeping, for the efficiency.
- `SpinWait.SpinUntil`: pauses the thread until a condition fits. The scheduler are not allowed to run another thread using current resource of this thread.
    ```cs
    Task task = new(() =>
    {
        SpinWait.SpinUntil(() =>
        {
            return true;
        }, 1000);
    });
    ```

- Aforementioned `token.WaitHandle.WaitOne` to work together with a cancellation token.

