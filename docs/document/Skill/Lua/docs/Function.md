# Function

## Default Return

Lua function returns `nil` as default.

```lua
print((function() end)() == nil) -- true
```

## Variadic Parameter

Variadic parameter in lua does not have name and default type, it's a special identifier  `...` that has to be expanded to a table using `{ ... }`

Such identifier can be used in:
- `{ ... }`: direct expansion to a table
- `{ a, ..., b }`: append extra items around inside a table
- `select('#', ...)` and `select(idx, ...)` to get length or pick one item from args without intermediate expansion

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

- `unpack(list: table, start?: integer, end?: integer)`: splatter items in successive indices from a table
- `select(start: integer, ...any): ...unknown`: slice a splat from start into another splat
    - `select(symbol: '#', ...any): ...unknown`: retrieve a length of the splat
- `{ <expr> }`: collect splats from `<expr>`, a function call for example.
    ```lua
    local function foo(...) return unpack { ... } end
    _ = { foo(1, 2, 3) } -- [1, 2, 3]
    ```

## Iterator Function

Iterator in lua can be implemented by closure, which scopes local fields in its containing factory function, and operates iteration within the created iterator function.

- store state in outer scope
- return nil to cease the iteration
- consume by `for .. in` statement(the first return being `nil` would stop the loop)

```lua
--- my ipairs impl at home
---@generic T
---@param array T[]
---@return fun(): integer, T
local function iter_array(array)
  -- store state in outer scope
  local idx = 0 -- [!code highlight]
  local current = nil -- [!code highlight]

  return function()
    idx = idx + 1
    if idx <= #array then
      current = rawget(array, idx)
      return idx, current
    end

    return nil, nil -- return nil to cease the iteration -- [!code highlight]
  end
end

for idx, item in iter_array { 1, 2, 3 } do
  print(idx, item)
end
```
