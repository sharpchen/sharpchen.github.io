# `LIMIT` Clause

## Limit result amount

Limits record amount of result.

```SQL
SELECT * FROM [table]
WHERE [filters]
ORDER BY [columns]
LIMIT [number]
```

## Limit With Offset

This statement will skip the first amount of `[offset]` records and finally return amount of `[number]` from the top.

```SQL
SELECT * FROM [table]
WHERE [filters]
ORDER BY [columns]
LIMIT [offset], [number]
```
