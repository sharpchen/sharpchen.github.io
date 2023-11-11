# Function Syntax

## Create Function

```sql
DELIMITER $$
CREATE OR REPLACE FUNCTION function_name(params) RETURNS [type]
[characteristic]
BEGIN
    ...
    RETURN [value];
END
$$
DELIMITER;
```

A `FUNCTION` must have at least one characteristic.

Name|Meaning
----|-------
`DETERMINISTIC`|When parameters passed in are the same,  always returns the same value
`READS SQL DATA`|The function contains operation that reads table data
`MODIFIES SQL DATA`|The function contains operation that modifies table data
