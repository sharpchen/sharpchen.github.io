# Vim feedkeys

## Flags

- `x`: direct execution, does not push into typeahead.

## Direct Simulation

Flag `x` does not push any key-press to typeahead, it executes the simulation directly, so it will never enter operator-pending mode.
Such behavior is similar to `:norm!`

```vim
call feedkeys('d') " enter operator pending for d
call feedkeys('d', 'x') " does nothing
```
