# Understanding Pipeline

Overview of pipeline in powershell:

- A cmdlet can have multiple parameters that accept pipeline input.
- Only one parameter can bind to a given pipeline object at a time.
- PowerShell prioritizes by value over by property name.

## Pipeline Parameter Binding



## Pipeline Input Strategy

There's two solution when a pipeline input comes in as a fallback:

- ByValue: the default strategy. Accepts when the coming object can be cast or converted to the target type of the parameter.
- ByPropertyName: accepts when the coming object has property name matched to any parameter name of the cmdlet. 

### By Value



### By PropertyName

```ps1
spps -Name (gci -File | foreach Name)
# is equivalent to the following
# because FileInfo has Name which matches to -Name parameter of spps cmdlet
gci -File | spps
```

ByValue is always tried first, and then use ByPropertyName, or it finally throws.
A parameter accepts pipeline input does not necessarily have both solutions, it can have at least one of them.

## Pipeline Input as Enumerator

As we know, PowerShell can handle multiple objects from an enumerator from object that implements `IEnumerable` or `IEnumerable<T>`, or even duck typed with `GetEnumerator`.

While for types that are not linear collection, manually invoking `GetEnumerator` is required when being passed as pipeline input.

- `IDictionary<,>` and `IDictionary`
- HashTable has dynamic typing so we can't presume a uniformed calculation for our cmdlet
- `string` is `IEnumerable` but we surely don't expect the auto enumeration.

This is simply because these types are more likely to be treated as a whole object, even when dictionaries are `IEnumerable<KeyValuePair<,>>`.

```ps1
$table = @{ Name = 'foo'; Age = 18 }   
($table | measure).Count # 1
($table.GetEnumerator() | measure).Count # 2 # [!code highlight] 
```

## Enumerate Pipeline Items

You can use `$input` to refer to the enumerator passed to the function. This is one way to access pipeline input items but with more control.
Another option is use `$_` to represent the current item in `process` block, this is way more limited but commonly used.

> [!NOTE]
> `$_` and `$input` are isolated, they don't affects each other.

- `$input` represents a enumerator for pipeline input in `process` block.
- `$input` represents the whole collection for pipeline input in `end` block.
- `$input` will be consumed after being used once in either `process` or `end`. Use `Reset` to get it back.
- You can't use `$input` in both `process` and `end`.

### Access Current Item

> We're not going to talk about `$_`, it's fairly simple. All the quirks is about `$input`.

`$input.Current` is `$null` by default, you'll have to manually invoke `MoveNext` before you access `Current` in `process` block since it's not a `while` loop.


```ps1
function Test {
    begin {
        $input -is [System.Collections.IEnumerator] # True
    }

    process {
        # $input.Current before MoveNext in each iteration is always $null
        # How weird!
        $input.Current -eq $null # True because we haven't start the enumeration!
        $input.MoveNext() | Out-Null # [!code highlight] 
        $input.Current -eq $null # False
    }
}

1,2,3 | Test
```

> [!WARNING]
> Before you read the following content, please keep in mind that `$input` behaves slightly different from general `IEnumerator` for `Reset`.

`$input` itself is a wrapper of current item in `process` block, invoke `Reset` to get it back to current value.

```ps1
function Test {
    process {

    }
}

1,2,3 | Test
```

## Implicit Pipeline Input

Function can accepts pipeline input without any specific parameter.
Inside the `process` block, `$_` represents the current object from the pipeline input.

```ps1
function Test {
    process {
        $_ -is [System.IO.FileInfo] # True
    }
}

gci -file | Test
```

> [!NOTE]
> `$_` is only available in `process` block.

## Explicit Pipeline Input

If you write a custom function that have one or more parameters accept pipeline input, what is going on inside?

- In `begin` block, there's no value assigned to each `ByPropertyName` parameter, they remain default.
- In `process` block, each `ByPropertyName` parameter represents the current property value extracted from the current pipeline input object.

```ps1
function Foo {
    param (
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$Name
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$Length
    )

    begin {
        $Name -eq [string]::Empty # True
        $Length -eq 0 # True
    }

    process {
        $Name # Name of current pipeline item
        $Length # Length of current pipeline item
    }
}

gci -file | Foo
```

> [!TIP]
> `ByPropertyName` parameter can also be a array type, it all depends the implementation you want, it behaves the same.
