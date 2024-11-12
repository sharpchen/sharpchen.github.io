# Duck Typing in CSharp

Currently only `GetEnumerator` and `Deconstruct` supports duck typing.
`Dispose` is just not available since you the compiler won't be able to know which one to pick if there's duplication.

```cs
using System.Collections;

using var foo = new Foo(); // [!code error] 
foreach (var _ in new Foo()) ;
var (a, b) = new Foo();

class Foo;

static class FooExtension
{
    public static void Dispose(this Foo self) => Console.WriteLine("Disposing Foo");
    public static IEnumerator GetEnumerator(this Foo _)
    {
        for (int i = 0; i < 100; i++)
            yield return i;
    }
    public static void Deconstruct(this Foo self, out object? a, out object? b) => a = b = null;
}
```

If you do want the type has an overall solution for enumeration, just implement a `GetEnumerator` method.
`foreach` and `GetEnumerator` now supports duck typing, meaning that:

- An object implemented `GetEnumerator` can be enumerated by `foreach`
- The return type of `GetEnumerator` can be valid as long as it satisfies the shape of `IEnumerator<T>`

This feature is typically for `ref struct`.
