# `OUT` Modifier

Although `PROCEDURE` does not return any value, can still make changes in variables.

```sql
DELIMITER $$
CREATE OR REPLACE PROCEDURE [procedure_name]( param1 [type], OUT param2 [type])
BEGIN
    ...
END
$$
DELIMITER;
```

Just like in `C#`, declare variables outside the procedure, then pass them with `OUT` modifier into procedure.
In the implementation of the procedure, those variables must have a new assignment. And outside the procedure, those values also change. Basically means passing reference to procedure.

```CSharp
Method(250, out var b);
System.Console.WriteLine(b); // 250
static int Method(int a, out int b) => b = a;
```
