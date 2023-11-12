# Sub-query

## Where Can Sub-query be placed in?

### After `WHERE`

```sql
SELECT * FROM [table]
WHERE [column] [operator] [sub_query]
```

### In `SELECT` Statement

```sql
SELECT 
    [column1],
    [column2],
    (SELECT [column]
        FROM [table]) AS [alias]
FROM [table]
```

### After `FROM`

```sql
SELECT *
FROM [sub_query]
```

- Use view to represent temporary table when the sub-query is complex.
