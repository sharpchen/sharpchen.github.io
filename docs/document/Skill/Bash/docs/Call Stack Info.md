# Call Stack Info

## Function Call Stack

`$FUNCNAME` is a builtin array variable stores every function name on the execution context.

- `${FUNCNAME[0]}`: current function name
- `${FUNCNAME[1]}`: name of the caller of current function
- `${FUNCNAME[2]}`: name of caller of caller
- ...

```sh
err() {
   # print error with caller name info to your message
   echo -e "${FUNCNAME[1]}: error happened"
}
```

## Script Call Stack

`$BASH_SOURCE` is a builtin array variable contains script paths most recently sourced.

> [!TIP]
> It's the best practice to prefer `${BASH_SOURCE[0]}` over `$0` as the latter is always
> the path of the very first script being sourced on invocation, instead of path of the _current_ script.

## Line Number

`$BASH_LINENO` is a builtin array variable contains most recent line numbers the caller function was invoked.
