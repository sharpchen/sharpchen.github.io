# ForEach

> [!TIP]
> Use `foreach` or `%` alias for `ForEach-Object`.

## Works like Select

`ForEach-Object` can do the same thing as `Select-Object -ExpandProperty`.

```ps1
gci | foreach Name
# or
gci | foreach { $_.Name }
# equivalent to 
gci | select -ExpandProperty Name
```

The way `ForEach-Object` behaves is collecting implicitly returned values as an array. Every implicitly returned value will be collected as a item.

```ps1
gci | foreach { $_.Exists, $false } # True, False, True, False...
```

If you do want a `$null` return, use `Out-Null` to swallow the value.

```ps1
# doesn't make much sense though
$null -eq (gci | foreach { $_.Name | Out-Null }) # True
```

> [!NOTE]
> One exception is `ForEach-Object` can execute method by name.
> You might expect delegate objects to be returned, but no, values of the method being executed will be returned.
>```ps1
>(1,2,3 | % GetType | select -first 1) -is [System.Type] # True
>```

