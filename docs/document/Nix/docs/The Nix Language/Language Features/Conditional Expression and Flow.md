# Conditional Expression adn Flow

## Conditional flow


```nix

```

## Ternary operation

```nix
if cond then true_case else false_case
```

## Null-Coalescing operator

Use `or` to perform value fallback if target value is null.

```nix
let name = { name = "jane"; age = 18 }.name or "john smith"; in {}
```
