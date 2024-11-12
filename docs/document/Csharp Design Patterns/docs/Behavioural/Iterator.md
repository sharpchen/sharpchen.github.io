# Iterator

## Motivation

Knows how to traverse over an object
- Keep track of current element.
- Knows how to move to next object.

## Iterator as an Object

The classic approach of an Iterator is making it an object for the enumeration of certain type.
Since we're using .NET, we'll implement it with `IEnumerator` and `IEnumerator<T>`.

Let's take a look of `IEnumerator`:

```cs
public interface IEnumerator
{
    object Current { get; }
    bool MoveNext(); // change state and tell whether can move to next item.
    void Reset(); // reset to initial state before iteration.
}
```

Back in the early days when `C#` doesn't have generic types, `IEnumerator` was designed as a reconciled way.

Later we got `IEnumerator<T>` which simply overrides `Current` with concrete type.

```cs
public interface IEnumerator<out T> : IEnumerator, IDisposable
{
    T Current { get; }
}
```

> [!NOTE]
> `IEnumerator<T>` extends `IDisposable` for making sure the object being iterated can be collected by GC later on.

```cs
int[] foo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

ArrayEnumerator<int> enumerator = new(foo);

while (enumerator.MoveNext())
{
    Console.WriteLine(enumerator.Current);
}

class ArrayEnumerator<T> : IEnumerator<T>
{
    private readonly T[] _source = [];
    private int _cursor;
    public ArrayEnumerator(T[] source)
    {
        _source = source;
        Current = source[0];
    }

    public T Current { get; private set; }

    object IEnumerator.Current => Current;


    public bool MoveNext()
    {
        if (_cursor < _source.Length)
        {
            Current = _source[_cursor++];
            return true;
        }
        return false;
    }

    public void Reset()
    {
        _cursor = 0;
    }

    public void Dispose() { }
}
```

> [!tip]
> It'e pretty ahrd to implement recursive logic in an iterator object, use iterator method instead if you do want it.

## Iterator as a Method

.NET can auto generates state machine for each method yield returns `IEnumerable<T>`.

```cs
using System.Collections;

int[] foo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
foreach (var item in EnumerateArray(foo))
{
    Console.WriteLine(item);
}
// pointless but that's ok
static IEnumerable<T> EnumerateArray<T>(T[] source)
{
    for (int i = 0; i < source.Length; i++)
        yield return source[i];
}
```

> [!TIP]
> You can have multiple getter as Iterator methods, representing different ways of enumeration.

If you do want the type has an overall solution for enumeration, just implement a `GetEnumerator` method.
`foreach` and `GetEnumerator` now supports duck typing, meaning that:

- An object implemented `GetEnumerator` can be enumerated by `foreach`
- The return type of `GetEnumerator` can be valid as long as it satisfies the shape of `IEnumerator<T>`

This feature is typically for `ref struct`.

## Conclusion

- Use `IEnumerator<T>` to implement an Iterator class.
- Use `IEnumerable<T>` as return type for Iterator methods.
- Implement `GetEnumerator` to mark a the type to handle iteration by itself.
