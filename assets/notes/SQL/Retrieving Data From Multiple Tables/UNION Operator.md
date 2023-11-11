# `UNION` Operator

Use `UNION` operator to combine multiple query results.
In other words, `UNION` can combine different rows into one table, those column in result table can have different data types(finally will be converted into same type, except `NULL`), but with the same column name.

```sql
SELECT [columns1]
FROM [table]
ORDER BY [column]

UNION

SELECT [columns2]
FROM 
[table1] JOIN [table2]
ON [condition]
```

- `[columns2]` must contain the same number of `[columns2]`, or it will raise an error when executing the query.

- The names of result columns are specified by the very first query.

- If the a column in result table contains different types of data, those data will be converted into a same type, in most cases, will be converted into `String`.
