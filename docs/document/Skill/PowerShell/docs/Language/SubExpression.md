# Expression

## Expression Grouping

`()` is grouping expression that allows **assignment**/add higher execution **precedence** within it and **pass through the value to outer context.**
It's worth noting that `()` does not allow to eval a control flow statement which is very counter-intuitive.

```ps1
# enforce precedence
(1 + 2) * 3 # 9
# inline assignment
($foo = 1) # 1
# eval a statement
($null = if ($true) { "foo" }) # foo

(if ($true) { "foo" }) # parsing error! # [!code error]
```

> [!IMPORTANT]
> `()` only allows one single expression within it.

## Sub-Expression

`$()` is yet another way to eval a expression to value but suppress the output of assignment statement.

```ps1
$(if ($true) { "foo" }) # foo

# assignment does not pass through value to outer context
$($foo = 1 -gt 3) # $null

# self increment is another special kind of assignment
$($i++) # $null
```

Since `$()` has a nature of suppressing value from assignment statement, we can use it as a single calculation block.

```ps1
$foo = 1
# custom calculation block
$(
    $foo = 1 + 2
    # self operation is also suppressed even though it should output
    $foo++

    $foo
    $foo # yield more than once
).Length # 2
```

### Array Sub-Expression

`@()` is almost the same as `$()` but ensures the output as an array, no matter how few items were popped from the expression.

```ps1
@($pwd).GetType().Name # Object[]
$($pwd).GetType().Name # PathInfo
```
