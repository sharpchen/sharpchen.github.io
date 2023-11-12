# `CROSS JOIN` Clause

## Use `CROSS JOIN` To Create All Possible Matches

`CROSS JOIN` is used to create all possible matches of records from tables.

```sql
SELECT [columns]
FROM 
[table1] CROSS JOIN[table2]
```

- `CROSS JOIN` does not have any condition.

## Implicit `CROSS JOIN`

```sql
SELECT [columns]
FROM
[table1], [table2]
```
