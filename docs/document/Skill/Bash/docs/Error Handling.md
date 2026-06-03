# Error Handling

## Error Action

1. `errexit`: **terminates** on any non-zero exit code `$?`

```sh
set -e # enable errexit

false # termination # [!code error]

echo foo # unreachable
```

2. `${var:?ERROR}`: throw `ERROR` when `var` is unset, **terminates** current execution.

```sh
set --
local foo="${1:?argument required}" # [!code error]
```

## Value Fallback

If a variable is unset, there exist a way to fallback to another value inline.

```sh
set --
local foo="${1:-default value}"
# like foo ??= 'default value' in other lang
echo "$foo" # default value
```
