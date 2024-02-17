# Create your own Neovim colorscheme

> [!NOTE]
> This article is inspired by [Writing a Neovim Theme in Lua](https://machineroom.purplekraken.com/posts/neovim-theme-lua/)

## What makes a theme

- Entry point of the theme

```lua
-- colors/colorscheme_name.lua
package.loaded["colorscheme_name"] = nil
require("colorscheme_name").colorscheme()
```

- A module exports `colorscheme()` function.

```lua
-- lua/colorscheme_name.lua
local M = {}

function M.colorscheme()
    -- code here
end

return M
```
