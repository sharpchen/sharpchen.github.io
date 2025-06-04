# Metatable

Metatable are special field could be injected into a table, which could include custom operators and any arbitrary field for special use(implementing OOP for example)

## Metatable Method

A table literal does not contain metatable on creation.

- `getmetatable(t: table): table`: retrieve metatable of a table
- `setmetatable(t: table, metatable: table): table`: set the metatable to `t` and returns the altered table reference

## Indexing

- `__index`
    - `table`: redirects indexing to another `table` **when key is absent from the table**.
    - `fun(this: table, key: any): any`: a custom getter to be called **when `rawget(this, idx)` cannot find one value for the key**.

- `__newindex`
    - `fun(this: table, key: any, value: any)`: custom setter to set the value to key **only when the key is absent from the table**.

### Indexing Proxy

Either `__index` or `__newindex` could only be triggered when key is absent in the table, so if you do need to monitor all access to the table, such as **monitor value updates**, an empty table is required to be the proxy.
The proxy must be empty during the whole lifetime, so that each access to it would trigger `__index` and `__newindex`, and the real table represents the data would be wrapped as a closed variable inside `__newindex` and `__index`.

> [!IMPORTANT]
> However, the price of proxy table is, you can't iterate it by `ipairs` or `pairs`, they don't redirect to `__index`.

```lua
local real = {
  name = 'foo',
}

local proxy = setmetatable({}, {
  __index = function(_, key) return real[key] end,
  __newindex = function(_, key, value)
    if real[key] ~= nil then
      print('updating the value')
      real[key] = value
    else
      print('setting this value for the first time')
      real[key] = value
    end
  end,
})

proxy.name = 'bar' -- updating the value
```

