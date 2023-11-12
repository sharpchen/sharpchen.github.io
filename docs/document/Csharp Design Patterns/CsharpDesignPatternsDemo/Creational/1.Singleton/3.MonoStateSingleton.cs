using Xunit;

namespace CsharpDesignPatternsDemo.Creational.Singleton;

class MonoStateSingleton
{
    private static int _state01 = 0x0;
    private static int _state02 = 0x64;

    public int State01 { get => _state01; set => _state01 = value; }
    public int State02 { get => _state02; set => _state02 = value; }

    // ...elided
}

public class MonoStateSingletonTest
{
    [Fact]
    public void Test()
    {
        var a = new MonoStateSingleton();
        var b = new MonoStateSingleton();
        Assert.True(a.State01 == b.State01 && a.State02 == b.State02);
        a.State01 = 0xFA;
        a.State02 = 0b1_1111_0100;
        Assert.True(a.State01 == b.State01 && a.State02 == b.State02);
    }
}