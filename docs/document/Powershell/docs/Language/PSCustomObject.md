# PSCustomObject

Differ from HashTable, `[PSCustomObject]` is a representation for object literal.
It 

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

## Copy a PSCustomObject

- Shallow copy

```ps1
$john = [PSCustomObject] @{
    Name = 'John Smith' 
    Age = 18
}

$smith = $john.PSObject.Copy()
```
