using System.Drawing;
using Xunit;

namespace CsharpDesignPatternsDemo.Structural.Decorator.StaticDecorator;

abstract class Shape
{
    protected internal double size;
    protected Shape(double size) => this.size = size;
    public Shape() { }
    public virtual string AsString() => $"{this.GetType().Name} has size {size}";
}
class Rectangle(double size) : Shape(size)
{
    public Rectangle() : this(default) { }
}
class ShapeWithColor<T> : Shape where T : Shape, new()
{
    protected internal T Shape { get; init; } = new();
    protected internal Color color;
    public ShapeWithColor(Color color) : base(default) => this.color = color;
    public ShapeWithColor() : base(default) { }
    public override string AsString() => $"{Shape.AsString()} with color {color.Name}";
}
class ShapeWithTransparency<T> : Shape where T : Shape, new()
{
    protected internal T Shape { get; init; } = new();
    protected internal double transparency;
    public ShapeWithTransparency(double transparency) : base(default) => this.transparency = transparency;
    public ShapeWithTransparency() : base(default) { }
    public override string AsString() => $"{Shape.AsString()} with transparency {transparency}";
}
public class Test
{
    [Fact]
    public void TestName()
    {
        ShapeWithColor<Rectangle> shapeWithColor = new(color: Color.White) { Shape = new(size: 1) };
        ShapeWithTransparency<ShapeWithColor<Rectangle>> shapeWithTransparency = new(transparency: 0.5)
        {
            Shape = new(Color.AliceBlue)
            {
                Shape = new(1.2)
            }
        };
    }
}