# Transaction Isolation Levels

## Basic Syntax

```sql
SET TRANSACTION ISOLATION LEVEL [transaction_level];
... 
-- after setting isolation level
-- all transactions will obey its rule
```

## Isolation Levels

### `READ UNCOMMITTED` (The lowest isolation level)

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```

`READ UNCOMMITTED` is the least isolation level, it allows transaction to read uncommitted changes.

### `READ COMMITTED`

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

`READ COMMITTED` allows reading committed changes, prevents reading uncommitted changes, however dirty reads can still happen.

- **Dirty Reads** means during a transaction, the same reading operations executed in different time may return different results, because target data may be modified by another transaction of another session.

### `REPEATABLE READ` (The default isolation level)

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

`REPEATABLE READ` prevents dirty reads. It creates a snapshot for every transaction. It's higher than `READ COMMITTED`. However, `REPEATABLE READ` may result in **phantom reads**.

- **Phantom Reads** means `REPEATABLE READ` can't read the new records added by another committed transaction, because it reads from a snapshot.

### `SERIALIZABLE` (The highest isolation level)

`SERIALIZABLE` means executing transactions one by one, it does not allow running two transactions at the same time. Next transaction must wait until the previous finished.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```
