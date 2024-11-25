#

Overview of pipeline in powershell:

- A cmdlet can have multiple parameters that accept pipeline input.
- Only one parameter can bind to a given pipeline object at a time.
- PowerShell prioritizes by value over by property name.

## Pipeline Parameter Binding


## How Cmdlet Accept a Pipeline Input

There's two solution when a pipeline input comes in as a fallback:

- ByValue: accepts when the coming object can be cast to the target type of the parameter.
- ByPropertyName: accepts when the coming object has property name matched to any parameter name of the cmdlet. 


```ps1
spps -Name (gci -File | foreach Name)
# is equivalent to
# because FileInfo has Name which matches to -Name parameter of spps cmdlet
gci -File | spps
```

> [!WARNING]
> If multiple matches exist on ByPropertyName solution, powershell throws an error since these paramters might not be allowed to be used together.

By value is always tried first, and then use ByPropertyName, or it finally throws.
A parameter accepts pipeline input does not necessarily have both solutions, it can have at least one of them.
