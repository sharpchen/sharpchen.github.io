# Intrinsic Members

All objects in PowerShell have five intrinsic members:

- `psobject`: Reflection source of members.
- `psbase`: a `MemberSet` containing members of the object being wrapped.
- `psadapted`: adapted members added by ETS.
- `psextended`: a `MemberSet` containing extended members **added at runtime**.
- `pstypenames`: equivalent to `psobject.TypeNames`. A collection containing the type names of inheritance chain.

```ps1

```
