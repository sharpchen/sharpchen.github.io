# Basic Stored Procedure Syntax

**`PROCEDURE` does not return any value. It is a set of action.**
***Stored Procedure* basically means a procedure stored as a existence in our operating system, not only exists during runtime as an instance.**

## Creating Procedure

- Follow `[procedure_name]` with parenthesis because procedure can accept parameters.

- End statements of `[procedure_body]` with semicolon. Or it will raise an error in MySQL/MariaDB.

```sql
CREATE PROCEDURE [procedure_name]()
BEGIN
    [procedure_body];
END
```

## Using `DELIMITER` to define single unit of code in MySQL/MariaDB

Use `DELIMITER` to specify a delimiter, delimiter is used to define a unit of code.
`DELIMITER` key word is used to define the scope of specified delimiter.

```sql
DELIMITER [delimiter]
CREATE PROCEDURE [procedure_name]()
BEGIN
    [procedure_body];
END
[delimiter]
DELIMITER; -- End a scope of specified delimiter
           -- but it's optional
```

## Calling a Procedure

```sql
CALL [procedure_name](params)
```

## Dropping a Procedure

```sql
DROP PROCEDURE IF EXISTS [procedure_name];
```

## Procedure with Parameters

```sql
DELIMITER [delimiter]
CREATE PROCEDURE [procedure_name](param1 [data_type])
BEGIN
    [procedure_body];
END
[delimiter]
DELIMITER;
```

- If using type `CHAR`, must specify its maximum length. `DECIMAL` needs to specify total digit length and decimal length.

```sql
DELIMITER [delimiter]
CREATE PROCEDURE [procedure_name](param1 CHAR([max_length]))
BEGIN
    [procedure_body];
END
[delimiter]
DELIMITER;
```
