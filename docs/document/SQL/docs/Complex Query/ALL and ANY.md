# `ALL` and `ANY`

```sql
SELECT *
FROM [table]
WHERE [column] [operator] ALL|ANY [sub_query]|[list]
```

`ALL` and `ANY` keyword should be followed by list, the list can be from a sub-query.

`ALL` means all elements in the list must matches the expression with the `[column]` in value. This statement returns records that matches to all conditions from the list.

`ANY` statement returns records that matches any condition from the list.

```sql
SELECT *
FROM [table]
WHERE [column] = ALL|ANY (item1, item2, ...)
-- WHERE [column] > ALL|ANY (item1, item2, ...)
-- WHERE [column] <> ALL|ANY (SELECT * FROM...)
```

Compound `=` `ANY` has an alias, `IN`

```sql
SELECT *
FROM [table]
WHERE [column] IN [sub_query]|[list]
```
