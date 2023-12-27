using System.Drawing;
using Xunit;
namespace CSharpDesignPatternsDemo.Structural.Composite;

class Graphic
{
    public Color Color { get; set; }
    public string Name => nameof(Graphic);
    protected readonly Lazy<List<Graphic>> children = new();
    public void AddChildren(params Graphic[] child) => child.ToList().ForEach(children.Value.Add);
    public void Display()
    {
        Console.WriteLine($"Displaying {Name} object with color {Color.Name.ToLower()}");
        children.Value.ForEach(x => x?.Display());
    }
}
class Rectangle : Graphic { }
class Circle : Graphic { }
public class GroupingTest
{
    [Fact]
    public void Test()
    {
        Rectangle rectangle = new() { Color = Color.Aqua };
        Circle circle = new() { Color = Color.Orange };
        Graphic graphic = new() { Color = Color.White };
        Graphic graphicAnother = new() { Color = Color.Black };
        graphicAnother.AddChildren(circle, rectangle);
        graphic.AddChildren(rectangle, circle, graphicAnother);
        graphic.Display();
    }
}