# Object Members

> [!TIP]
> Use `gm` alias for `Get-Member`.

```ps1
ls | Get-Member
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


