# String

## Native String

Strings in bash can be native without any quote.

```sh
name=john_smith # it's a string without quotes
```

## Raw String

Use single quotes to represent a raw string.
All escapes are treated as literal.

```sh
script='
    cd $(ls ~/projects/* | fzf)
    echo hello
'
```

> [!NOTE]
> You can't interpolate in single quote string

## Interpolated String

Use double quotes to represent interpolated string.

```sh
first_name=john
last_name=smith
fullname="$first_name $last_name"
```

The best practice is using the complete `${}` to distinguish between.

```sh
number=123
echo "$number456" # foo123 not avaiable in the context
echo "${name}456" # use this instead!
```

## String Concatenation

Strings can be concatenated directly side by side except spaces.

```sh
first_name=john
last_name=smith
fullname=${first_name}${last_name}    # johnsmith # [!code highlight] 
fullname=${first_name}" "$last_name # john smith # [!code highlight] 
fullname=$first_name $last_name   # error: command not found # [!code error] 
```


### `+=` Operator

toggleterm disabled, use normal nvim to test it today.

```sh
foo=abc
foo+=def # abcdef
```

> [!WARNING]
> `+=` will do numeric operation when two operands are both valid numeric strings.

> [!NOTE]
> Always prefer interpolation over concatenation.
