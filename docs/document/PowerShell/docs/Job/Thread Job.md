# Thread Job

Thread job is running on the same process of PowerShell instance, so it's faster than other job types.

## Create Thread Job <Badge type="info" text="PowerShell 6+" />

Thread job utils was added since PowerShell 6, if you want to use it in lower version, install the module with this command:

```ps1
inmo ThreadJob -Scope CurrentUser
```

The usage of `Start-ThreadJob` is similar to `Start-Job`. A `-ScriptBlock` or `-FilePath` should be specified as the action of the job.
`Start-ThreadJob` returns a `ThreadJob` to represent the state of the job.

```ps1
$job = Start-ThreadJob { foo }
$job.GetType().Name # ThreadJob
```

## Multiple Thread Jobs <Badge type="info" text="PowerShell 7+" />

`ForEach-Object` supports creating parallel thread job from pipeline input since PowerShell 7.

- `-Parallel`: perform each action on pipeline item in parallel, requires a scripblock.
- `-AsJob`: return an object with child jobs.

`-AsJob` returns a `PSTaskJob` object that contains all child jobs representing each action on pipeline item.

```ps1
1..10 | foreach -Parallel { echo $_ } -AsJob | rcjb -Wait
```

## Thread Safety

Do not mutate or access member of a shared variable in thread jobs unless you use thread-safe types!

