# Define a Variable

## User/Session variables

Use `@` as prefix to declare a new user variable.
Scope of user variable are outside the `PROCEDURE` or `FUNCTION`.

```sql
set @variable_name = [value]
```

To pass a variable to a `PROCEDURE` or `FUNCTION`, must also prefixed with `@`.

## Local Variables

Use `DECLARE` keyword to declare a local variable.
Scope of local variable are inside the `PROCEDURE` or `FUNCTION`.

- For all types in SQL, the implicit `DEFAULT` value is `NULL`. Try explicitly assign default value using `DEFAULT`.

```sql
DECLARE variable_name [type] DEFAULT [default_value];
```
