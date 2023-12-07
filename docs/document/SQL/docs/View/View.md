# View

View is a mapping of real table based on a query statement.
Use a sub-query to create a view, and the query statement can be changed later.
Once the query statement were changed and applied, meaning that the rule of mapping changed, and the content view shows also changed. The content of view are specified by query statement.

- Columns of a view can be from original table, can also be derived from columns of original table, a expression for example.

## `CREATE` View

```sql
CREATE VIEW [view_name] AS [sub_query]
```

## `DROP` View

```sql
DROP VIEW [view_name]
```

## `REPLACE` View

```sql
CREATE OR REPLACE VIEW [view_name] AS [sub_query]
```

- Views can be altered, like update, delete, insert and so on. **It is not synced with original table**, but still limited by the original table.

> When inserting a new record to a view, if the new record does not match to the query statement that was used to create the view, the new record **won't** be inserted. When updating a record that does not match to the query, the record will be **removed** from the view.
By default, this will not raise an error when executing. Add `WITH CHECK OPTION` after query that creates the view to explicitly show the error when running, by doing so to prevent wrong operations.

```sql
CREATE OR REPLACE VIEW [view_name] AS [sub_query]
WITH CHECK OPTION
```

- `WITH CHECK OPTION` will raise error and prevent altering a view when the operation does not match to the rule of view, it protects the uniformity between table and view.
