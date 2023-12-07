# Update Records

## Update Single Record

```sql
UPDATE [table]
SET [column1] = [value1]|[expr]|[func],
    [column2] = [value2]|[expr]|[func]
WHERE [column] = [value]   -- this condition can filter one or more records to be updated
                           -- see Update Multiple Records
```

## Update Multiple Records

```sql
UPDATE [table]
SET [column1] = [value1]|[expr]|[func],
    [column2] = [value2]|[expr]|[func]
WHERE [condition]
```

- `WHERE` clause ia optional, so if you want to update all records in the table, just leave it out.

## Update Records Using SubQueries

Sub query returns a set of result to match, so use `IN` keyword to match all of them.

- Must close sub query with parenthesis.

```sql
UPDATE [table]
SET [column1] = [value1]|[expr]|[func],
    [column2] = [value2]|[expr]|[func]
WHERE [column] IN ([sub_query]) -- can be any select statement
```
