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

### Default Parameter

- Explicitly typed parameters can have implicit default value.
    - `switch` and `bool` is `$false` by default.
    - `string` is `[string]::Empty` by default.
    - Numeric types are zero value by default.
- Parameters without type annotation are always typed as `object` which has the default value `$null`.
- Can override default value by `=` in declaration.

```ps1

& { param([string]$name) $name -eq [string]::Empty } # True
& { param($name) $name -eq $null } # True
& { param([int]$age) $age -eq 0 } # True
& { param([switch]$is) $is -eq $false } # True

function Foo {
    param (
        [string]$foo = "foo"
    )
}
```

> [!NOTE]
> For overriding default parameter outside the function, see [$PSDefaultParameterValues](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameters_default_values?view=powershell-7.4#long-description) 

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

- `begin`: state initializationa for the pipeline iteration.
- `process`: logic for each pipeline iteration.
- `end`: final action for the completed pipeline iteration.
- `clean`: a `finally` block to execute clean up no matter what happens.(PowerShell 7.3+)

```ps1
function Foo {
    begin {}
    process {}
    end {}
    clean {}
}
```

> [!NOTE]
> When no named block were specified, `end` block is used to represent the whole logic of a simple function.
>```ps1
>function Foo {
>    end {
>        echo hello
>    }
>}
># equivalent to 
>function Foo {
>    echo hello
>}
>```

## Filter Function

Filter is a special kind of function that implicitly accepts pipeline to perform transformation(select) or filtering(where).
Filter is useful when you need to reuse the same logic for unknown pipeline manipulations, reducing hard coding.

```ps1
filter Foo {
    "$_" # can transform
}

# equivalent to
function Foo {
    process {
        "$_"
    }
}
```

## Lifetime

- Function should be define before it was called.
