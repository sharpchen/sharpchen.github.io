# Attribute Targets

## Standardized attribute names

```cs
Console.WriteLine(string.Join(", ", Enum.GetNames(typeof(AttributeTargets))));
// Assembly, Module, Class, Struct, Enum, Constructor, Method, Property, Field, Event, Interface, Parameter, Delegate, ReturnValue, GenericParameter, All
```

## Explicit attribute target

|Target name|Context|
|---|---|
|`event`|event|
|`field`|field, auto property, field-like event|
|`method`|constructor, finalizer, method, operator, property getter and setter, indexer getter and setter, field-like event|
|`param`|property setter, indexer setter, parameter of a constructor or a method or a operator|
|`property`|property, indexer|
|`return`|method, operator, property getter and setter, indexer getter and setter, delegate|
|`type`|`class`, `struct`, `interface`, `enum`, `delegate`|
|`typevar`|type parameter|
|`assembly`|global|
|`module`|global|

```cs
[assembly: MyAttribute]
[module: MyAttribute]

[AttributeUsage(AttributeTargets.All)]
class MyAttributeAttribute : Attribute { }

[type: MyAttribute]
[method: MyAttribute] // apply to primary constructor
class C<[typevar: MyAttribute] T>([param: MyAttribute] T a)
{
    [return: MyAttribute]
    private delegate void MyDelegate<[typevar: MyAttribute] U>([param: MyAttribute] U a);

    [field: MyAttribute]
    public T c = a;

    [event: MyAttribute]
    [field: MyAttribute]
    [method: MyAttribute]
    event MyDelegate<T>? Event;

    [property: MyAttribute]
    [field: MyAttribute]
    public int MyProperty
    {
        [method: MyAttribute]
        [return: MyAttribute]
        get;
        [method: MyAttribute]
        [param: MyAttribute]
        [return: MyAttribute]
        set;
    }

    [property: MyAttribute]
    public int this[int i]
    {
        [method: MyAttribute]
        [return: MyAttribute]
        get => default;
        [method: MyAttribute]
        [param: MyAttribute]
        [return: MyAttribute]
        set => _ = value;
    }

    [method: MyAttribute]
    [return: MyAttribute]
    public static T? operator +([param: MyAttribute] C<T> left, [param: MyAttribute] object right) => default;
    public static void M<[typevar: MyAttribute] K, [typevar: MyAttribute] V>() { }

    [method: MyAttribute]
    ~C() { }
}
```
