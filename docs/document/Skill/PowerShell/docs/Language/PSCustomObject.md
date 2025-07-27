# PSCustomObject

`PSCustomObject` is a minimal object representation over `System.Object`.
Custom properties are allowed as `NoteProperty`.

In the following example, the `PSCustomObject` created has the same member as default `[object]` except the NoteProperty `Foo`.

```ps1
[object]::new() | gm
[PSCustomObject]@{ Foo = 'I am a NoteProperty!' } | gm
```

## Why Do We Need it

Differ from HashTable as a dictionary, `[PSCustomObject]` is a representation for object literal.
The must-know is **`[PSCustomObject]` maps to the same type as `[psobject]`, `System.Management.Automation.PSObject`.**
The only valid usage is marking one HashTable as `System.Management.Automation.PSCustomObject`. Other possible usages of `[PSCustomObject]` is bascially pointless.

> [!WARNING]
> Do not use `PSCustomObject` if case-sensitive keys matter, name of extended properties are not case-sensitive, use `HashTable` instead.

## Creation

PSCustomObject borrows the syntax from HashTable with a casting.

```ps1
$john = [PSCustomObject] @{
    Name = 'John Smith'
    Age = 18
}
```

### From HashTable

You can explicitly convert a HashTable to PSCustomObject

```ps1
$table = @{
    Foo = 'foo'
}

$obj = [PSCustomObject]$table # [!code highlight]
```

Or use `New-Object`, but this might be slower.

```ps1
$obj = New-Object -TypeName PSObject -Property $table
```

## Shallow Copy

```ps1
$john = [PSCustomObject] @{
    Name = 'John Smith'
    Age = 18
}

$smith = $john.psobject.Copy()
```

## Add New Members

You can't directly add new properties after declaration using dot accessor.
One should use `Add-Member` to append new members.

```ps1
$obj | Add-Member -MemberType NoteProperty -Name PropName -Value Value
```

> [!NOTE]
> All members of a `[pscustomobject]` should be *extended properties*, you can inspect them using `$obj.psextended`

## Enumerating Properties

```ps1
$obj.psobject.properties | foreach { $_.Value = 0 }
```

