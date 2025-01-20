# Stream Redirection

The streams are implicitly working everyday we use redirection operator `>`, `>>` in PowerShell.
Streams are `Success`, `Error`, `Warning` ... that's exactly the counterpart of `Write-Output`, `Write-Error` ...

> [!NOTE]
> See: [Output Streams](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection?view=powershell-7.4#redirectable-output-streams) 

> [!NOTE]
> Append redirection `>>` is only available for files

## Redirect to File

When you write to a file using `>` to redirect content, it's actually redirecting the `Success` stream to the file.

```ps1
gci > foo.txt
# equivalent to
gci 1> foo.txt # 1 represents the Success stream
```

## Redirect to Another Stream

```ps1
gci 1>&2 # redirect Success stream to Error stream
```

## Redirect at One Go

You can apply multiple redirection for a same source.

```ps1
& { Write-Warning "hello"; Write-Error "hello"; Write-Output "hi" } 3>&1 2>&1 > C:\Temp\redirection.log
```

## Suppress Message from Streams

If you only care specific message from streams or exculde particular stream, redirect it to `$null`

```ps1
ffmpeg -h *> $null # swollow all streams output from ffmpeg
```
