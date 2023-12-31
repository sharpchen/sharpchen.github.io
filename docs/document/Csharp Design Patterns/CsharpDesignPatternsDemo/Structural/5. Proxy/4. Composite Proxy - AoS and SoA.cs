using System.Collections;
using System.Runtime.CompilerServices;
using Microsoft.Diagnostics.Tracing;

namespace CSharpDesignPatternsDemo.Structural;

struct Enemy
{
    public int Age { get; set; }
    public double Agility { get; set; }
}

class EnemyCollection(int size)
{
    internal int[]? _age;
    internal double[]? _agility;
    private readonly int _size = size;
    public EnemyShadow this[int index] => new(this, index);
    public static EnemyCollection Create(int size, Func<(int age, double agility)>? generator = default)
    {
        var result = new EnemyCollection(size)
        {
            _age = new int[size],
            _agility = new double[size]
        };
        if (generator is { })
        {
            for (int i = 0; i < size; i++)
                (result._age[i], result._agility[i]) = generator();
        }
        return result;
    }

    public ref struct Enumerator
    {
        private readonly EnemyCollection _enemies;
        private int _index;
        public Enumerator(EnemyCollection enemy)
        {
            _enemies = enemy;
            _index = -1;
        }
        public readonly EnemyShadow Current => _enemies[_index];

        public bool MoveNext()
        {
            int index = _index + 1;
            if (index < _enemies._size)
            {
                _index = index;
                return true;
            }
            return false;
        }
    }
    public Enumerator GetEnumerator() => new(this);
}

readonly ref struct EnemyShadow
{
    private readonly int _index;
    private readonly EnemyCollection _enemies;
    public EnemyShadow(EnemyCollection enemies, int index) => (_enemies, _index) = (enemies, index);
    public ref int Age => ref _enemies._age![_index];
    public ref double Agility => ref _enemies._agility![_index];
}
static class Magic
{
    public struct ArrayEnumerator<T>
    {
        T[] _arr;
        int _index;
        public ref T Current => ref _arr[_index];
        public ArrayEnumerator(in T[] arr)
        {
            _arr = arr;
            _index = -1;
        }
        public bool MoveNext()
        {
            int index = _index + 1;
            if (index < _arr.Length)
            {
                _index = index;
                return true;
            }
            return false;
        }
    }
    public static ArrayEnumerator<T> GetEnumerator2<T>(this T[] arr)
    {
        return new(in arr);
    }
    // public static void Freeze(Enemy[] enemies)
    // {
    //     foreach (var e in enemies) e.Agility = 0;
    // }

    // public static void Freeze(IEnumerable<Enemy> enemies)
    // {
    //     foreach (var e in enemies) e.Agility = 0;
    // }
    public static void Freeze(EnemyCollection enemies)
    {
        foreach (var e in enemies) e.Agility = 0;
    }
    public static void Age(EnemyCollection enemies, int count = 1)
    {
        foreach (var e in enemies) e.Age += count;
    }
    // public static void Age(Enemy[] enemies, int count = 1)
    // {
    //     foreach (var e in enemies) e.Age += count;
    // }
}


struct EnemyCollection2(int size)
{
    internal int[]? _age;
    internal double[]? _agility;
    private readonly int _size = size;
    public EnemyShadow2 this[int index] => new(this, index);
    public static EnemyCollection2 Create(int size, Func<(int age, double agility)>? generator = default)
    {
        var result = new EnemyCollection2(size)
        {
            _age = new int[size],
            _agility = new double[size]
        };
        if (generator is { })
        {
            for (int i = 0; i < size; i++)
                (result._age[i], result._agility[i]) = generator();
        }
        return result;
    }

    public ref struct Enumerator
    {
        private readonly EnemyCollection2 _enemies;
        private int _index;
        public Enumerator(EnemyCollection2 enemy)
        {
            _enemies = enemy;
            _index = -1;
        }
        public readonly EnemyShadow2 Current => _enemies[_index];

        public bool MoveNext()
        {
            int index = _index + 1;
            if (index < _enemies._size)
            {
                _index = index;
                return true;
            }
            return false;
        }

    }
    public Enumerator GetEnumerator() => new(this);
}
readonly ref struct EnemyShadow2
{
    private readonly int _index;
    private readonly EnemyCollection2 _enemies;
    public EnemyShadow2(EnemyCollection2 enemies, int index) => (_enemies, _index) = (enemies, index);
    public ref int Age => ref _enemies._age![_index];
    public ref double Agility => ref _enemies._agility![_index];
}

struct EnemySpan(int size)
{
    internal int[]? _age = new int[size];
    internal double[]? _agility = new double[size];
    internal readonly Span<int> Age => _age.AsSpan();
    internal readonly Span<double> Agility => _agility.AsSpan();
    int _size = size;

    public EnemySpan(int size, Func<(int age, double agility)>? generator = default) : this(size)
    {
        if (generator is { })
        {
            for (int i = 0; i < size; i++)
                (_age![i], _agility![i]) = generator();
        }
    }
    public Enumerator GetEnumerator() => new(this);
    public ref struct Enumerator
    {
        private EnemySpan _enemies;
        private int _index;
        public Enumerator(EnemySpan enemy)
        {
            _enemies = enemy;
            _index = -1;
        }
        public EnemyShadow3 Current => new(ref _enemies.Age[_index], ref _enemies.Agility[_index]);

        public bool MoveNext()
        {
            int index = _index + 1;
            if (index < _enemies._size)
            {
                _index = index;
                return true;
            }
            return false;
        }
    }
}
ref struct EnemyShadow3
{
    private static readonly int[] a = { 1 };
    private static readonly double[] b = { 1 };

    private readonly int _index;
    private readonly EnemySpan _enemies;
    public EnemyShadow3(ref EnemySpan enemies, int index) => (_enemies, _index) = (enemies, index);
    public EnemyShadow3(ref int age, ref double agility)
    {
        _age = age;
        _agility = agility;
    }
    private ref int _age = ref a[0];
    private ref double _agility = ref b[0];
    public ref int Age
    {
        get
        {
            // if (!_enemies.Equals(default)) return ref _enemies.Age[_index];
            return ref _age;
        }
    }

    public ref double Agility
    {
        get
        {
            // if (!_enemies.Equals(default)) return ref _enemies.Agility[_index];
            return ref _agility;
        }
    }
}