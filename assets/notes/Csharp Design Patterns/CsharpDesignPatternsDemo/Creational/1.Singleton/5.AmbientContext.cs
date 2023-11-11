using Xunit;
namespace CsharpDesignPatternsDemo.Creational.Singleton;

class AmbientContext : IDisposable
{
    private static int _currentState;
    public static int CurrentState { get => _currentState; private set => _currentState = value; }

    private static readonly ThreadLocal<AmbientContext> _context = new(() => new());
    public static AmbientContext CurrentContext { get => _context.Value!; set => _context.Value = value; }
    public AmbientContext(int state = 250) => _currentState = state;
    public void Dispose() => _currentState = 250;

    //...elided
}


public class AmbientContextTest
{
    [Fact]
    public void Test()
    {
        AmbientContext.CurrentContext = new AmbientContext();
        DoSomethingUsingAmbientContext();
        using (var context = new AmbientContext(500))
        {
            Assert.Equal(500, AmbientContext.CurrentState);
        }
        Assert.Equal(250, AmbientContext.CurrentState);

        static void DoSomethingUsingAmbientContext() =>
            Console.WriteLine($"state is {AmbientContext.CurrentState}");
    }
}