# The `HAVING` Clause

Use `HAVING` to filter results after `GROUP BY` clause.
A `WHERE` clause is to filter what records we want to include from source tables that is always placed after `FROM` clause.
A `HAVING` clause is to filter records that have been group by some rules and after the grouping, still needs a new filter to get the final result.

```sql
SELECT [columns]|[func]|[expr]
FROM [table]
GROUP BY [column]
HAVING [condition]
```

- Conditions used for `HAVING` clause are from selected column/expr, these can not be from any column that is not selected.
