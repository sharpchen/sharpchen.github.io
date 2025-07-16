# Duck Typing in CSharp

## **List Initializer**

Any type implemented `IEnumerable` and has a `Add(T item): void` method can use *list initializer* syntax.
- `Add(T item): void` can be implemented as extension method
- `ICollection` is more generally used to have *list initializer* enabled, because it's an extension of `IEnumerable` with `Add` method.

```cs
_ = new FooCollection<int>() { 1, 2, 3 }; // [!code highlight]

class FooCollection<T> : IEnumerable<T> {
    public void Add(T item) { Console.WriteLine(item); } // [!code highlight]
    public IEnumerator<T> GetEnumerator() {
        throw new NotImplementedException();
    }
    IEnumerator IEnumerable.GetEnumerator() {
        return GetEnumerator();
    }
}
// or implement it as extension method
static class Ext {
    public static void Add<T>(this FooCollection<T> self, T item) { } // [!code highlight]
}
```

## **Deconstruction**

```cs
var (a, b) = new Foo(); // [!code highlight]

class Foo { };

static class FooExtension {
    public static void Deconstruct(this Foo self, out int a, out int b) { a = b = 1; } // [!code highlight]
}
```
## **Iteration**

Any type with a `GetEnumerator` implementation can be iterated by `foreach` statement.
- can be implemented as an extension method

```cs
using System.Collections;

foreach (var _ in new FooIterable()) { } // [!code highlight]

class FooIterable { };

static class FooExtension {
    public static IEnumerator GetEnumerator(this FooIterable _) { // [!code highlight]
        for (int i = 0; i < 100; i++) // [!code highlight]
            yield return i; // [!code highlight]
    } // [!code highlight]
}
```
