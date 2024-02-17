#

## Install plugin manager - `lazy.nvim`

```bash
nano ~/.config/nvim/lua/sharpchen/lazy.lua
```

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({})
```

```lua
-- ~/.config/nvim/init.lua

require("sharpchen")
require("sharpchen.lazy") // [!code ++]
```

## Organize plugins

For plugins need options, store them in none-index file separately.

```lua
-- ~/.config/nvim/lua/sharpchen/plugins/colorscheme.lua
return {
    -- ... all colorscheme
}
```

For plugins without options, store them in `./init.lua`

```lua
-- ~/.config/nvim/lua/sharpchen/plugins/init.lua
return {
    -- ...
}
```

To import plugins

```bash
nano ~/.config/nvim/lua/sharpchen/lazy.lua
```

```lua
-- ~/.config/nvim/lua/sharpchen/lazy.lua

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup("sharpchen.plugins") // ![code ++]
```
