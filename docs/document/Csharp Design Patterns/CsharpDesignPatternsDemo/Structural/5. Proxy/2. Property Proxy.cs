using System.Numerics;
using Xunit;

namespace CSharpDesignPatternsDemo.Structural;

class Property<T>(T value) : IEquatable<Property<T>>, IEqualityOperators<Property<T>, Property<T>, bool>
    where T : new()
{
    private T _value = value;
    public T Value
    {
        get => _value;
        set
        {
            if (Equals(_value, value)) return;
            Console.WriteLine($"Assigning value as {value}");
            _value = value;
        }
    }
    public Property() : this(new T()) { }

    public bool Equals(Property<T>? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return EqualityComparer<T>.Default.Equals(_value, other.Value);
    }

    public static bool operator ==(Property<T>? left, Property<T>? right)
    {
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Property<T>? left, Property<T>? right) => !(left == right);

    public override int GetHashCode() => HashCode.Combine(_value);

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (obj is not Property<T>) return false;
        return Equals(obj as Property<T>);
    }

    public static implicit operator Property<T>(T value) => new(value);
    public static implicit operator T(Property<T> property) => property.Value;
}

class Control { }
class Grid : Control
{
    private Property<int> _rowCount = new();
    public int RowCount
    {
        get => _rowCount.Value;
        set => _rowCount.Value = value;
    }
}

public class PropertyProxyTest
{
    [Fact]
    public void TestName()
    {
        Grid g = new() { RowCount = 1 };
        g.RowCount = 2; // output: Assigning value as 2
        g.RowCount = 2; // no output
    }
}