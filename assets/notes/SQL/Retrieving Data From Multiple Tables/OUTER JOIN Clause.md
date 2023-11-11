# `OUTER JOIN` Clause

## The type of `OUTER JOIN`

There are two types of `OUTER JOIN`, `LEFT OUTER JOIN` and `RIGHT OUTER JOIN`.
Using `LEFT OUTER JOIN`, all **records** from left table we are retrieving will be kept in result table.
Using `RIGHT OUTER JOIN`, all **records** from right table we are retrieving will be kept in result table.

- `OUTER` keyword is **optional**, using `LEFT` or `RIGHT` keyword is consider as a `OUTER JOIN` by default.

```SQL
SELECT [columns]
FROM
[table1] LEFT OUTER JOIN [table]
    ON  [condition] -- records from [table1] will be kept in result table
```

```SQL
SELECT [columns]
FROM
[table1] RIGHT JOIN [table] -- OUTER keyword is optional
    ON  [condition]
```

## `OUTER JOIN` Multiple Tables

```SQL
SELECT [columns]
FROM
[table1] LEFT JOIN [table2]
    ON [condition1]
LEFT JOIN [table3]
    ON [condition2]
```

- Do **NOT** use `RIGHT JOIN` unless you really need to, because we always select columns that are **not null** and **place them in the left side** of result table, possible null columns are placed in the right side. Using `LEFT JOIN` is easier to understand.

## Self Join

Same as self join of `INNER JOIN`.
