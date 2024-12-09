# Scope

Variables and functions can have a explicit scope.

```ps1
$<scope>:foo = 1
function <scope>:Foo {}
```

## Scope Modifier

- `global`: accessible for the whole session. The root parent scope in a runspace.
- `local`: default. Accessible in current script or script block or function. Can be accessed by child scopes.
- `private`: accessible for current scope, meaning it can't be accessed by any other scope.
- `script`: only accessible in script module. The default scope in a 
- Scopes from PSProviders
    - `env`: environment variables
    - `alias`: alias
    - `function`
    - `variable`
