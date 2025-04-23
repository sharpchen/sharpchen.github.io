using Autofac;
using Xunit;
namespace CSharpDesignPatternsDemo.Structural.Bridge;

interface IRenderer
{
    void Render(double area);
}

class VectorRenderer : IRenderer
{
    public void Render(double area) => Console.WriteLine($"Rendering using {nameof(VectorRenderer)} with area:{area}");
}

class RasterRenderer : IRenderer
{
    public void Render(double area) => Console.WriteLine($"Rendering using {nameof(RasterRenderer)} with area:{area}");
}



abstract class Shape
{
    protected IRenderer renderer;
    protected Shape(IRenderer renderer) => this.renderer = renderer;
    public abstract void Draw();
}

class Rectangle(double width, double height, IRenderer renderer) : Shape(renderer)
{
    protected double width = width;
    protected double height = height;

    public override void Draw() => renderer.Render(width * height);
}

class Circle(double radius, IRenderer renderer) : Shape(renderer)
{
    protected double radius = radius;

    public override void Draw() => renderer.Render(radius * radius * Math.PI);
}

public class Test
{
    [Fact]
    public void TestName()
    {
        var builder = new ContainerBuilder();
        builder.RegisterType<VectorRenderer>().As<IRenderer>().SingleInstance();
        using var container = builder.Build();
        var vectorRenderer = container.Resolve<IRenderer>();
        Rectangle rectangle = new(1d, 2d, vectorRenderer);
        rectangle.Draw();
        Circle circle = new(1d, vectorRenderer);
        circle.Draw();
    }
}