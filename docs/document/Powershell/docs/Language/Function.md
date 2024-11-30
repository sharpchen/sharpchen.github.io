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

### Implicit Parameter

If no parameter name was set, all value passed in will be captured by `$args`, an `object[]`.

The following example makes an alias for Neovim to mimic the original Vim cli.

```ps1
function vim {
    nvim --clean -c 'source ~/.vimrc' @args
}

vim ./foo.txt
```

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

Or use a explicit position argument on attribute.

```ps1
function Foo {
    param (
        [Parameter(Position=1)] # [!code highlight] 
        [string] $Bar
        [Parameter(Position=0)] # [!code highlight] 
        [string] $Foo,
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

Manual assignment is also available:

```ps1
Foo -f:$false -b $true
```

### Required Parameter

All parameters are optional by default. Use `[Parameter(Mandatory=$true)]` to mark it as required.

```ps1
param (
    [Parameter(Mandatory=$true)]
    [string]$RequiredName
)
```

> [!NOTE]
> You can omit assignment for boolean attribute parameter.
>```ps1
>param (
>    [Parameter(Mandatory)] # Mandatory is true now # [!code highlight] 
>    [string]$RequiredName
>)
>```

### Parameter Alias

Parameters can have aliases. It's not needed for most of time though since pwsh can distinguish option by leading string.

```ps1
function Person {
    param (
        [Alias('n')] # [!code highlight] 
        [string]$Name,

        [Alias('a', 'yearsold')] # can have multiple aliases! # [!code highlight] 
        [int]$Age
    )
    Write-Host "Name: $Name, Age: $Age"
}

Person -n "Alice" -a 30 # [!code highlight] 
```

### Parameter Validation

Pass a validation logic as script block to `ValidateScript` attribute, `$_` represents singular value of the parameter or current item of a collection.
Will throw an error if any parameter does not satisfies the condition.

```ps1
param (
    [ValidateScript({ ($_ % 2) -ne 0 })]
    [int[]]$Odd
    [ValidateScript({ $_.Length < 5 })]
    [string]$Name
)
```

## Named Blocks

In a simple function where there's only one series of parameters being taken, we don't have to use any complex logic.
But things will explode when we're dealing with a pipeline input which might bring multiple objects.

The pipeline mechanism is essentially based on the `Enumerator` so if we collect all items into a new collection as parameter value, it can be a huge performance issue.
So named blocks are essentially to defined a shared process logic for each object in the pipeline input, and other logic like initializationa and finalization.

> [!NOTE]
> When no named block were specified, `end` block is used to represent the whole logic of a simple function.

```ps1
function Foo {
    begin {}
    process {}
    end {}
}
```

## Lifetime

- Function should be define before it was called.
