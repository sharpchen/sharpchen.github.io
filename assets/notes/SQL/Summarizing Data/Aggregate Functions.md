# Aggregate Functions

## Introduction

Function|Description
----|----
**MAX()**|**maximum** value of records that are `NOT NULL` in specified column
**MIN()**|**minimum** value of records that are `NOT NULL` in specified column
**COUNT()**|**count** of all records that are `NOT NULL` in specified column
**AVG()**|**average** of all records that are `NOT NULL` in specified column

- When passing a column or a expression as a parameter, these aggregate functions only work with `NOT NULL` values.

- To include `NULL` values, use `*`, `COUNT(*)` for example.

- Aggregate functions works for query also, not only tables.

- Aggregate functions accepts expression, when executing, those value from table or query will be calculated first and finally be aggregated.

```sql
SELECT [func]([column]|[expr]) AS [alias]
FROM [table]
-- JOIN [table2] ON [condition1]
-- WHERE [condition2]
-- and so on
```

## Using `DISTINCT`

Use `DISTINCT` to filter unique records of table or query.

```sql
SELECT [func](DISTINCT [column]|[expr]) AS [alias]
FROM [table]
-- JOIN [table2] ON [condition1]
-- WHERE [condition2]
-- and so on
```

- Aggregate functions always appear with `GROUP BY` statement, once you see a aggregate functions, think of `GROUP BY`.
