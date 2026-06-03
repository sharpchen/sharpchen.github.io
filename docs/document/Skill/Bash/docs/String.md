# String

## Native String

Any unresolved token would be interpreted as string as a final fallback.

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
echo "$number456" # number123 not available in the context
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

## Here-Doc String

Here-Doc is a convenient way to pass string from **stdin** to target cli.
It also preserve indentation just like multi-line raw string.
This feature is not specific to string itself but a syntax sugar for passing value without creating subshell.

A Here-Doc uses **arbitrary delimiter** to scope the string instead of quotes, the common one is `EOF`.

### Interpolated Here-Doc

By default, a Here-Doc string can perform interpolation.

```sh
python3 << PY
import os
print("${USER}") # USER is interpolated
PY
```

### Literal Here-Doc

Quoting first delimiter makes the Here-Doc string literally interpreted.

```sh
python3 << 'PY'
import os
print(os.environ.get("USER"))
PY
```
