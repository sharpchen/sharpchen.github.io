# Declaration and Expression

## Declaring variables

`nix` has functional flavor that declares like math expressions, which declares variables before expressions.

So `let [<identifier> = <expr>]; in <expr>` 

```nix
let a = 1; b = 2; in a + b
```
