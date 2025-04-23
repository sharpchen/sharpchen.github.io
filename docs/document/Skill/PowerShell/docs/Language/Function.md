# Function

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

## Implicit Parameter

If no parameter name was set, all value passed in will be captured by `$args`, an `object[]`.

The following example makes an alias for Neovim to mimic the original Vim cli.

```ps1
function vim {
    nvim --clean -c 'source ~/.vimrc' @args
}

vim ./foo.txt
```

> [!NOTE]
> `$args` is not available when any of `ParameterAttribute` and `CmdletBinding` is applied on the function.

## Positional Parameter

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
        [Parameter(Position = 1)] # [!code highlight] 
        [string] $Bar
        [Parameter(Position = 0)] # [!code highlight] 
        [string] $Foo,
    )
    
    Write-Output "$Foo $Bar"
}

Foo -Foo foo -Bar bar
Foo foo bar # it's the same # [!code highlight] 
```

PowerShell starts counting the position when there's a value belonging to no explicit parameter name.
Assuming `-Flag` is a switch, `-Foo` has position `0`, the value `foo` will be assigned to `-Foo`.

```ps1
Foo -Flag foo
```

## Flags

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

## Default Parameter

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

## Required Parameter

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

## Parameter Alias

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

## Parameter Validation

Pass a validation logic as script block to `ValidateScript` attribute, `$_` represents singular value of the parameter or current item of a collection.
Will throw an error if any parameter does not satisfies the condition.

```ps1
param (
    [ValidateScript({ ($_ % 2) -ne 0 })]
    [int[]]$Odd
    [ValidateScript({ $_.Length < 5 }, ErrorMessage = "{0} is not valid")] # 0 is the input value
    [string]$Name
)
```

- `ValidateLength(min, max)`
- `ValidateCount(min, max)`
- `AllowNull()`
- `AllowEmptyString()`
- `AllowEmptyCollection()`
- `ValidatePattern(regex)`
- `ValidateRange(min, max)`
    - or any value of enum `ValidateRangeKind`: `Positive`, `Negative`, `NonNegative`, `NonPositive`
    ```ps1
    param(
        [ValidateRange("Positive")]
        [int]$Number
    )
    ```
- `ValidateSet(foo, bar, ...)`: provides completion for predefined entries
- `ValidateNotNull()`
- `ValidateNotNullOr()`
- `ValidateNotNullOrEmpty()`: not a empty string or collection or null
- `ValidateNotNullOrWhiteSpace()`
- `ValidateDrive(drive, ...)`: check whether specified path is valid from certain PSDrive
    ```ps1
    param(
        [ValidateDrive("C", "D")]
        [string]$Path
    )
    ```

## Pass By Reference

Parameter passed by reference is implemented by a wrapper `System.Management.Automation.PSReference`.
Value types are passed by value by default, the pass as reference, mark the parameter with `[ref]`.
Casting to `[ref]` generates a new wrapper containing the value.

```ps1
function Foo {
    param ([ref][int]$foo) # [!code highlight] 
    $foo.Value = 250
    $foo.Value
}

