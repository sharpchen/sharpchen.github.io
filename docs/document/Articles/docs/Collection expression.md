# Collection expression

## Short hand for `Empty`

```cs
int[] empty = [];
(empty == Array.Empty<int>()).Dump(); // true
```

```cs
IEnumerable<int> empty = [];
(empty == Array.Empty<int>()).Dump(); // true
```
