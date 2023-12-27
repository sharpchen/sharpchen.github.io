using System.Numerics;
using Xunit;

namespace CSharpDesignPatternsDemo.Structural;

readonly struct Price<T>(T value) where T : INumber<T>
{
    private readonly T _value = value;

    public static implicit operator Price<T>(T value) => new(value);
    public static implicit operator T(Price<T> price) => price._value;
}

readonly struct Percentage<T> where T : struct, INumber<T>
{
    private readonly T _value;
    internal Percentage(T value) => _value = value;
    public static T operator +(T left, Percentage<T> right) => left + right._value;
    public static T operator -(T left, Percentage<T> right) => left - right._value;
    public static T operator *(T left, Percentage<T> right) => left * right._value;
    public static T operator /(T left, Percentage<T> right) => left / right._value;
    public static Percentage<T> operator +(Percentage<T> left, T right) => new(left._value + right);
    public static Percentage<T> operator -(Percentage<T> left, T right) => new(left._value - right);
    public static Percentage<T> operator *(Percentage<T> left, T right) => new(left._value * right);
    public static Percentage<T> operator /(Percentage<T> left, T right) => new(left._value / right);
    public static Percentage<T> operator +(Percentage<T> left, Percentage<T> right) => new(left._value + right._value);
    public static Percentage<T> operator -(Percentage<T> left, Percentage<T> right) => new(left._value - right._value);
    public static Percentage<T> operator *(Percentage<T> left, Percentage<T> right) => new(left._value * right._value);
    public static Percentage<T> operator /(Percentage<T> left, Percentage<T> right) => new(left._value / right._value);
    public override string ToString()
    {
        return _value switch
        {
            int v => $"{v * 100}%",
            float f => $"{f * 100}%",
            double d => $"{d * 100}%",
            decimal m => $"{m * 100}%",
            _ => base.ToString() ?? nameof(Percentage<T>)
        };
    }
}
static class PercentageExtension
{
    public static Percentage<decimal> Percentage(this int number) => new(number / 100m);
    public static Percentage<T> Percentage<T>(this T number)
        where T : struct, INumber<T>
    {
        return number switch
        {
            float f => new(T.CreateChecked(f / 100)),
            double d => new(T.CreateChecked(d / 100)),
            decimal m => new(T.CreateChecked(m / 100)),
            _ => throw new NotImplementedException($"Solution for type: {{{typeof(T).Name}}} is not implemented.")
        };
    }
}
public class ValueProxyTest
{
    [Fact]
    public void TestName()
    {
        var p1 = 20 + 30.Percentage();
        var p2 = 2 - 50f.Percentage();
        var p3 = 4 * 25d.Percentage();
        var p4 = 1 / 66m.Percentage();
        var p11 = 30.Percentage() + 20;
        var p12 = 2f.Percentage() - 50;
        var p13 = 4d.Percentage() * 25;
        var p14 = 1m.Percentage() / 66;
    }
}