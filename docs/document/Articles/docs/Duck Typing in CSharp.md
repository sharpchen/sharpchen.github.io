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
