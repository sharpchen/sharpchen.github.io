# Job Manipulation

- `Receive-Job`: retrieve output from existing job
- `Get-Job`: query existing jobs
- `Remove-Job`: remove job from background
- `Stop-Job`: terminate the job
- `Wait-Job`: block the thread until one or all jobs are in a terminated state

Jobs has few identifier, such as name, id, instance id. All these cmdlet supports the corresponding parameters to specify the identity of jobs.
They might not be pointed out explicitly for all sections

## Parent & Child Jobs

Each background job has at least one child job, the parent job does not return or execute anything, child jobs takes the real work.

```ps1
$job = sajb { foo }
$job.ChildJobs
```

## Job Type

- `BackgroundJob`
- `ThreadJob`
- `RemoteJob`

## Querying Job

`Get-Job` returns all parent background jobs by default.

- `-IncludeChildJob`: list both parent jobs and child jobs, you might notice the job id is successive.
- `-ChildJobState`: filter by child job state
- `-Command`: get all jobs that executes a command satisfies the pattern in literal.
    ```ps1
    gkb -Command 'gps *'
    ```
- `-State`: get all jobs with specific state.
    ```ps1
    gjb -State Completed,Running
    ```
- `-Name`: get by job name
- ...

## Remove Job

`Remove-Job` is not interesting and various, its parameters are pretty similar to `Get-Job` and it's commonly used together with `Get-Job` too.

```ps1
gjb | rjb # remove all job
```

## Terminate Job

`Stop-Job`, has the same form as `Remove-Job`, to terminate a running job.

## Retrieve Job Result

`Receive-Job` returns all results from the child jobs of a job.
The return type of job result is not certain. It depends on the action you specified.

- `-Name`: retrieve result from given job name
- `-Id`: retrieve result from given job id
- `-Job`: retrieve result from given job object, positional
- `-Keep`: preserve the job object after inspection
    ```ps1
    rcjb $job -Keep # some result
    rcjb $job # some result, consumed here # [!code highlight] 
    rcjb $job # no result # [!code highlight] 
    $job -eq $null # False, the object is still available
    ```
- `-Wait`: synchronously block the thread to wait for the job to complete and finally get the result.
    ```ps1
    rcjb $job -Wait # session blocked
    # result here
    ```

## Wait for Job

`Wait-Job` can wait for jobs until they reach a terminated state like `Completed`, `Failed`, `Stopped`, `Suspended`, `Disconnected`

- `-Any`: wait until any job terminated
- `-Timeout`: wait until timeout were reached
- `-Force`: wait for `Suspended` and `Disconnected`

