using Xunit;
using CSharpDesignPatternsDemo.Structural;
using CSharpDesignPatternsDemo.Creational;
using System.Numerics;

var p1 = 20 + 30.Percentage();
var p2 = 2 - 50f.Percentage();
var p3 = 4 * 25d.Percentage();
var p4 = 1 / 66m.Percentage();
var p11 = 30.Percentage() + 20;
var p12 = 2f.Percentage() - 50;
var p13 = 4d.Percentage() * 25;
var p14 = 1m.Percentage() / 66;
Print(p1, p2, p3, p4, p11, p12, p13, p14);

static void Print(params object[] objects)
{
    objects.ToList().ForEach(Console.WriteLine);
}

Span<int> span = Enumerable.Range(1, 100).ToArray().AsSpan();
Random.Shared.Shuffle(span);
var condition = span is [var first, _, .. var _]; // always true
condition.Out();
static class OutExtension
{
    public static void Out(this object o) => Console.WriteLine(o);
}