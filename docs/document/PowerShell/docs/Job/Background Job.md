# Background Job

A background job is a job running on another PowerShell process(sub-shell) created by the current PowerShell instance.

- `Start-Job`: start a background job(process job)
    - `-ScriptBlock`: specify custom action for the job
    - `-FilePath`: run from a script file
    - `-Name`: specify name for the job
    - `-InitializationScript`: preparation for the action run in current PowerShell process
    - `-WorkingDirectory`: specify cwd for the job
    - `-ArgumentList`: arguments to be passed into the process
    - `-PSVersion`: run in specific version

- `&`: syntactic shorthand for `Start-Job`

- `Receive-Job`: retrieve job state from a job object.
    - `-Wait` synchronously wait for the job.

## Start a Job

`Start-Job` creates a new background job and returns a `System.Management.Automation.PSRemotingJob` to represent the state of the job.

```ps1
Start-Job -ScriptBlock { foo }
```

### Using `&` <Badge type="info" text="PowerShell 6+" />

Using `&` to create a background job is only equivalent to `Start-Job -ScriptBlock { ... }`

```ps1
$job = gps pwsh &
# equivalent to 
$job = sajb { gps pwsh }
```

`&` can be recognized as a statement terminator, so you don't have to use an extra `;` for multiple expression inline.

```ps1
gps pwsh &; rcjb $job -Wait
gps pwsh & rcjb $job -Wait # ; can be elided # [!code highlight] 
```

### Passing Arguments

Closure is not allowed for `-ScriptBlock`.

```ps1
$foo = 'pwsh'
$job = sajb { gps $foo }
rcjb $job # receive error message # [!code error] 

$job = sajb { gps $args } -ArgumentList pwsh,notepad # [!code highlight] 
rcjb $job # ok # [!code highlight] 
```

### Run as Job from other Cmdlet

There's some other cmdlet supports `-AsJob` switch to perform action as backgraound jobs, like `ForEach-Object` and `Invoke-Command`.

```ps1
# Run a job in the remote
Invoke-Command -HostName <host> -UserName <usr> -ScriptBlock { foo } -AsJob
```


### Querying Jobs


