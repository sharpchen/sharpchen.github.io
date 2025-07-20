# Understanding Scoping & Context

Each powershell process can have multiple runspaces, each runspace has its own session state and scopes, session states and scopes can't be accessed across runspaces.

## Scope

- Scope nesting: each scope can have parent and child scopes, function and scriptblock creates its own scope in the hierarchy.
    ```ps1
    function bar { echo $foo }
    function foo {
        $foo = 'foo' # defaults to $local: scope
        & bar # bar can read the context of foo because it's the child scope of foo's
    }
    ```
- Named scopes:
    - `$global:`: top level parent scope.
    - `$local:`: current scope, barely useful.
    - `$script:`: scope of the nearest script invoked, falls back to `$global:` if no script was found.
        - the default scope of a script file is `$script:`
        - `$script:` is the most magical scope
        - sourcing a script can treat scoped members within it as declared locally.
            - there's no way to prevent sourcing members from script as locals, even with `$private:`.
    - `$private:`: an accessor keyword to mark only accessible to current scope.
        - it looks like a scope name, but just an option to current scope.
        - use `New-Alias -Option Private` to create one private alias, variable and function can use direct `$private:` accessor.
        ```ps1
        function foo {
            $foo = 'foo'
            $private:bar = 'bar' # [!code highlight]
            & bar
        }
        function bar {
            Write-Output "bar is null? $($null -eq $bar)" # [!code highlight]
            Write-Output $foo
        }
        & foo # bar is null? True foo
        ```
    - `$using:`: represents a **copy** of that variable value, expanding it to remote command or background job which runs on a different process.
        - you can't re-assign or alter the original value within the process because it's a copy.
        - powershell transfer the value by xml-based serialization from process to process or remote to local mutually.
        ```ps1
        $foo = 1
        $wrapped = Get-Variable foo
        # thread job can alter the value by [psvariable] instance
        # this is not possible for background job or remote command!
        Start-ThreadJob { ($using:wrapped).Value += 1 } | Receive-Job -Wait   # [!code highlight]
        $foo # 2
        ```
    - driver scopes: containers created from **PSDrive**, may also be accessed by path syntax.
        - `$env:` environment variables for **current scope**
        - `$function:`: functions declared for **current scope**
        - `$alias:`: alias declared for **current scope**
        - `$variable:`: variables declared for **current scope**

## Module Scope

Module has their own scope even after being imported to a runspace. That is, for example, the parent scope of a function/scriptblock imported from module is the module scope.

```ps1
# inside module Foo
$foo = 'foo from module'
function foo {
    $foo # points to $foo from module scope
}
# variable $foo is not exported
Export-ModuleMember -Function foo

# during a pwsh session
Import-Module Foo
$foo = 'foo from global'
& foo # foo from module # [!code highlight]
```

## ScriptBlock Context Injection

Extra members can be injected into the context of a scriptblock using `ScriptBlock.InvokeWithContext` method.
So you can reference the functions or variable within the scriptblock.

- Parameters
    - `functions: IDictionary[string, scriptblock]`: functions to inject
    - `variables: List[psvariable]`: variables to inject
    - `params args: object[]`: arguments for the scriptblock

```ps1
{ foofunc $foo; }.InvokeWithContext(@{ foofunc = { echo $args[0] } }, [psvariable]::new('foo', 123))
# 123
```

> [!NOTE]
> See [ScriptBlock.InvokeWithContext Method](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.scriptblock.invokewithcontext?view=powershellsdk-1.1.0)

### Delay-bind Parameter

Context injection is useful when implementing a cmdlet with delay-bind parameters such as `Foreach-Object -Process` and `Where-Object -Filter`, where you can access `$_` within the given scriptblock.
But the given scriptblock doesn't share the same scope of `process` block of a pipeline cmdlet **when the cmdlet came from a module**, because the scriptblock was created from global scope while the `process` block was inside the module scope.
The solution is obvious that to use `ScriptBlock.InvokeWithContext` to inject `$_` into the context of the given scriptblock.

```ps1
function all {
    param (
        [Parameter(ValueFromPipeline)]
        [psobject]$InputObject,
        [Parameter(Position = 1, Mandatory)]
        [scriptblock]$Condition
    )

    process {
        if (-not $Condition.InvokeWithContext($null, [psvariable]::new('_', $_))) { # [!code highlight]
            $false
            break
        }
    }

    end { $true }
}
```

> [!IMPORTANT]
> It's worth noting that `Where-Object` and `Foreach-Object` executes the given scriptblock in a global context, meaning that you can alter the members from global scope.
> But it's not available for cmdlet using `ScriptBlock.InvokeWithContext`, the context is always local to the scriptblock itself, should use `$script:` scope to access members instead.
>```ps1
>$foo = 1
>1..5 | foreach { $foo++ }
>$foo # 6
>
>$foo = 1
>1..5 | any { $foo++ }
>$foo # 1
>
>$script:foo = 1
>1..5 | any { $script:foo++ }
>$foo # 6
>```
