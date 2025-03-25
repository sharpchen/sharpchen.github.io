# String

## Pattern Matching

### Range of Occurrence

- parameters
    - `pattern: string | number`: pattern to find, may include capture groups
    - `init?: int`: the index to start searching
    - `plain?: boolean`: whether to match in literal

- returns
    - `start`: start index of the first match on **the whole pattern**
    - `tail`: start index of the first match on **the whole pattern**(do not use `end` as variable name, it's reserved keyword)
    - `...matches`: arbitrary number of captured groups that can be unpacked to variables

```lua
local text = '<tag>content</tag>'

-- find range of first occurrence
-- and its captured groups, kind of useless though
local start, tail, tag, content = text:find('<(%w+)>(%w+)</%w+>')
```

### Replace

 `string.gsub`: replace all occurrences

- parameters
    - `pattern: string | number`: pattern to replace
    - `repl: string | number | function | table`
        - `string`: may use `%n` to reference capture groups by index `n` to transform from groups
        - `fun(match: string): string`: to replace the occurrence by tranformed string from the match
        - `table`: a finite pairs for match(key) and replacement(value)
    - `n?: int`: max count of substitutions could be made

- returns
    - `text`: substituted string
    - `count`: substitution count made

```lua
local text = 'snake_case_is_awful'

local sub, count = text:gsub('_', '-') -- snake-case-is-awful, 3

-- transform by captured groups
local sub, count = text:gsub('(%l+)_(%l+)', '%1-%2', 1) -- snake-case_is_awful, 1

-- capitalize word for 2 occurrences
local sub, count = text:gsub('%l+', function(match)
  ---@cast match string
  local cap = match:sub(1, 1):upper()
  return cap .. match:sub(2)
end, 2) -- Snake_Case_is_awful, 2

local sub, count = text:gsub('%l+', {
  snake = 'python',
  _case = '',
}) -- python_case_is_awful, 4
-- because the table were tried anyway and got nil when key is not registered
```
