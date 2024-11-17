# PSCustomObject

**PSCustomObject** is similar to object literal that can even have custom methods.

## Create a PSCustomObject

PSCustomObject borrows the syntax from HashTable with a casting.

```ps1
$john = [PSCustomObject] @{
    Name = 'John Smith' 
    Age = 18
}
```

### From a HashTable

You can explicitly convert a HashTable to PSCustomObject

```ps1
$table = @{
    Foo = 'foo'
}

$obj = [PSCustomObject]$table # [!code highlight] 
```

Or use `New-Object`

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
