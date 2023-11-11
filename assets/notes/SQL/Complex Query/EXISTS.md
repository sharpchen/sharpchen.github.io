# EXISTS

```sql
SELECT *
FROM [table]
WHERE EXISTS [sub_query]|[rule]

SELECT *
FROM [table]
WHERE NOT EXISTS [sub_query]|[rule]
```

`EXISTS` does not return a record set to outer-query compared with `IN` operator, it accepts a rule to match.
Consider this statement as a loop.

```Csharp
List<Record> result = new();
Func<Record, bool> rule = ...;
foreach (var record in table)
{
    if(rule(record))
    {
        result.Add(record);
    }
}
```

For each record of the table, if the record matches the rule, will be added to the query-result.
