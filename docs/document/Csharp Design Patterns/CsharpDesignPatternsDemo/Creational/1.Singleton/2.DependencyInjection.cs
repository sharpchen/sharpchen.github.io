using Xunit;
using Autofac;

namespace CsharpDesignPatternsDemo.Creational.Singleton;
class OrdinaryClass
{
    public OrdinaryClass() { }
    // ...elided
}
public class DependencyInjectionTest
{
    [Fact]
    public void DependencyInjection()
    {
        ContainerBuilder builder = new();
        builder.RegisterType<OrdinaryClass>().SingleInstance();
        using var container = builder.Build();
        Assert.True(container.Resolve<OrdinaryClass>() is not null);
    }
}