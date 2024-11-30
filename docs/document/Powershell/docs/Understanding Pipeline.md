#

Overview of pipeline in powershell:

- A cmdlet can have multiple parameters that accept pipeline input.
- Only one parameter can bind to a given pipeline object at a time.
- PowerShell prioritizes by value over by property name.

## Pipeline Parameter Binding


## How Cmdlet Accept Pipeline Input

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


> [!WARNING]
> If multiple matches exist on ByPropertyName solution, powershell throws an error since these paramters might not be allowed to be used together.

ByValue is always tried first, and then use ByPropertyName, or it finally throws.
A parameter accepts pipeline input does not necessarily have both solutions, it can have at least one of them.

## How PowerShell Enumerate Pipeline Input

As we know, PowerShell can handle multiple objects from an enumerator from object that implements `IEnumerable` or `IEnumerable<T>`, or even duck typed with `GetEnumerator`.

While for types that are not linear collection, manually invoking `GetEnumerator` is required when being passed as pipeline input.

- `IDictionary<,>` and `IDictionary`
- HashTable has dynamic typing so we can't presume a uniformed calculation for our cmdlet
- `string` is `IEnumerable` but we surely don't expect the auto enumeration.

```ps1
$table = @{ Name = 'foo'; Age = 18 }   
($table | measure).Count # 1
($table.GetEnumerator() | measure).Count # 2 # [!code highlight] 
```

This is simply because these types are more likely to be treated as a whole object, even when dictionaries are `IEnumerable<KeyValuePair<,>>`.

