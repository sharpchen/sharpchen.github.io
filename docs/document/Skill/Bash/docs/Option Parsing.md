# Option Parsing

## TLDR;

Methods to parse options:

1. Manual parsing on argument list
   - good for standard options but hard to handle special option formats
2. `getopts` shell builtin
   - handles only short options(e.g. `-f`)
   - handles short options combination(e.g. `-rf`)
   - handles remaining arguments
3. GNU `getopt` executable
   - handles both short options(e.g. `-f`) and long options(e.g. `--force` etc)
   - handles short options combination(e.g. `-rf`)
   - handles connected options like `--filename=<filename>`
   - handles arguments after `--`

## Prior Knowledge

- `set -- <values>`: manually **reset** entire argument list

```sh
foo() {
    set -- foo bar baz

    echo "$@" # foo bar baz

    # note that $4 is also flushed
    # even though we didn't specify
    # the fourth new argument
}

foo a b c d
```

- `shift`: shift out values of parameter list

```sh
set -- foo bar baz
shift;
# $1 now has value of previous $2
# and $2 has value of previous $3 and so on
# the value of previous $1 is discarded
echo $1 # bar
echo $2 # baz
[[ -n "$3" ]] || echo "none" # none
```

> [!NOTE]
> `shift` also updates the value of `$#` dynamically.

## Manual Parsing

Given the capability of `shift` and `$#`, we can enumerate `$#` by using `$1` as the cursor variable.
Each time it shifts, `$1` become the value of current argument.

```sh
set -- -f -o foo.txt
local force output
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            echo "this is help info..."
            shift
            ;;
        -f|--force)
            force='y' # set indicator
            shift
            ;;
        -o|--output)
            output="$2"
            shift 2
            ;;
        -*)
            echo "ERROR: unkown option $1!"
            return 1
            ;;
        *)
            echo "remaining argument received."
            shift
            ;;
    esac
done

[[ $force == 'y' ]] && echo "--force is bound"
[[ -n "$output" ]] && echo "output path is $output"
```

> [!CAUTION]
> Always remember to `shift` on each valid option case unless by design, otherwise it would cause infinite loop.

The problem of manual parsing is, it's very trivial to parse combined options like `-rf` which is equivalence of `-r -f`.
It's also difficult for other styles of argument binding in unix conventions, such as `--filename=<filename>` and `-o<output>`.
It would be trivial when you have to make sure certain options have a mandatory argument.

## `getopts`

`getopts` is a bash shell builtin to handle short options only.
It has a dedicated syntax for representing whether a short option is a switch/flag or a option requiring argument.
To let `getopts` handle the parsing it requires to know the everything about the possible options:

- is the option a flag/switch only?
- is the option requiring arguments?

Since short options are always in **single letter**, they can be represented as one single string **without any separator**,
plus `:` as modifier after the options requiring arguments.
For example `a:bc` would mean `-a <arg>` requires argument, `-b` and `-c` are pure flag.

In the following example, `getopts` would generate a `$opt` variable in scope which is the current flag character.
If current flag has an argument, `$OPTARG` would be available in current context which is the exact value of its following argument.

There's also a `$OPTIND` index variable with **index of next argument**.
As per bash manual:

> When the end of options is encountered, getopts exits with a return value greater than zero. OPTIND is set to the index of the first non-option argument, and name is set to ‘?’.

Once options are all checked, we shall shift them all so that we can **get remaining arguments in place**(if there's any).

```sh
set -- -f foo -b bar baz

while getopts "f:b" opt; do
    case "$opt" in
        f) echo "-f $OPTARG is bound" ;;
        b) echo "-b is enabled" ;;
        *) echo "Invalid flag" ;;
    esac
done

echo $OPTIND # 4, meaning next argument is bar
shift $((OPTIND - 1)) # shift out everything already handled, leaves remaining arguments
echo "$@" # bar baz, which is remaining
```

> [!NOTE]
> You might notice `getopts` doesn't receive any argument list, because it's a shell builtin, it knows everything about current execution context.

> [!IMPORTANT]
> As per bash manual:
>
> > The shell does not reset OPTIND automatically; it must be manually reset between multiple calls to getopts within the same shell invocation if a new set of parameters is to be used.

## `getopt`

`getopt` is the ultimate way to do option parsing that inherits certain flavor of `getopts`.
It should be a common builtin command line tool in most Linux distro.

For short options, `getopt` inherits the syntax of `getopts`.
For long options, `getopt` requires `,` as separator for each long option since they're not longer in single character.

`f:bo:` would mean `-f` and `-o` are requiring arguments, and `-b` is a switch.
`baz:,file:,verbose` would mean `--baz` and `--file` require arguments and `--verbose` is a switch.

`getopt` will return a in a **normalized format**, that is:

- Each argument(if exists) are following its option name, separated by single space.
- Each argument is quoted by `'` by default(meaning arguments with spaces are safely quoted).
- The normalized string ends with `--`.

```sh
set -- -f foo -b --baz baz -oOuput.txt --file=input.txt --verbose

NORMALIZED=$(getopt --options 'f:bo:' --longoptions 'baz:,file:,verbose' -- "$@")

echo "$NORMALIZED"
# -f 'foo' -b 'baz' -o 'Output.txt' --file 'input.txt' --verbose --
```

Now we have a proper list of options to be enumerated just like _manual parsing_, we just need to replace argument list using `set --`.

```sh
eval set -- "$NORMALIZED"

local input output verbose

while true; do
    case "$1" in
    --file)
        input="$2"
        shift 2
        ;;
    -o)
        output="$2"
        shift 2
        ;;
    --verbose)
        verbose='y'
        shift
        ;;
    --)
        shift # skip --
        break # now it's all remaining arguments
        ;;
    *)
        echo "Unexpected option \`$1\`"
        return 1
        ;;
    esac
done
```

> [!IMPORTANT]
> Using `eval` is required because it avoids bash to interpret the arguments into single string.
>
> ```sh
> eval set -- "$NORMALIZED"
> echo "$#" # 11
>
> set -- "$NORMALIZED" # [!code error]
> echo "$#" # 1 # [!code error]
> ```

### On Unrecognized Options

`getopt` always succeed on normalizing the options, if any option is unexpected(unspecified on given syntax), it would silently skip it.

```sh
set -- -a -b -c

NORMALIZED=$(getopt --options 'f:bo:' --longoptions 'baz:,file:,verbose' -- "$@")

# -a and -c skipped
echo "$NORMALIZED" # -b --
```

If an option requires argument has no argument bound, it will be also skipped.

```sh
set -- -f

NORMALIZED=$(getopt --options 'f:bo:' --longoptions 'baz:,file:,verbose' -- "$@")

echo "$NORMALIZED" # --
```

If an option requires argument has no proper argument bound, but has another option followed, the another option would be bound to the previous option.
So this is real problem that needs to be handled trivially.

```sh
set -- -f -b

NORMALIZED=$(getopt --options 'f:bo:' --longoptions 'baz:,file:,verbose' -- "$@")

echo "$NORMALIZED" # -f '-b' --
```
