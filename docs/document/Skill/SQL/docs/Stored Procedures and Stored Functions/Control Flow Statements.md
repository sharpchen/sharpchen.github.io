# Control Flow Statements

- See in [Full Documentation of Control Flow Statements in IBM](https://www.ibm.com/docs/en/i/7.1?topic=reference-sql-control-statements)

## `IF` Statement

- See in [IF-statement](https://www.ibm.com/docs/en/i/7.5?topic=pl-if-statement)

### Single statement in `IF` or `ELSE` block

- Follow `IF` and `ELSEIF` by `THEN` key word after the condition.

- Use `ENDIF` to end a whole `IF` block.

```sql
IF [condition] THEN
    [single_statement];
ELSEIF [condition] THEN
    [single_statement];
ELSE
    [single_statement];
END IF;
```

## Multiple statements in `IF` or `ELSE` block

```sql
IF [condition] THEN
    BEGIN
        [multiple_statements];
    END
ELSEIF [condition] THEN
    BEGIN
        [multiple_statements];
    END
ELSE
    BEGIN
        [multiple_statements];
    END
END IF;
```

## `CASE` Statement

- See in [CASE-statement](https://www.ibm.com/docs/en/i/7.5?topic=pl-case-statement)

```sql
CASE
    WHEN [condition1] THEN
        [body1];
    WHEN [condition2] THEN
        [body2];
    ...
    ELSE [body];


END CASE;

CASE [value]
    WHEN [match1] THEN
        [body1];
    WHEN [match2] THEN
        [body2];
    ...
    ELSE [body];

```
