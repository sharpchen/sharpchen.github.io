# Functions

@import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false}

<!-- code_chunk_output -->

- [Functions](#-functions-)
  - [**Numeric** Functions](#-numeric-functions-)
  - [**String** Functions](#-string-functions-)
  - [**Date** Functions](#-date-functions-)
  - [**Date** Formatter and **Time** Formatter](#-date-formatter-and-time-formatter-)
  - [**Date** Calculation and **Time** Calculation](#-date-calculation-and-time-calculation-)
  - [`IFNULL()`](#-ifnull)
  - [`COALESCE()`](#-coalesce)
  - [`IF()`](#-if)
  - [`CASE - WHEN - ELSE - END`](#-case---when---else---end)

<!-- /code_chunk_output -->
## **Numeric** Functions

Name|Signature|Example
----|---------|-------
`ROUND()`|`ROUND(input:number, digits:int = 0):number`|`ROUND(1.1425, 3) = 1.143`
`CEILING()`|`CEILING(input:number):number`|`CEILING(1.1415) = 2`
`FLOOR()`|`FLOOR(input:number):number`|`FLOOR(1.1415) = 1`
`ABS()`|`ABS(input:number):number`|`ABS(-1.1415) = 1.1415`
`RAND()`|`RAND():float`|`RAND() => (0, 1):float`
...|...|...
||

## **String** Functions

Name|Signature|Example
----|---------|-------
`LENGTH()`|`LENGTH(input:string):int`|`LENGTH('1.1415') = 2`
`UPPER()`|`UPPER(input:string):string`|`UPPER('abc') = 'ABC'`
`LOWER()`|`LOWER(input:string):string`|`LOWER('ABC') = 'abc'`
`LTRIM()`|`LTRIM(input:string):string`|`LTRIM('  ABC') = 'ABC'`
`RTRIM()`|`RTRIM(input:string):string`|`RTRIM('ABC  ') = 'ABC'`
`TRIM()`|`TRIM(input:string):string`|`TRIM('  ABC ') = 'ABC'`
`LEFT()`|`LEFT(input:string, count:int):string`|`LEFT('ABCDEFG', 3) = 'ABC'`
`RIGHT()`|`RIGHT(input:string, count:int):string`|`RIGHT('ABCDEFG', 3) = 'EFG'`
`SUBSTRING()`|`SUBSTRING(input:string, startIndex:int, length:int):string`|`SUBSTRING('ABCDEFG', 3, 3) = 'CDE'`
`...`|`SUBSTRING(input:string, startIndex:int):string`|`SUBSTRING('ABCDEFG', 3) = 'CDEFG'`
`LOCATE()`|`LOCATE(target:string, textToSearchFrom:string):int`|`LOCATE('DD', 'ABCDDD') = 4`
`REPLACE()`|`REPLACE(textToReplace:string, target:string, replacement:string):string`|`REPLACE('ABC', 'AB', 'CC') = 'CCC'`
`CONCAT()`|`CONCAT(...texts:string[])`|`CONCAT('A', 'B', 'C') = 'ABC'`

- Index of a string in `SQL` starts from `1` instead of `0`.

- Case are not sensitive for all string functions.

## **Date** Functions

Name|Signature|Example
----|---------|-------
`NOW()`|`NOW():DateTime`|`NOW() => YYYY-MM-DD hh-mm-ss`
`CURDATE()`|`CURDATE():DateTime`|`CURDATE() => YYYY-MM-DD`
`CURTIME()`|`CURTIME():DateTime`|`CURTIME() => hh-mm-ss`
`MONTH()`|`MONTH(input:Date):int`|`MONTH(NOW()) => YYYY`
`MONTH()`|`MONTH(input:Date):int`|`MONTH(NOW()) => MM`
`DAY()`|`DAY(input:Date):int`|`DAY(NOW()) => DD`
`HOUR()`|`HOUR(input:Date):int`|`HOUR(NOW()) => hh`
`MINUTE()`|`MINUTE(input:Date):int`|`MINUTE(NOW()) => mm`
`SECOND()`|`SECOND(input:Date):int`|`SECOND(NOW()) => ss`
`DAYNAME()`|`DAYNAME(input:Date):string`|`DAYNAME(NOW()) => ANY ('Wednesday', ...)`
`MONTHNAME()`|`MONTHNAME(input:Date):string`|`MONTHNAME(NOW()) => ANY ('January', ...)`
`EXTRACT()`|`EXTRACT(statement:):`|`EXTRACT(YEAR FROM NOW()) => YYYY`

## **Date** Formatter and **Time** Formatter

Name|Signature|Example
----|---------|-------
`DATE_FORMAT()`|`DATE_FORMAT(input:Date, format:string):string`|`DATE_FORMAT(NOW(),'%Y, %M')`
`TIME_FORMAT`|`...`|`...`

- See format specifiers in [documentation](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html).

## **Date** Calculation and **Time** Calculation

Name|Signature|Example
----|---------|-------
`DATE_ADD()`|`DATE_ADD(input:Date, INTERVAL count:number UNIT):Date`|`SELECT DATE_ADD(NOW(), INTERVAL -1.5 DAY)`
`DATE_SUB()`|`DATE_SUB(input:Date, INTERVAL count:number UNIT):Date`|`SELECT DATE_SUB(NOW(), INTERVAL 1.5 DAY)`
`DATEDIFF()`|`DATEDIFF(date1:Date|string, date2:Date|string):int`|`DATEDIFF('2010-01-01', '2013-03-21') = -1175`
`TIME_TO_SEC()`|`TIME_TO_SEC(time:Time|string):int`|`SELECT TIME_TO_SEC(TIME(NOW()))`

## `IFNULL()`

Name|Signature|Example
----|---------|-------
`IFNULL()`|`IFNULL(column, assignment:string):unknown`|`SELECT IFNULL(id, 'Not Found') FROM student`

## `COALESCE()`

Name|Signature|Example
----|---------|-------
`COALESCE()`|`COALESCE(...value:unknown[], assignment:string):unknown`|`SELECT COALESCE(id, name, 'Not Found') FROM student`

- `DATEDIFF()` only calculates difference of days.

## `IF()`

Name|Signature|Example
----|---------|-------
`IF()`|`IF(expr:boolean, trueCase:unknown, falseCase:unknown)`|`...`

## `CASE - WHEN - ELSE - END`

```sql
SELECT 
    CASE
        WHEN [condition1] THEN [value_to_be_returned_1]
        WHEN [condition2] THEN [value_to_be_returned_2]
        ...
        ELSE [default_value_to_be_returned]
    END
```
