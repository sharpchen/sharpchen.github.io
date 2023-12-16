# String nature in .NET

## String pool

In .NET, the string pool (also known as the intern pool) is a special area of memory where the runtime stores unique string literals. The purpose of the string pool is to optimize memory usage by ensuring that only one copy of a particular string value is held in memory, regardless of how many times it is used in the code. This is possible because strings are immutable in .NET; once a string is created, it cannot be modified.

### Mutating string in pool

We are able to mutate the string in pool in `unsafe` block to demonstrate this characteristic.

```c#
string text = "abc";

unsafe 
{
    fixed (char* p = text)
    {
        p[0] = 'd';
    }
}
Console.Write("abc"); // dbc
```

### Retrieve reference and register string from string pool

For string from external resources, we may need to registered it into string pool using `string.Intern(str: string): string`.
This approach is the same as declaring a string literal, they will all exist during application domain.

```c#
string url = ...;
HttpResponseMessage response = await httpClient.GetAsync(url);
string responseBody = await response.Content.ReadAsStringAsync();
// Register the string so it won't be auto collected.
string.Intern(responseBody);
```