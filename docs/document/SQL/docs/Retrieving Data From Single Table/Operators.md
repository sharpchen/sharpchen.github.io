# Operators

## `IN` Operator

Use `IN` operator to match a tuple.
This expression will return true when any member in the following tuple equals `[field]`
Members in tuple can be any type.

```SQL
SELECT * FROM [table]
WHERE [field] IN (item1, item2, item3)
```

## `BETWEEN` Operator

Use `BETWEEN` operator to match range of field with `AND`.
Range can be number or date.

```SQL
SELECT * FROM [table]
WHERE [field] BETWEEN [rang_start] AND [range_end]
```

## `LIKE` Operator

Use `LIKE` operator to match a string pattern.

- String pattern is not the same as regular expression, it has different rules.

- Use `%` to match arbitrary number of characters.

- Use `_` to match single character.

```SQL
SELECT * FROM [table]
WHERE [field] LIKE '[char]%' -- starts with [char]
OR
[field] LIKE '_[char]' -- matches a combination of any single character and [char]
                       -- length is [char].length + 1
OR
[field] LIKE '%[char]%' -- contains `[chars]`
```

- Each `LIKE` operator is a complete expression, use `OR` or `AND` to separate them base on your need.

## `REGEXP` Operator

Use `REGEXP` operator to match content with regular expression.
Regular expression can contain multiple and complex patterns.

symbol | stands for | use case | pattern
-----|-------|--------|--------
`^`|start of a string|`^[chars]`|starts with `[chars]`
`$` | end of string | `[chars]$` | ends with `[chars]`
`|`|multiple patterns separator|`^[chars1]|[chars2]|[chars3]`|starts with `[chars]` or contains `[chars2]` or contains `[chars3]`
`[]`|a set of characters| `[a-z]` `No.[0-9]` `[abc]d`|matches every combination of item in set and external characters

While using `REGEXP`, you don't have to use `AND` or `OR` operator to express logic, using pipe `|` to separate multiple patterns is much more simple.

```SQL
SELECT * FROM [table]
WHERE [field] REGEXP '[pattern1]|[pattern2]|[pattern3]'

-- same as
SELECT * FROM [table]
WHERE [field] REGEXP '[pattern1]' OR [field] REGEXP '[pattern2]' OR [field] REGEXP '[pattern3]'
```

## `NOT` Operator

Use `NOT` operator to work with logical filter statement(s).

```SQL
SELECT * FROM [table]
WHERE [field] NOT [boolean_expression] -- IN|BETWEEN|LIKE|REGEXP|other logical expr
```
