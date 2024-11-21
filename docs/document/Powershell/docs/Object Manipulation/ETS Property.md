# ETS Property

Extended Type System in Powershell has 4 kinds of property:

- Alias Property: An simple alias for another property.
- Script Property: Getter/Setter for a custom property that can access other members, represented as a script block.
- Note Property: An extra independent property added to the object.

## Alias Property

- Inspect Alias Property by:

```ps1
gps | gm -MemberType AliasProperty
```

- Add Alias Property by:

```ps1

```
