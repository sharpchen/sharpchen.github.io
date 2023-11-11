# `INNER JOIN` Clause

## `INNER JOIN` Two Tables

### `INNER JOIN` tables from the **Same** database

Use `INNER JOIN` to work with two tables to create a union of tables.
Semantically, we can consider `[table1] INNER JOIN [table2]` as a new table, and the condition after `ON` key word limits the final result. With `*` selected, result contains all columns from `[table1]` followed by all columns from `[table2]`

**Two records from two tables that satisfy the `[condition]` will be placed at the same line in result table.**

- `INNER` keyword is **optional**, `JOIN` is `INNER` by default.

- `INNER JOIN` works for same table also, see [self join](#self-join).

- For any join clause, must join **existing** tables, not temporary tables.

```SQL
SELECT * FROM 
[table1] INNER JOIN [table2]
    ON [condition]
```

If two tables contains columns that have the same name, use `.` accessor to specify which table the column come from.

```SQL
SELECT [column1], [[table1].column_name]
FROM
[table1] INNER JOIN [table2]
    ON [condition]
```

Use alias of table.

```SQL
SELECT * FROM
[table1] [alias_of_table1] INNER JOIN [table2] [alias_of_table2]
    ON [condition]
```

- Once you assign an alias to a table, you can not use its real table name any longer in any place. Or it will raise an error when executing the query, its not a syntax error.

- Although alias are specified by statement after `SELECT` statement, `SELECT` statement can also use these alias to specify where the selected column come from.

- Alias of table does not use `AS` keyword.

### `INNER JOIN` Tables **Across** Databases

```SQL
SELECT * 
FROM 
[database1].[table_name] INNER JOIN [database2].[table_name]
    ON [condition]
```

### **Self** Join

Use `INNER JOIN` to work with same table.
Must use alias to distinguish a same table.

```SQL
SELECT * FROM
[table] [alias1] INNER JOIN [table] [alias2]
    ON ([alias1], [alias2])|>[condition]
```

## `INNER JOIN` **Multiple** Tables

Previous `INNER JOIN` clause returns a new table, base on that new table, we can `INNER JOIN` it again.

```SQL
SELECT [columns]
FROM 
[table1] INNER JOIN [table2]
    ON [condition1] -- consider this join clause as a new table
INNER JOIN [table3]
    ON [condition2]
```

## **Compound** Join Conditions

```SQL
SELECT [columns]
FROM
[table1] INNER JOIN [table2]
    ON [condition1]
        AND [condition2]
```

- Especially when a table contains more than one primary key to specify records, we need compound conditions to match unique records.

## Implicit `INNER JOIN`

In some cases, using `WHERE` statement is equivalent to `INNER JOIN`.

```SQL
-- two equivalent queries
SELECT * FROM
[table1], [table2]  -- join all columns from two tables and then filter them
WHERE [condition]

SELECT * FROM
[table1] INNER JOIN [table2]
    ON [condition]
```
