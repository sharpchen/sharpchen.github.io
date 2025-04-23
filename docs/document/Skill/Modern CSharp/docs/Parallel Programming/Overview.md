# Overview

## Concurrency & Multi-Threading

> Concurrency is about dealing with lots of things at once, but parallelism is about doing lots of things at once.

- Concurrency works on a single core that handles one or more tasks at the same time with interleaving executions
    - it's a fake parallelism, but fast enough to act like a parallelism.
- Multi-Threading starts new threads from the same process; Threads can be handled by multiple core when available
    - Still work concurrently when only single core available.
    - If number of threads exceeds number of cores, the remaining are scheduled as concurrent

## What's Involved

- Task-based Asynchronous Model
     - Task Creation & Invocation
     - Task Cancellation
     - Waiting for Task
- Data Sharing & Synchronization
- Thread-safe Collections
- Task coordination
- Paralle Utilities(`Paralle` class & PLINQ)
