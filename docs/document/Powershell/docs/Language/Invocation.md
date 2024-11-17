# Invocation

> [!CAUTION]
> Always be careful to run an external script or input script content.

## Call Operator

Call operator `&` can be used for invoking one of the following:

- Command without any option.
- A `.ps1` script file
- Script block

**`&` is awared of the context of current session, it does not start a new process.**

It's more like a system execution 

```ps1
& 'gps'
& 'gps pwsh' # extra option not allowed # [!code error] 
& 'gps' pwsh # pass option after command name instead # [!code ++] 
& 'gps' -Name pwsh # pass option after command name instead # [!code ++] 

& 'path/to/script.ps1' # may add some option...  # [!code highlight] 

& { param($a, $b) $a, $b } 1, 2
```

## Invoke-Expression

`Invoke-Expression` used for executing any script content represented as a string.

```ps1
Invoke-Expression 'gps pwsh'
'gps pwsh' | iex
```
