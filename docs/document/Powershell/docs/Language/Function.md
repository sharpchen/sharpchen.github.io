# Function

## Return

Powershell allows implicit return, and multiple implicit returns.

> [!NOTE]
> Implicit returns are auto-collected as an array or single value.
> And it does not print out anything.

```ps1
[int] function Sum {
    param([int]$l, [int]$r)
    $l + $r # implicit return # [!code highlight] 
}

# You won't need to declare an array and append it on each loop!
# they're collected automatically as they're implicit returns
function Foo {
   for($i = 0; $i -lt 10; $i = $i + 1)  {
        $i
   }
}

(Foo).GetType().Name # object[] # [!code highlight] 
```

Explicit return is surely supported, but more like a necessity to exit inside a flow.

```ps1
[int] function Sum {
    param([int]$l, [int]$r)
    return $l + $r # explicit return # [!code highlight] 
    $r + $l # not reachable  # [!code warning] 
}
```

## Parameter

Parameters are wrapped inside a function block with `param(...)`

```ps1
function Foo {
    param (
        $Foo
    )
}
```

> [!NOTE]
> 
> Default type of a parameter is `System.Object`.

### Positional Parameter

Positional parameters allows passing values with explicit names.

```ps1
function Foo {
    param (
        [string] $Foo,
        [string] $Bar
    )
    
    Write-Output "$Foo $Bar"
}

Foo -Foo foo -Bar bar
Foo foo bar # it's the same # [!code highlight] 
```

### Default Parameter

```ps1
function Foo {
    param (
        [string]$foo = "foo"
    )
}
```

### Flags

Defining flags that represents a toggle needs a special type called `switch`.
`switch` has the same nature of `bool`, but `bool` parameter requires explicit assignment when the function being called.
While `switch` will remain `$false` when unspecified.

```ps1
function Foo {
    param (
        [switch]$Foo
        [bool]$Bar
    )
}

# this is why we should use `switch` instead.
Foo -Foo -Bar $true # [!code highlight]
```

### Required Parameter

All parameters are optional by default. Use `[Parameter(Mandatory=$true)]` to mark it as required.

```ps1
param (
    [Parameter(Mandatory=$true)]
    [string]$RequiredName
)
```

### Parameter Alias

Parameters can have aliases. It's not needed for most of time though since pwsh can distinguish option by leading string.

```ps1
function Person {
    param (
        [Alias("n")] # [!code highlight] 
        [string]$Name,

        [Alias("a")] # [!code highlight] 
        [int]$Age
    )
    Write-Host "Name: $Name, Age: $Age"
}

Person -n "Alice" -a 30 # [!code highlight] 
```

## Lifetime

- Function should be define before it was called.
