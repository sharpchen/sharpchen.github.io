# Object Members

## Member Inspection

> [!TIP]
> Use `gm` alias for `Get-Member`.

```ps1
ls | Get-Member
```

When inspecting an array of objects, `gm` only returns members for distinct types.

```ps1
@(123, '123') | gm | select -ExpandProperty TypeName -Unique
# System.Int32
# System.String

(@('123', 123) | Get-Member).Length # 82
(@('123', 123, 123) | Get-Member).Length # still 82

```

`Get-Member` returns a `MemberDefinition[]` or a `MemberDefinition` with following properties.

```cs
class MemberDefinition
{
    public string Definition { get; } // expression or value or signature of the member
    public System.Management.Automation.PSMemberTypes MemberType { get; } // type of member
    public string Name { get; } // member name
    public string TypeName { get; } // fullname of type or return type of the member
}
```

## Member Types


