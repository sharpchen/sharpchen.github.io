namespace CSharpDesignPatternsDemo.Creational.Singleton;

using Xunit;

class ThreadSingleton
{
    private static readonly ThreadLocal<ThreadSingleton> _instance = new(() => new());
    private int _threadAccessedCount;
    public static ThreadSingleton Instance => _instance.Value!;
    public int ThreadAccessedCount => ++_threadAccessedCount;
    private ThreadSingleton() { }

    // ...elided
}

public class ThreadSingletonTest
{
    [Fact]
    public async Task Test()
    {
        var func = () =>
        {
            var managedThreadId = Environment.CurrentManagedThreadId;
            var singletonId = ThreadSingleton.Instance.ThreadAccessedCount;
            Console.WriteLine($"Message from thread{managedThreadId} where singleton id is {singletonId}");
            return (managedThreadId, singletonId);
        };
        var t1 = Task.Run(func);
        var t2 = Task.Run(func);
        var a = await Task.WhenAll(t1, t2);
        Assert.True(a[0].managedThreadId != a[1].managedThreadId && a[0].singletonId == a[1].singletonId);
    }
}