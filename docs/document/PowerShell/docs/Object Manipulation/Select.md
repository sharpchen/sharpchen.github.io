# Select

## Overview

- Picking composed object by one or more properties with `-Property`.
    - select properties reversely by `-ExcludeProperty`.
- Picking single property value with `-ExpandProperty`.
- Take a count from start or end with `-First` or `-Last`.
- Skip a count from start or end `-Skip` or `-SkipLast`.
- Cherry-Pick one or more items by zero-based index.
- Distinct items selected from pipline.

> [!TIP]
> Use `select` alias for `Select-Object`.

## Select as an Object

`Select-Object` wraps selected properties as an `PSCustomObject`

```ps1
gps | Select-Object -Property Name # gets an object[] instead of string[]
(gps | select Name -First).GetType().Name # PSCustomObject
```

You can select multiple properties:

```console
$ gps | select Name, Id -First 1 | gm

   TypeName: Selected.System.Diagnostics.Process

Name        MemberType   Definition
----        ----------   ----------
Equals      Method       bool Equals(System.Object obj)
GetHashCode Method       int GetHashCode()
GetType     Method       type GetType()
ToString    Method       string ToString()
Id          NoteProperty int Id=12588
Name        NoteProperty string Name=ABDownloadManager
```

### Nested Property and Custom Property

`-Property` accepts a **Script Block** to calculate the **nested** property you'd like to select.

```console
$ gps | select Name, { $_.StartTime.DayOfWeek } -First 1

Name               $_.StartTime.DayOfWeek
----              ------------------------
ABDownloadManager                 Thursday
```

You can even define a custom calculation with a HashTable shaped as:
- `lable: string`: name of the property
- `expression: ScriptBlock`: an procedure returns the calculated property value.

```console
$ gci -File | select Name, @{ label = 'Size(KB)'; expression = { $_.Length / 1KB } }

Name         Size(KB)
----         --------
.gitignore       0.01
dotfiles.ps1     1.69
flake.lock       1.64
flake.nix        1.02
home.nix         0.63
install.ps1      1.49
make_vs.ps1      2.06
README.md        0.85
```

## Expand a Property

### Select Value Only

To select single value of a property instead of being wrapped as an object, use `-ExpandProperty`.
The return type is still an `object[]` since there's no generic resolution on Powershell.
But each memeber should be string indeed in the following snippet.

```ps1
gps | select -ExpandProperty Name
(gps | select -ExpandProperty Name).GetType().Name # object[]
(gps | select -ExpandProperty Name -First 1) -is [string] # True
```

> [!NOTE]
>  `Foreach-Object` can achieve the same thing
> ```ps1
> gps | foreach Name
> # or use another alias of ForEach-Object %
> gps | % Name
> ```

### Append Extra NoteProperty

`-ExpandProperty` can be used together with `-Property`, selected properties by `-Property` will be added as **NoteProperty** to the selected `-ExpandProperty`.

> [!WARNING]
> This approach mutates the selected property instead of generating a new object.

```ps1
$player = @{
    Id = 123
    Level = 15
    Status = 'Empowered'
    Partner = @{
        Id = 234
        Level = 12
        Status = 'Poisoned'
    }
}

# Adds a NoteProperty `Status` with the same value from $player to $player.Partner
$partner = $john | select Status -ExpandProperty Partner

[object]::ReferenceEquals($partner, $john.Child) # True

$child | gm -MemberType NoteProperty # Status

$partner.Status # Empowered # . accessor prefers ETS property
$partner['Status'] # Poisoned
```

> [!NOTE]
> `-ExpandProperty` can only take one property.

### Calculated Property

`Select-Object` can generate new NoteProperty to the `PSCustomObject` returned by specifying a HashTable with following shape:
- `Name`(or `N`, `Lable`, `L`): the name of the new property.
- `Expression`(`E`): the calculation logic for the new property represented as a script block.

```ps1
$person = @{
    FirstName = 'John'
    LastName = 'Smith'
}

# return a new PSCustomObject that has FirstName, LastName and FullName.
$person | select *, @{ Name = 'FullName'; Expression = { "$($_.FirstName) $($_.LastName)" } }
```

> [!NOTE]
> All selected properties from a HashTable will be regenerated as `NoteProperty`.
> Those selected properties are essentially `Keys` of the HashTable, not real properties.

## Take a Count

`Select-Object` can also take specific count of items from a collection, from start or end.

```ps1
gps | select -First 5
gps | select -Last 5
```

## Skip a Count

```ps1
gps | select -Skip 5
gps | select -SkipLast 5
```

## Cherry Pick 

```ps1
$dir = gci -Directory
$dir | select -Index 1, ($dir.Length - 1) # Pick first and last item
```

## Distinction

```ps1
# might have duplicated entries since file extensions should ignore casing.
ls | select Extension -Unique
# list all extensions appeared in current directory
ls | select Extension -Unique -CaseInsensitive
```
