# Transactions

## ACID Properties

- **Atomicity**: Every transaction is a single unit, unbreakable. Before committed, any part of transaction will not be actually executed.

- **Consistency**: After transaction was committed, database remains its consistency.

- **Isolation**: Transactions don't intervene each other, when a data entity is accessed by a transaction, other transaction will be blocked until previous transaction was committed.

- **Durability**: Every changes made by transaction are permanent.

## Create a Transaction

```sql
START TRANSACTION;
-- do something...
COMMIT;
```
