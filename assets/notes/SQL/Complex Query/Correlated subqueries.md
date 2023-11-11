# Correlated sub-queries

Access tables in outer-query in sub-query.

```sql
SELECT *
FROM [table] [alias]
WHERE [column] [operator] (
    SELECT [column1]|[expr]|[func]
    FROM [table]
    WHERE [alias], [table]|>[condition]
)
```

Sub-query can access the same table in the outer-query, however needs a alias to distinguish the same tables.

Consider this statement as a nested loop.

```Csharp
List<Record> result = new();
Func<Record, Record, bool> innerCondition = ...;
Func<Record, T, bool> outerCondition = ...;
T innerQueryResult = new();
foreach (var record in table)
{
    innerQueryResult = new();
    foreach (var row in table)
    {
        if (innerCondition(record, row))
        {
            innerQueryResult += row.Item;
        }
    }
    if (outerCondition(record, innerQueryResult))
    {
        result.Add(row);
    }
}
return result;
```

Correlated query will execute the sub-query for every records in the table, so when working with tables containing massive data, it is not performance efficient.
