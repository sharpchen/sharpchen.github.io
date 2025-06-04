# Control Flow

## Ternary Operator

**`and .. or` statement can be a replacement of ternary operator, but the trap here is, the expression after `and` must not ever return a falsy value.**
That is because the statment is not terminated when `cond` was met, it falls to expression after `or`.

```lua
-- first eval cannot be nil
local fn  = function()
    if cond then
        return true
    end
    return nil
end

_ = cond and fn() or canbe_nil -- canbe_nil might be picked when fn() returns falsy value which is unexpected
```

## Safe Call

- `pcall(fn: function, args: ...any): boolean, ...any`

```lua
if pcall(function() error('foo') end) then
  print('not reachable here')
end
```

## Local Scope

Use `do .. end` to create a isolated scope for certain operations.

```lua
do
  local foo = 'foo'
end

print(foo) -- Undefined global foo -- [!code warning]
```
