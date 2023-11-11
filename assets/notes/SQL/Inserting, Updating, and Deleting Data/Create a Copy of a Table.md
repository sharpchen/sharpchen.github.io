# Create Copy of Table

Use `AS` and `[sub_query]` to specify the source records we are copying.

- This statement does not copy constrains of the source table

```sql
CREATE TABLE [new_table_name]
AS
[sub_query]

CREATE TABLE [new_table_name]
AS
SELECT * FROM [table] -- sub query can be any select statement
-- JOIN [table2] ON [condition2] -- can also join tables
-- WHERE [condition] -- add a condition to copy a part of source table
```