$bar = 1
Foo ([ref]$bar)
$bar # 250 # [!code highlight] 
```

> [!NOTE]
> `[ref]` can only be marked before type annotation.

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

## Mimicking Cmdlet

A function would generally not acting a cmdlet unless it was annotated with `CmdletBinding()` attribute.

`CmdletBinding()` can have the following properties:

- `DefaultParameterSetName`: pwsh will prefer this name when there's a ambiguity between syntax provided.
- `HelpURI`: link to documenetation
- `SupportsPaging`: implicitly adds parameters `-First`, `-Skip`, `-IncludeTotalCount`, value accessible by `$PSCmdlet.PagingParameters`
    ```ps1
    function foo {
        [CmdletBinding(SupportsPaging)]
        param()
        $PSCmdlet.PagingParameters.Skip
        $PSCmdlet.PagingParameters.First
        $PSCmdlet.PagingParameters.IncludeTotalCount
    }
    ```
- `SupportsShouldProcess`: implicitly adds `-Confirm` and `-WhatIf`
- `ConfirmImpact`: specify impact of `-Confirm`
- `PositionalBinding`: 

<!-- TODO: complete description for ConfirmImpact and PositionalBinding -->

## Parameter Set

How a same cmdlet manage different syntax for different usages? The trick is **Parameter Set**.
Parameter Set is a classification on paramater to distinguish or limit the use of parameters from scenarios.

- a parameter set must have at least one unique parameter to others to identify the set
- a parameter can be member of multiple parameter sets.
- a parameter can have different roles in different Parameter Set, can be mandatory in one and optional in another
- a parameter without explicit Parameter Set belongs to all other Parameter Set
- at least one parameter in the Parameter Set is mandatory
- only one parameter in set can accept `ValueFromPipeline`

### Parameter Set Idetifier at Runtime

`$PSCmdlet.ParameterSetName` reflects the Parameter Set been chosen when a cmdlet is executing with certain syntax.

## Common Parameters

Any function or cmdlet applied with `CmdletBinding()` or `Parameter()` attribute has the following implicit parameters added by PowerShell:

- ErrorAction (ea): specify action on error
- ErrorVariable (ev): declare **inline** and store the error on the variable instead of `$Error`. Use `-ErrorVariable +var` to append error to the variable
    ```ps1
    gcm foo -ev bar # inline declaration for $bar
    $bar # contains error
    gcm baz -ev +bar
    $bar # contains two errors
    ```
    > [!NOTE]
    > The inline variable is an `ArrayList`
- InformationAction (infa): similar to `ea`
- InformationVariable (iv): similar to `ev`
- WarningAction (wa): similar to `ea`
- WarningVariable (wv): similar to `ev`
- ProgressAction (proga)
- OutVariable (ov): declare **inline** and store the output to the variable. Similar to `ev`.
    It's interesting that `-OutVariable` collects incremnentally.
    It collects new item from pipeline on each iteration.
    ```ps1
    1..5 | % { $_ } -OutVariable foo | % { "I am $foo" }
    # I am 1
    # I am 1,2
    # I am 1,2,3
    # I am 1,2,3,4
    # I am 1,2,3,4,5
    ```

- Debug (db): print verbose debug message, overrides `$DebugPreference`
- OutBuffer (ob)
- PipelineVariable (pv) <!-- TODO: PipelineVariable -->
- Verbose (vb): whether display the verbose message from `Write-Verbose`

### Mitigation Parameters

Mitigation parameters were added when `CmdletBinding(SupportsShouldProcess)` was applied.

- WhatIf (wi): shows explaination for the command without executing it.
- Confirm (cf): ask for confirmation when executing the command.

## Return

PowerShell allows implicit return, and multiple implicit returns.

> [!NOTE]
> Implicit returns are auto-collected as an array or single value.
> And it does not print out anything.

```ps1
function Sum {
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
function Sum {
    param([int]$l, [int]$r)
    return $l + $r # explicit return # [!code highlight] 
    $r + $l # not reachable  # [!code warning] 
}
```

### Output Type

`OutputTypeAttribute(type: System.Type | System.String, parameterSet?: System.String)` matters when you need auto generated help for the function you write.
A function can have different return types for different parameter sets.
PowerShell never do type checking by this attribute, it's just responsible for help generation, write with carefulness!

```ps1
[CmdletBinding(DefaultParameterSetName = 'ID')]
[OutputType('System.Int32', ParameterSetName = 'ID')]
[OutputType([string], ParameterSetName = 'Name')]
param (
    [Parameter(Mandatory, ParameterSetName = 'ID')]
    [int[]]$UserID,
    [Parameter(Mandatory, ParameterSetName = 'Name')]
    [string[]]$UserName
)
```
