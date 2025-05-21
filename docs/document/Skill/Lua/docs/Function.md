# Function

## Default Return

Lua function returns `nil` as default.

```lua
print((function() end)() == nil) -- true
```

## Variadic Parameter

Variadic parameter in lua does not have name and default type, it's a special identifier  `...` that has to be expanded to a table using `{ ... }`

Such identifier can be used in:
- `{ ... }`: direct expansion
- `{ a, ..., b }`: append extra items around
- `select('#', ...)` and `select(idx, ...)` to get length or pick one item of the args without intermediate expansion

```lua
local function foo(...)
  local args = { ... }
  print(table.concat(args, ', '))
end

foo('hello', 'world') -- hello, world
```

```lua
Iterate over variadic without expansion
local function foo(...)
  for idx = 1, select('#', ...) do
    _ = select(idx, ...)
  end
end
```

## Multi-Returns

```lua
local function foo()
  return 1, 2, 3
end

local a, b, c = foo()
```

## Meta Functions

Mate Functions are global functions registered by lua runtime but commonly used

- `_G.select`: an operator can perform item picking from **arbitrary number of arguments** including `...` or get length of args
    ```lua
    -- get length of args
    _ = select('#', 1, 2, 3) -- 3
    -- pick second item
    _ = select(2, 1, 2, 3) -- 2
    ```
- `_G.unpack`: equivalent to `table.unpack`
