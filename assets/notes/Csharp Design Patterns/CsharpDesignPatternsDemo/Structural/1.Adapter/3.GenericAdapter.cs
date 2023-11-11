using System.Numerics;
using System.Reflection;
using System.Text;
using Xunit;
namespace CsharpDesignPatternsDemo.Structural.Adapter;

#region Implementation for Numerics Only
// class Vector<TData, TDim> :
//     IMultiplyOperators<Vector<TData, TDim>, Vector<TData, TDim>, Vector<TData, TDim>>,
//     IAdditionOperators<Vector<TData, TDim>, Vector<TData, TDim>, Vector<TData, TDim>>
//     where TData : IMultiplyOperators<TData, TData, TData>, IAdditionOperators<TData, TData, TData>
//     where TDim : IDimension, new()
// {
//     public static int Dimension => dim.Dimension;
//     protected static readonly TDim dim = new();
//     protected TData[] data;
//     public Vector() => data = new TData[dim.Dimension];

//     public Vector(params TData[] data)
//     {
//         if (data.Length != Dimension) throw new InvalidDataException($"Dimension of {nameof(data)} doesn't match.");
//         this.data = data;
//     }
//     public static Vector<TData, TDim> operator *(Vector<TData, TDim> left, Vector<TData, TDim> right) =>
//         new(left.data.Zip(right.data, (x, y) => (x, y)).Select(x => x.x * x.y).ToArray());

//     public static Vector<TData, TDim> operator +(Vector<TData, TDim> left, Vector<TData, TDim> right) =>
//         new(left.data.Zip(right.data, (x, y) => (x, y)).Select(x => x.x + x.y).ToArray());
//     public TData this[int index]
//     {
//         get => data[index];
//         set => data[index] = value;
//     }
// }
#endregion





class Vector<TSelf, TData, TDim>
    where TSelf : Vector<TSelf, TData, TDim>, new()
    where TDim : IDimension, new()
{
    public static ushort Dimension => dim.Dimension;
    protected static readonly TDim dim = new();
    protected TData[] data;
    public Vector() => data = new TData[dim.Dimension];
    public Vector(params TData[] data)
    {
        CheckDimension(data);
        this.data = data;
    }

    private static void CheckDimension(TData[] data)
    {
        if (data.GetLength(0) != Dimension) throw new Exception($"Dimension of {nameof(data)} doesn't match.");
        if (data[0] is Array f)
        {
            int dim = f.Length;
            foreach (var array in data)
            {
                if (array is Array a && a.Length != dim)
                {
                    throw new Exception($"Length of array in dim{Array.IndexOf(data, a) + 1} of {nameof(data)} doesn't match.");
                }
            }
        }
    }

    public TData this[ushort i]
    {
        get => data[i];
        set => data[i] = value;
    }

    public static TSelf operator *(TSelf left, Vector<TSelf, TData, TDim> right)
    {
        if (right is not TSelf)
            throw new InvalidCastException($"Cannot cast {nameof(right)} to {typeof(TSelf).Name}");
        if (default(TData) is ValueType)
        {
            var opMultiInterface = typeof(IMultiplyOperators<,,>).MakeGenericType(typeof(TData), typeof(TData), typeof(TData));
            var interfaceMethod = typeof(TData).GetMethod(
                $"{opMultiInterface.Namespace}.{opMultiInterface.Name[..^2]}<{typeof(TData).FullName},{typeof(TData).FullName},{typeof(TData).FullName}>.op_Multiply",
                (BindingFlags)(-1)
            );
            var ordinaryMethod = typeof(TData).GetMethod("op_Multiply", (BindingFlags)(-1));
            var twoPossibleOperators = new[] { interfaceMethod, ordinaryMethod };
            var value = left.data.Zip(right.data, (x, y) => (x, y)).Select(x =>
            {
                return (TData)twoPossibleOperators.Where(x => x is not null).First()!.Invoke(null, new object[] { x.x!, x.y! })!;
            }).ToArray();
            return Vector<TSelf, TData, TDim>.Create(value);
        }
        else
        {
            // elide details
            return new TSelf();
        }
    }

    public static TSelf Create(params TData[] values)
    {
        CheckDimension(values);
        return new TSelf { data = values };
    }

    public override string ToString()
    {
        if (default(TData) is ValueType)
            return string.Join(',', data);
        else
        {
            StringBuilder sb = new();
            data.ToList().ForEach(x =>
            {
                sb.AppendLine(string.Join(',', x));
            });
            return sb.ToString();
        }
    }

}


// class VectorOfIntArray<TDim> :
//     Vector<VectorOfIntArray<TDim>, int[], TDim>,
//     IMultiplyOperators<VectorOfIntArray<TDim>, VectorOfIntArray<TDim>, VectorOfIntArray<TDim>>,
//     IAdditionOperators<VectorOfIntArray<TDim>, VectorOfIntArray<TDim>, VectorOfIntArray<TDim>>
//     where TDim : IDimension, new()
// {
//     public VectorOfIntArray() : base() { }
//     public VectorOfIntArray(params int[][] values) : base(values) { }

//     public static VectorOfIntArray<TDim> operator +(VectorOfIntArray<TDim> left, VectorOfIntArray<TDim> right) =>
//         new();

//     public static VectorOfIntArray<TDim> operator *(VectorOfIntArray<TDim> left, VectorOfIntArray<TDim> right) =>
//         new();
// }

class VectorOf<TData, TDim> : Vector<VectorOf<TData, TDim>, TData, TDim>
    where TDim : IDimension, new()
{

}
interface IDimension
{
    ushort Dimension { get; }
}
abstract class Dimension
{
    public class Two : IDimension
    {
        public ushort Dimension => 2;
    }

    public class Three : IDimension
    {
        public ushort Dimension => 3;
    }
}

public class GenericAdapterTest
{

    [Fact]
    public void OperatorTest()
    {
        VectorOf<decimal, Dimension.Two> v1 = VectorOf<decimal, Dimension.Two>.Create(1.2m, 2.2m);
        VectorOf<decimal, Dimension.Two> v2 = VectorOf<decimal, Dimension.Two>.Create(1.4m, 2.3m);
        Console.WriteLine(v1 * v2);

        VectorOf<float[], Dimension.Two> va1 = VectorOf<float[], Dimension.Two>.Create(new[] { 1.2f, 1.3f }, new[] { 1.4f, 1.5f });
        VectorOf<float[], Dimension.Two> va2 = VectorOf<float[], Dimension.Two>.Create(new[] { 1.2f, 1.3f }, new[] { 1.4f, 1.5f });
        Console.WriteLine(va1 * va2);
    }
}