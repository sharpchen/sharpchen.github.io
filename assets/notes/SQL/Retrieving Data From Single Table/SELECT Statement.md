# `SELECT` Statement Comprehension

## Sorting operation(s) should be placed after filter statement(s)

To understand this syntax, we may think about how a query is executed. When sorting a huge amount of data, our data base has much more burden, it will take more time to return the final result especially when the table we are retrieving contains a very large amount of data. So filtering those data before we sorting them is time efficient and performance efficient.

```SQL
SELECT * FROM [table]
WHERE [expression]
ORDER BY [column|expression]
```

## Filtering statement(s) and Sorting statement(s) are OPTIONAL

```SQL
SELECT 1, 2, 3; -- this is valid even
```

## Can write expression when selecting columns

```SQL
SELECT [column1], [column2], [column3], [expression]
FROM [table]
```

Let a table having a column named count which is a integer.
Then, we can write this

```SQL
SELECT count + 1
FROM [table]
```

The query result will display a column that every element was added by 1.

## Alias of a table

```SQL
SELECT count + 1 AS new_count;
SELECT count + 1 AS "new count";
SELECT count + 1 AS `new count`; -- only MySQL supports this syntax
```

- Use `_` to separate words OR close the string of alias name with `"`.
- If using MySQL, `` `new count` `` is also available to set alias name.

```SQL
SELECT [column]|>[expr|func] AS [new_column_name];
```
