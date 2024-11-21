# Extended Type System

Extended Type System(ETS) is for consistent experience with **some** `.NET` types when working with Powershell.

For this purpose, Powershell wraps the traget object as `PSObject` with two approaches:

- Set the object to be wrapped as a meta object(similar to lua metatable)
- Add extra members to the containing `PSObject` itself.

A common example would be `Process` type.

```ps1
(gps | select -First 1).GetType().Name # Process
(gps | select -First 1) -is [PSObject] # True
(gps | select -First 1) -is [PSCustomObject] # True
# -is checks underlying type too
(gps | select -First 1) -is [System.Diagnostics.Process] # True
```

The functionality of ETS achieved benifits:

- Allow custom behaviours like formatting, sorting for your custom type or object.
- Dynamic interpreting a `HashTable` to any `PSObject`
- Accessibility to the underlying object.
- Manipulation on extended members.

## ETS Members

To represent meta of ETS members, Powershell has an abstract class called `PSMemberInfo`, each concrete member info type is derived from it.

```cs
public abstract class PSMemberInfo { }
```


The facts of ETS members:
- each member has a type inherited from `PSMemberInfo`.

## PSObject
