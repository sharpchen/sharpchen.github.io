using Xunit;
using Xunit.Abstractions;

namespace CsharpDesignPatternsDemo.Structural.Adapter;

internal interface IAdapteeCannotImpl
{
    string DoWork();
}

internal sealed class Adaptee
{
    public string DoSpecialWork() =>
        $"{this.GetType().Name} can do something but you cannot simply invoke using existing implementation.";
}

internal class Adapter : IAdapteeCannotImpl
{
    private readonly Adaptee _adaptee = new();

    public string DoWork() => _adaptee.DoSpecialWork();
}

internal static class ExistingImpl
{
    public static string DoWorkWith(IAdapteeCannotImpl obj) => obj?.DoWork()!;
}

public class AdapterTest
{
    private readonly ITestOutputHelper? _helper;

    public AdapterTest(ITestOutputHelper testOutputHelper) => _helper = testOutputHelper;

    [Fact]
    public void Test()
    {
        Adapter adapter = new();
        _helper!.WriteLine(ExistingImpl.DoWorkWith(adapter));
    }
}