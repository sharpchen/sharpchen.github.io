# Function

## Parameter

There's no positional parameters, it's a table-like definition, can be specified with any order.
Parameters are wrapped inside a function block with `param(...)`

```ps1
function Foo {
    param (
        [string]$foo
    )
}
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
        [switch]$foo
        [bool]$bar
    )
}

# this is why we should use `switch` instead.
Foo -foo -bar $true # [!code highlight]
```

### Required Parameter

All parameters are optional by default. Use `[Parameter(Mandatory=$true)]` to mark it as required.

```ps1
param (
    [Parameter(Mandatory=$true)]
    [string]$RequiredName
)
```

## Lifetime

- Function should be define before it was called.
