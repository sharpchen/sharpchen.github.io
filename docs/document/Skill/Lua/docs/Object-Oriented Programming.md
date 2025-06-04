# Object-Oriented Programming

## Inheritance

`__index` made inheritance possible in lua because it can redirects the field accessing to another table, which could act as a prototype.

```lua
local Window = { width = 0 } -- Window is the prototype

function Window:new(obj)
  -- self would be the metatable of the new table
  -- so here we set the __index to self
  -- which would redirect field accessing from the new table to the prototype, self
  self.__index = self
  -- set the prototype as metatable
  -- so that we could access original implementation
  -- in conclusion, the self here is more like super in some other languages
  return setmetatable(obj or {}, self)
end

local window = Window:new { height = 100 } -- a new object

-- inheritance
-- FloatingWindow is now a child prototype inherited from Window
-- now you can have special implementation on this new class
local FloatingWindow = Window:new {
  floating = true,
  special_method = function() end,
  new = function(self, obj) end, -- you can override constructor too
}
-- because `new` was always targeted to the one implemented on Window
-- and the self now targets to FloatingWindow
local float = FloatingWindow:new()
```

> [!TIP]
> Annotation from `lua_ls` can offer generic type inference, this is highly recommended:
> ```lua
>---@generic T
>---@param self T
>---@param obj? T | table
>---@return T
>function Item:new(obj)
>  self.__index = self
>  return setmetatable(obj or {}, self)
>end
>```

> [!TIP]
> Regardless of the inheritance, if you want one object partially behave the same as the another(with `__index` pointing to itself) , simply set the another as metatable to the one.
> But you should definitely not set theme as mutual metatables, they would cycle forever.

## Runtime Type Assertion

Similarly you can check whether an instance is of type of a class by comparing its metatable with the class table.

```lua
local Window = { width = 0 }
function Window:new(obj)
  self.__index = self
  return setmetatable(obj or {}, self)
end
local window = Window:new { height = 100 }
local FloatingWindow = Window:new {}
local float = FloatingWindow:new()

-- type checking -- [!code highlight]
_ = getmetatable(float) == FloatingWindow -- true -- [!code highlight]
-- but this wouldn't work on the 'class' -- [!code highlight]
_ = getmetatable(FloatingWindow) == FloatingWindow -- false -- [!code highlight]
-- but you can tell whether a class 'directly' inherited from another -- [!code highlight]
_ = getmetatable(FloatingWindow) == Window -- true -- [!code highlight]
```

> [!NOTE]
> A recursive comparison along the metatable chain is surely viable. I should make some time to have a example here.

## Multiple Inheritance
