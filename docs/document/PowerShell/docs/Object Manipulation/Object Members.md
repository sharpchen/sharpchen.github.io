# Object Members

## Member Inspection

### Inspect from Pipeline

`Get-Member` can insepct objects from a pipeline input, which means by iterating them one by one.

> [!TIP]
> Use `gm` alias for `Get-Member`.

**Only members from a unique type in that pipeline input enumeration will be collected as the result.**

```ps1
(gci -file | select -first 1 | gm).Length # 53
(gci -dir | select -first 1 | gm).Length # 47
# assuming current directory has both directory and file
(gci | gm).Length # 53 + 47 = 100
```

The whole array returned from `Get-Member` is `object[]`, each item inside is a `MemberDefinition`

```ps1
(gci | gm) -is [object[]] # True
(gci | gm | select -first 1) -is [MemberDefinition] # True
```

### Inspect from Object

To treat a whole collection as the object to be inspected, do not pipe it, pass it to `-InputObject` instead.
Or magically wrap it as a single-item collection.

```ps1
gm -InputObject (gci -file) # TypeName: System.Object[]
,(gci -file) | gm
```

## Member Types


