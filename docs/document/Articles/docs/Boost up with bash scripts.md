# Boost up with bash scripts

## Specify shell for your script

Your shell script can be executed by different shells, to explicitly specify the shell executable, leave a comment with format `!{absolute_shell_path}`.

```bash
#!/bin/bash
```

## Variable

### Declare a variable

In shell scripts, we declare a variable without any keyword.
And the value a variable can have no punctuation for strings, they are strings by default.
If contains spaces, use double quote to delimitate it, or the `John` in this context will be recognized as a command.

```bash
FIRST_NAME=John
LAST_NAME=Smith
FULL_NAME="John Smith"
```

### Referencing a variable

Since strings have no punctuations, we use double quote to prevent globbing and word splitting when referencing it.
`echo` accepts variadic parameters so they are concatenated naturally.

```bash
echo My full name is: $FIRST_NAME $LAST_NAME
echo Hello "$FULL_NAME"
```

:::info
The best practice for referencing a string variable is always punctuate with double quote.
:::

### Assigning variable inline

Unlike some programming languages, shell script invokes a function or executable at the begin of a command and may assign the value to variable after the invoked.

```bash
echo "What's your first name?"
read -r FIRST_NAME
echo "What's your last name?"
read -r LAST_NAME

echo Hello "$FIRST_NAME $LAST_NAME"
```

:::info
`-r` option stands for raw string.
:::

### Positional arguments

We can specify positional arguments for values we'd like to pass when invoking our shell script.

```bash
# in test.sh
echo Hello "$1" "$2"
```

:::info
It's also a good practice to brace place holder symbol with double quote.
:::

Call this script with values.

```bash
./test.sh John Smith

# Hello John Smith
```

## Control flows

### Test operator

Test operator (or test expression) is the core role of control flow statements.
There are three ways to write a test operator:

:::tip

- Use `$` to retrieve value  returned by statement or command.
- `[ ... ]` and `[[ ... ]]` should have one space for both side of `[` and `]`.

:::

:::code-group

```bash{test keyword}
condition=$(test "$1" -gt "$2")
```

```bash{using [ ... ]}
condition=$([ "$1" -gt "$2" ])
```

```bash{using [[ ... ]]}
condition=$([[ $1 > $2 ]])
```

:::

However, using `[[ ... ]]` id much preferred because it offers more natural syntax for use.

1. **Pattern Matching:**
   - Supports advanced pattern matching with the `==` operator.

2. **Extended Logical Operators:**
   - Allows the use of logical operators (`&&` and `||`) for combining multiple conditions.

3. **Regular Expressions:**
   - Supports the `=~` operator for regular expression matching.

4. **Extended String Comparison:**
   - Provides additional string comparison operators (`<`, `>`, `<=`, etc.).

5. **Logical Negation:**
   - Supports the `!` operator for logical negation.

6. **Variable Expansion:**
   - Variables don't need to be quoted in most cases for improved readability.

7. **Improved Quoting:**
   - Less sensitive to quoting issues, making it more forgiving.

Using `[[ ... ]]` is recommended when advanced conditional expressions are needed in Bash scripting.

### `if`, `then`, `elif`, `else` and `fi`

```bash
if  [[ $1 > 70  ]]; then
   echo "You might be too old to drive..."
elif [[ $1 < 16  ]]; then
   echo "You are too young to drive!"
else
   echo "Let's go get your license."
fi
```

:::info

- Every condition expression should be terminated by semicolon `;`.
- `fi` is the reverse of `if`. 😅

:::

### `case` `in`

`case-in` statement is rather advanced `switch` like control flow statement, it offers some pattern matching feature, way better than the old stupid `switch` in c lang.

:::code-group

```bash{bash}
case $1 in
    "apple" | "banana")
        echo "This is fruit."
        ;;
    "car")
        echo "This is a vehicle."
        ;;
    *)
        echo "I don't know what it is."
        ;;
esac
```

```cs{cs}
switch (item)
{
    case "apple" or "banana":
        Console.WriteLine("This is fruit.");
        break;
    case "car":
        Console.WriteLine("This is a vehicle.");
        break;
    default:
        Console.WriteLine("I don't know what it is.");
        break;
}
```

:::

:::info

`esac` is the reverse of `case`.😅

:::

### Array

#### Init an array

```bash
arr=(1 2 3 4 5)
```

#### Access array element

```bash
first=${arr[0]}
```

:::warning
Access array element using `${arr[idx]}` instead of `$(arr[idx])`.
:::

### `for` `in`

```bash
arr=(1 2 3 4 5)

for item in "${arr[@]}"; do
    echo "$item"
done
```

:::info
`"${arr[@]}"` references an whole iterable array instead of first element.
:::

### `while`, `do` and `done`

```bash
while [[  ]]
```

## Function

```bash
user="Jane"
get_user() {
   local user="$1" # scoped, Jane will not be overridden.
   local age="$2"
   echo "Current user is $user, $age years old.";
}
get_user "John" "18" # invoke the function only after the definition.
```

:::info

1. Use `local` keyword to declare a function scope only variable.
2. Set positional parameters by order instead of a parameter list.
   - Positional parameter are `local` by default.
3. Function only available after definition.
:::
