# Coroutine

## Overview

Coroutine differs from the abstraction of thread from other languages, coroutine has more collaborative nature while thread are primitively parallel.
That is, coroutine in lua is neither concurrent nor parallel, lua is like single-threaded, handles only one thing at a time and can switch control between coroutines.
Thusly, one should never use words such as *thread* or *multi-threading* when introducing the use of lua coroutine.

> [!NOTE]
> Interestingly, coroutine in `lua` has type name `thread`, even though it is not a real thread.

- `coroutine.create(fn: function): thread`: coroutine factory
- `coroutine.status(co: thread): string`: status of a coroutine
    - `running`: yeah it's running
    - `normal`:
    - `suspended`: created but not started, or suspended on half way
    - `dead`: terminated due to error
- `coroutine.yield(...any): ...any`: return control back to caller, suspend the containing coroutine(should call it inside coroutine function body)
    - could pass arbitrary return values that could be captured by outer `coroutine.resume`
    - can capture arbitrary values as return values from outer `coroutine.resume` **after resume**.
    - of course `return` can also return values but terminates coroutine, no worry.
- `coroutine.resume(co: thread, args: ...any): boolean, ...any`: **a blocking operation** to start or resume a `suspended` coroutine
    - returns `boolean` indicating whether resume succeeded and `...any` returned from the resumed coroutine by `coroutine.yield`.
    - supports passing args to the wrapped function of the coroutine
- `coroutine.wrap(fn: function): function`: wrap resumption as a capsulated function for simplicity.

## Coordination

Coordination is viable by two basic functions, `coroutine.resume` and `coroutine.yield`.
`coroutine.resume` starts or re-enter the coroutine by optional arguments, such arguments can be arguments for the coroutine function body **on first start**, or as new arguments passed halfway that can be captured by `coroutine.yield` on resume.
Conversely, `coroutine.yield` can hang current coroutine and return values that can be captured by outer `coroutine.resume`.

## The Stack

> A coroutine is similar to a thread (in the sense of multithreading): a line of execution, with its own stack, its own local variables, and its own instruction pointer;
> but sharing global variables and mostly anything else with other coroutines.
> — Programming in Lua, Roberto Ierusalimschy

Each coroutine created in lua has its own stack to store the state of variables and so on. The stack would collected when thread is *dead* or no longer referenced by any variable.

## Iterate by Coroutine

Iterator and coroutine are spiritual cousins in lua, one can implement a iterator using coroutine.

- stores state
- yields value on *each call*

```lua
-- an infinite iterator
local co = coroutine.create(function()
  local num = 0
  while true do
    num = num + 1
    coroutine.yield(num)
  end
end)
-- each time you resume is like iterate to next item
local _, nxt = coroutine.resume(co)
_, nxt = coroutine.resume(co)
_, nxt = coroutine.resume(co)
_, nxt = coroutine.resume(co)
```

An implementation for `ipairs` using coroutine would be like this:

```lua
--- my ipairs at home using coroutine
--- @generic T
---@param arr T[]
---@return fun(): integer, T
local function iter_arr(arr)
  local idx = 1
  -- the coroutine itself is part of the state
  local co_iter = coroutine.create(function()
    while idx <= #arr do
      coroutine.yield(idx, arr[idx]) -- yield current
      idx = idx + 1
    end
  end)
  -- each call on the iterator should resume the coroutine
  return function()
    local _, i, val = coroutine.resume(co_iter)
    return i, val
  end
end

for idx, value in iter_arr { 1, 2, 3, 4, 5 } do
  print(idx, value)
end
```

## Wrap Coroutine as Function

Coroutine can be like a consumer which would probably be called for one or more times, it could be trivial  to write with plain `_, _ = coroutine.resume(co)` especially when the resumption has return value.

```lua
local co = coroutine.create(function()
  while true do
    coroutine.yield(math.random(1, 100))
  end
end)

local _, nxt = coroutine.resume(co)
 _, nxt = coroutine.resume(co)
 _, nxt = coroutine.resume(co)
```

With `coroutine.wrap()`, you can enclose it as a function, the function call does not return resumption status as `coroutine.resume` does.

```lua
local consume = coroutine.wrap(function()
  while true do
    coroutine.yield(math.random(1, 100))
  end
end)

local nxt = consume()
nxt = consume()
nxt = consume()
nxt = consume()
```

> [!IMPORTANT]
> The price of `coroutine.wrap` is, you can't track the status of the coroutine since it was wrapped inside.

> [!NOTE]
> The implementation of `coroutine.wrap` can be like this:
>```lua
>--- my coroutine.wrap at home
>---@param fn fun(...any): ...unknown
>---@return fun(...any): ...unknown
>local function wrap(fn)
>  local co = coroutine.create(fn)
>  return function(...)
>    local result = { coroutine.resume(co, ...) }
>    if result[1] then return select(2, unpack(result)) end
>  end
>end
>```
