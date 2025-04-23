using Xunit;
using System.Collections.ObjectModel;

namespace CSharpDesignPatternsDemo.Structural;

record class Point(int X, int Y) : IGeometry
{
    public void Draw() => Console.WriteLine($"...Drawing point({X}, {Y})");
    // record class auto overrides GetHashCode()
    // but to be explicit
    // I don't want to elide it here
    public override int GetHashCode() => HashCode.Combine(X, Y);
}
record class Line(Point Start, Point End) : IGeometry
{
    public void Draw()
    {
        Start.Draw();
        End.Draw();
    }
    public override int GetHashCode() => HashCode.Combine(Start, End);
}

internal class VectorObjectAdapter : Collection<Point>, IGeometry
{
    private static Dictionary<int, VectorObjectAdapter> _cache = new();
    public VectorObjectAdapter(VectorObject obj)
    {
        obj.ToList().ForEach(x =>
        {
            if (!_cache.ContainsKey(x.GetHashCode()))
            {
                this.Add(x.Start);
                this.Add(x.End);
            }
        });
    }
    public override int GetHashCode()
    {
        var hash = new HashCode();
        this.ToList().ForEach(hash.Add);
        return hash.ToHashCode();
    }
    private static bool HasDrew(VectorObjectAdapter obj) => _cache.ContainsKey(obj.GetHashCode());
    public void Draw()
    {
        if (!HasDrew(this))
        {
            this.ToList().ForEach(x => x.Draw());
            _cache.Add(this.GetHashCode(), this);
        }
    }
}

// Adaptee
internal class VectorObject : Collection<Line>
{
    public VectorObject(params Line[] lines) => lines.ToList().ForEach(this.Add);
}

internal static class Geometry
{
    public static void Draw(IGeometry geometry) => geometry.Draw();
}

internal interface IGeometry
{
    void Draw();
}

public class AdapterCachingTest
{
    [Fact]
    public void Test()
    {
        VectorObject vec = new(
            new Line(new(1, 1), new(2, 2)),
            new Line(new(1, 2), new(3, 4))
        );
        VectorObjectAdapter vecAdapter = new(vec);
        Geometry.Draw(vecAdapter);
    }
}
