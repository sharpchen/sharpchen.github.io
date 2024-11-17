# Script Block

**Script Block** is a special object in powerhsell, it looks like a syntax that creates a new scope in the flow, but itself can be stored in a variable.
So it's more like a anonymous function, you may call it as lambda expression.

```ps1
$action = {
    echo 'hello from script block'
}

$func = {
    param($foo, $bar)
    return "$foo$bar"
}
```

## Invoke a Script Block

```ps1
& { 1, 2 }
# 1
# 2

& { param($a, $b) $a, $b } 'a' 'b'
# a
# b
```

## Script Block as Lambda

As a replacement for lambda expression, Script Block is being used to work with LINQ api.

```ps1
$arr = @(1, 2, 3, 5)
$arr.Where({ $_ -lt 4 })
```
