# Raise Exception in SQL

- See in [SQLSTATE Messages](https://www.ibm.com/docs/en/db2/11.5?topic=messages-sqlstate)

## Raise Exception

```sql
SIGNAL SQLSTATE [error_code:string]
    SET MESSAGE_TEXT = [customized_messages:string];
```
