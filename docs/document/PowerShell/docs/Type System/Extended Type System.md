# Extended Type System

Extended Type System(ETS) is for consistent experience with **some** `.NET` types when working with PowerShell.

There's two approaches that PowerShell did for implementing the ETS.

- Intrinsic members for all objects.
- Dynamic manipulation to members of an object.
- Potentially wrap an object as `PSObject`.

## Intrinsic Members

There's two kinds of intrinsic members in PowerShell
- Object views: the mapping of a certain object.
- Property and methods: intrinsic properties and methods.

All objects in PowerShell have five **object views** members:

- `psobject`: a `MemberSet` containing reflection source of members.
```ps1
$foo = 'I am foo'
[object]::ReferenceEquals($foo, $foo.psobject.BaseObject) # True
```
- `psbase`: a `MemberSet` containing members of the object being wrapped.
```ps1
$foo = 'I am foo'
[object]::ReferenceEquals($foo.ToString, $foo.psbase.ToString) # True
```
- `psadapted`: a `MemberSet` containing adapted members added by ETS.
- `psextended`: a `MemberSet` containing extended members **added at runtime**.
- `pstypenames`: a `CodeProperty` equivalent to `psobject.TypeNames`. Returns a collection containing the type names of inheritance chain.
```ps1
$foo = 'I am foo'
[object]::ReferenceEquals($foo.psobject.TypeNames, $foo.pstypenames) # True
```

Intrinsic methods and properties are to mimic singular object and collection in a same form.
- `Where`: a method for filtering or slicing by condition. See [Where](../Object Manipulation/Where.md) 
- `ForEach`: a method to perform iteration with certain logic or perform casting all items to target type. See [ForEach](../Object Manipulation/ForEach.md) 
- `Count`
- `Length`


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

