# `ORDER BY` Clause

## The Sorting Order

### Sorting Order For Single Column

#### `DESC` Key Word

By default, `ORDER BY` sorts data in ascending order, by specify `DESC` keyword to sort data in descending way.

```SQL
SELECT * FROM [table]
WHERE [filters]
ORDER BY [column] DESC
```

### Sorting Order For Multiple Columns

#### Sorting Multiple Columns

SQL can sort not only one column, based on how many column the table contains.

```SQL
SELECT * FROM [table]
WHERE [filters]
ORDER BY [column1], [column2], [column3]
```

And for each column, can assign sorting order for them.
Order by `[column1]`, then by `[column2]`, finally by `[column3]`.

```SQL
SELECT * FROM [table]
WHERE [filters]
ORDER BY [column1] DESC, [column2] DESC, [column3] DESC
```

#### Sorting Alias

You can also sort a alias.

```SQL
SELECT [column1], [column2], [column3]|>[expr|func] AS [new_column_name] 
FROM [table]
WHERE [filters]
ORDER BY [column1] DESC, [column2] DESC, [new_column_name] DESC
```

### Sorting By Selected Column Order

`ORDER BY` statement accepts the order of selected column as a alias of selected column name.
This is NOT recommended for its possibility that the order of columns might change in the future.
That might cause unexpected results.

```SQL
SELECT [column1], [column2], [column3]
FROM [table]
WHERE [filters]
ORDER BY 1, 2, 3 DESC -- 1, 2, 3 stands for [column1]-[column3]
```
