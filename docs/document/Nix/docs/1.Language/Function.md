# Function

```nix
n: n % 2 != 0 # tells whether a number is odd
```

## Function call

Function call by parameters after function or function variable

```nix
let is_odd = n: n % 2 != 0; in {
   is_odd 3 # false 
}
```

## Curried Function

Multiple parameters for `nix` function? Sadly no such thing exists in `nix`.
But one workaround is currying. Currying simply stores state into next function returned from previous, to perform the chaining.
It's recursive-like, but with absolute recursion count(which is the parameter count needed).

```nix
let add = x: y: x + y; in add 2 3 # returns 5
```

## Named Parameters

Another workaround for multiple paramters for function is using *set parttern*.

```nix
let format_person = { name, age }: { name = name; age = age }; 
in 
  format_person { name = "jane"; age =  18 }
```

## Optional Parameter

```nix
let
  format_person =
    {
      name ? "john smith",
      age ? null,
    }:
    "${name} aged ${age}";
in
format_person { name = "jane"; }
```

> [!NOTE]
> Set parttern is similar to named paramters, they're all named, can be sepecified by any order.

## Parameter List

`args` binds to the whole set excluding the optional attribute.

```nix
let
  format_person =
    {
      name,
      age,
      height ? 0,
      ...
    }@args:
    "${builtins.toJSON args}";
in
format_person {
  name = "john smith";
  age = 18;
} # `height` is not included in json
```

> [!NOTE]
> If no other paramters are expected, do omit `...` to prevent messing things up.

There's no signiture checking for argument count, so adding attributes that are not defined in function definition is ok.

```nix
let
  format_person =
    {
      name,
      age,
      height ? 0,
      ...
    }@args:
    "${builtins.toJSON args}";
in
format_person {
  name = "john smith";
  weight = 60; # [!code highlight] 
} # weight does not appear in parameter list but it's valid
```

