# HashTable

HashTable is a dynamicly typed data structure in PowerShell, it implements `IDictionary` but is wrapped with the extended types system.
It's the native type and is unique to PowerShell itself.

```ps1
@{} -is [System.Collections.IDictionary] # True
```

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
}).Keys # C B A

@{
    C = 'C'
    B = 'B'
    A = 'A'
}.Keys # B C A
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
```

> [!TIP]
> Always use indexer to access value of a HashTable. `.` will prefer Extended Property that might be unexpected.

## Merging

```ps1
@{ foo = 123; bar = '123' } + @{ baz = 234 }
```

> [!WARNING]
> `+` will throw if the two have any duplicated key.
