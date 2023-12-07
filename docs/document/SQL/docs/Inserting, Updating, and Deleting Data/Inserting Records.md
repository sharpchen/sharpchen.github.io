# Inserting Records

## Inserting **Single** Row

```sql
INSERT INTO [table]
VALUES (value1, value2, ...)
```

### Use `DEFAULT` Keyword to **Implicitly** Assign Value

Use `DEFAULT` keyword to implicitly assign value if the column has a default value / default expression / default attribute(AUTO_INCREMENT)

```sql
INSERT INTO [table]
VALUES (DEFAULT, value2, ...)
```

### **Explicitly** Specify Columns You Want to Insert And the **Order** of Values to be Inserted

By specifying column names, the order of values to be inserted must be the same as the order of column names, or it might raise an error.

```sql
INSERT INTO [table] (column1, column2, ...)
VALUES (value1, value2, ...)
```

## Inserting **Multiple** Rows

```sql
INSERT INTO [table] (column1, column2, ...)
VALUES 
(value1, value2, ...),
(value3, value4, ...),
(value5, value6, ...)
```
