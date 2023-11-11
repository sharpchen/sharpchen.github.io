# `USING` Clause

## Replace `ON` Statement With `USING`

We can replace `ON` statement with `USING` when we use the columns that have same name to express a equal condition.

```SQL
SELECT [columns]
FROM 
[table1] JOIN [table2]
    -- ON [table1].[column_name] = [table2].[column_name]
    USING ([column_name])
```

## Use `USING` To Express Compound Conditions

`USING` statement accepts multiple column names to compound conditions.

```sql
SELECT [columns]
FROM
[table1] JOIN [table2]
    -- ON [table1].[column_name1] = [table2].[column_name1]
    -- AND [table1].[column_name2] = [table2].[column_name2]
    USING ([column_name1], [column_name2])
```
