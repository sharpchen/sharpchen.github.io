using Xunit;
using System.Drawing;
using System.Text;

namespace CsharpDesignPatternsDemo.Structural.Decorator.DynamicDecorator;

interface IShape
{
    string AsString();
}
class Shape(double size) : IShape
{
    protected internal readonly double size = size;
    public string AsString() => $"Shape with size {size}";
}
abstract class DecoratorCyclePolicy
{
    protected internal abstract bool ShouldAddType(Type type, IList<Type> types);
    protected internal abstract bool InvokingAllowed(Type type, IList<Type> types);
}
class ThrowOnConstructionPolicy : DecoratorCyclePolicy
{
    private static bool Handle(Type type, IList<Type> types)
    {
        if (types.Contains(type)) throw new Exception($"type {type.Name} is already in the cycle.");
        return true;
    }
    protected internal override bool ShouldAddType(Type type, IList<Type> types) => Handle(type, types);

    protected internal override bool InvokingAllowed(Type type, IList<Type> types) => Handle(type, types);
}
class AllowCyclePolicy : DecoratorCyclePolicy
{
    protected internal override bool InvokingAllowed(Type type, IList<Type> types) => true;

    protected internal override bool ShouldAddType(Type type, IList<Type> types) => true;
}
abstract class DecoratorForShape : Shape
{
    protected readonly Shape shape;
    protected readonly List<Type> types = new();
    protected DecoratorForShape(Shape shape) : base(shape.size)
    {
        this.shape = shape;
        if (shape is DecoratorForShape decorator)
        {
            types.AddRange(decorator.types);
        }
    }
}
abstract class DecoratorForShape<TSelf, TPolicy> : DecoratorForShape
    where TPolicy : DecoratorCyclePolicy, new()
{
    protected readonly TPolicy policy = new();
    protected DecoratorForShape(Shape shape) : base(shape)
    {
        if (policy.ShouldAddType(typeof(TSelf), types))
            types.Add(typeof(TSelf));
    }
}
class DecoratorForShapeWithPolicy<TPolicy> : DecoratorForShape<DecoratorForShapeWithPolicy<TPolicy>, TPolicy>
    where TPolicy : DecoratorCyclePolicy, new()
{
    public DecoratorForShapeWithPolicy(Shape shape) : base(shape) { }
}
class ShapeWithColor : DecoratorForShapeWithPolicy<ThrowOnConstructionPolicy>
{
    protected readonly Color color;
    public ShapeWithColor(Shape shape, Color color) : base(shape)
        => this.color = color;

    public new string AsString()
    {
        StringBuilder sb = new($"{shape.AsString()}");
        if (policy.InvokingAllowed(types.First(), types.Skip(1).ToList()))
            sb.Append($" with color {color.Name}");

        return sb.ToString();
    }
}

class ShapeWithTransparency : DecoratorForShapeWithPolicy<ThrowOnConstructionPolicy>
{
    protected double transparency;
    public ShapeWithTransparency(Shape shape, double transparency) : base(shape)
        => this.transparency = transparency;
    public new string AsString()
    {
        StringBuilder sb = new($"{shape.AsString()}");
        if (policy.InvokingAllowed(types.First(), types.Skip(1).ToList()))
            sb.Append($" with size {size}");
        return sb.ToString();
    }
}

public class Test
{
    [Fact]
    public void TestName()
    {
        Shape shape = new(1.2);
        ShapeWithColor withColor = new(shape, Color.Aqua);
        ShapeWithTransparency withTransparency = new(withColor, 0.5);
        // ShapeWithColor shapeWithColor = new(withColor, Color.Red);
    }
}