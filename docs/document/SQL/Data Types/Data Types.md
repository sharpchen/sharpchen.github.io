# Data Types

## **String** Types

Type|Length|Size
----|------|----
`CHAR()`|fixed|---
`VARCHAR()`|max: 65535 chars|max: 64KB
`MEDIUMTEXT`|---|max: 16MB|
`LONGTEXT`|---|max: 4GB
`TINYTEXT`|---|max:255 bytes
`TEXT`|---|64KB

Character Set|Bytes
---------|-----
English|1byte
European|2bytes
Middle-East|2bytes
Asian|3bytes

## **Numeric** Types

Numeric data types are types computable(Including boolean).

- See [Numeric Data Types (MariaDB)](https://mariadb.com/kb/en/numeric-data-type-overview/)

### Integer Types

Type|Size|Range
-----|----|---
`TINYINT`|1byte|`[-128, 127]`
`UNSIGNED TINYINT`|1byte|`[0, 255]`
`SMALLINT`|2bytes|`[-32768, 32767]`
`MEDIUMINT`|3bytes|`[-8388608, 8388607]`
...|...|...

#### **Zero Fill** of Integer types

If `ZEROFILL` is specified, the column will be set to UNSIGNED and the spaces used by default to pad the field are replaced with zeros. `ZEROFILL` is ignored in expressions or as part of a UNION. `ZEROFILL` is a non-standard MySQL and MariaDB enhancement.

### Fixed point and floating types

Type|Size
-|-
`DECIMAL(p, s)`|---
`FLOAT`|4bytes
`DOUBLE`|8bytes

- Use `FLOAT` or `DOUBLE` for mathematical calculation.

## **Date** and **Time**

- See [Date and Time Data Types (MariaDB)](https://mariadb.com/kb/en/date-and-time-data-types/)

## `BLOB` Type

Use `BLOB` type to represent any file(a sequence of binary data).

## `JSON` Type

- See [JSON Data Type (MySQL)](https://dev.mysql.com/doc/refman/8.0/en/json.html)

- See [Difference of JSON Type Between MySQL and MariaDB](https://mariadb.com/kb/en/json-data-type/#differences-between-mysql-json-strings-and-mariadb-json-strings)
