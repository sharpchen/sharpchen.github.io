# Extended Type System

Extended Type System(ETS) is for consistent experience with **some** `.NET` types when working with PowerShell.

There's two approaches that PowerShell did for implementing the ETS.

- Intrinsic members for all objects, and intrinsic member for specific type of objects.
- Dynamic manipulation to members of an object.
- Potentially wrap an object as `PSObject`.

## Intrinsic Members

There's two kinds of intrinsic members in PowerShell
- Object views: the mapping of a certain object.
- Property and methods: intrinsic properties and methods.

### Object Views

Powershell distributes members to three parts for each object: *extended*, *adapted* and *base*.

- `psobject`: a `MemberSet` containing reflection source of members.
    - `psobject.baseobject`: a reference of the object itself.
    - `psobject.properties`: all properties from all sources(extended, adapted and base)
    - `psobject.members`: all members(including properties) from all sources(extended, adapted and base)
    - `psobject.methods`: all methods from type definition(such as `.NET` type), including raw methods of properties and indexers.
    ```ps1
    $foo = 'I am foo'
    [object]::ReferenceEquals($foo, $foo.psobject.BaseObject) # True
    ```
- `psbase`: a `MemberSet` containing members of the **original object**.
    - the base members are defined ahead of time such as `.NET` types.
- `psadapted`: a `MemberSet` containing adapted members added by ETS.
    - members appended dedicatedly for a type **by all means**.
    ```ps1
    $x = [System.Xml.XmlDocument]::new()
    $x.LoadXml("<foo><bar>123</bar></foo>")
    $x.psadapted.foo.bar # 123 # [!code highlight]
    ```
- `psextended`: a `MemberSet` containing extended members **added at runtime**.
    - properties appended dynamically(conditionally) are extended property, such as `PSPath` for `[FileSystemInfo]` created from item cmdlets.
    - properties of a `[pscustomobject]` are extended properties.
- `pstypenames`: a `CodeProperty` equivalent to `psobject.TypeNames`. Returns a collection containing the type names of inheritance chain.

    ```ps1
    $foo = 'I am foo'
    [object]::ReferenceEquals($foo.psobject.TypeNames, $foo.pstypenames) # True
    ```

#### Member Priority

1. `psextended`
2. `psadapted`
3. `psbase`

### Intrinsic Methods

Intrinsic methods and properties are to mimic singular object and collection in a same form.
- `Where`: a method for filtering or slicing by condition. See [Where](../Object Manipulation/3.Where.md)
- `ForEach`: a method to perform iteration with certain logic or perform casting all items to target type. See [ForEach](../Object Manipulation/4.ForEach.md#Intrinsic%20ForEach)
- `Count`
- `Length`

### Constructor

For all objects of `System.Type`, there's a intrinsic `New` method as constructor.

> [!NOTE]
>**Intrinsic members are not described as part of certain type definition, they're isolated from the object-oriented type system.**
> Object views are visible to `Get-Member -Force` while intrinsic methods aren't.



A common example would be `Process` type.

```ps1
(gps | select -First 1).GetType().Name # Process
(gps | select -First 1) -is [PSObject] # True
# -is checks underlying type too
(gps | select -First 1) -is [System.Diagnostics.Process] # True
```

The functionality of ETS achieved benefits:

- Allow custom behaviors like formatting, sorting for your custom type or object.
- Dynamic interpreting a `HashTable` to any `PSObject`
- Accessibility to the underlying object.
- Manipulation on extended members.

## ETS Members

To represent meta of ETS members, PowerShell has an abstract class called `PSMemberInfo`, each concrete member info type is derived from it.

```cs
public abstract class PSMemberInfo { }
```


The facts of ETS members:
- each member has a type inherited from `PSMemberInfo`.

