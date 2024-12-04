# HashTable

HashTable is essentially `System.Collections.HashTable`, the non-generic version of `Dictionary<,>`.

```ps1
@{} -is [System.Collections.IDictionary] # True
@{} -is [System.Collections.HashTable] # True
```

> [!TIP]
> HashTable serves as more like a dictionary with syntax sugar, if you want it to be more like object literal, use `[pscustomobject]`.

## Creation

PowerShell has builtin syntax for creating a HashTable.
Inline declaration requires `;` to distinguish key-value pairs.

```ps1
$foo = @{
    Name = 'foo'
    Age = 18
}

$foo = @{ Name = 'foo'; Age = 18 }
```

### Ordered HashTable

`[ordered]` is a mark can be used when creating HashTable literal, it makes sure that all entries are ordered as in declaration and subsequent appending.

```ps1
([ordered]@{
    C = 'C'
    B = 'B'
    A = 'A'
}).Keys # C B A # [!code highlight] 

@{
    C = 'C'
    B = 'B'
    A = 'A'
}.Keys # B C A # [!code highlight] 
```

> [!NOTE]
> `[ordered]` can not be used as type, but it's indeed a `System.Collections.Specialized.OrderedDictionary`.
>```ps1
>([ordered]@{}).GetType().FullName # System.Collections.Specialized.OrderedDictionary
>```

## Access Values

You can access value of one or more keys by indexer.

```ps1
$foo['Name'] # foo
$foo['Name', 'Age'] # @('foo', 18)
```

`.` accessor would also works **as long as there's no duplicated Extended Property with the same name of the key you passed.**

```ps1
$foo.Name # foo
$foo.'Name'
$name = 'name'
$foo.$name
```

> [!TIP]
> Always use indexer to access value of a HashTable. `.` will prefer Extended Property that might be unexpected.

> [!NOTE]
> Key in HashTable can be any type. So if the key is not a singular type, you'll have to extract the key from `Keys` first and then access the value by the key.

## Merging

```ps1
@{ foo = 123; bar = '123' } + @{ baz = 234 }
```

> [!WARNING]
> `+` will throw if the two have any duplicated key.
