# The GROUP BY Clause

## Introduction

The `GROUP BY` clause separates records base on given condition into small tables, and finally `UNION` these small tables into the result table.
The following example shows that `GROUP BY` separates records from a `WHERE` clause base on a column, each part of that can be considered as a temporary table will be passed to `SELECT [func]([column]|[expr]) FROM [table]`, and generates multiple tables, finally `UNION`these table as result table.

```sql
SELECT [func]([column]|[expr])
FROM [table]
WHERE [condition]
GROUP BY [column1], [column3]
-- ORDER BY [column2]
```

- `GROUP BY` accepts multiple columns to group, basically means create multiple matches to a same value. The order of grouping follows how columns are placed after `GROUP BY`.

- Every column/expr selected will separately calculate the final value base on every group **unit**.
