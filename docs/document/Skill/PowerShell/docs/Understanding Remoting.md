# Understanding Remoting

## The Protocol

PowerShell uses a protocol that you might have never heard of, the *Web Services for Management(WSMan)*, which is one of the builtin *PSProvider* on Windows.
WSMan is Windows specific feature, so as PowerShell came into the cross-platform world, Microsoft decided to support SSH which is more commonly used over industries.
Microsoft made effort to bring SSH to Windows world, they're maintaining [a fork of SSH in github](https://github.com/PowerShell/openssh-portable)

> [!NOTE]
> `openssh` is builtin since certain version of Windows 10.

## Connect to Remote

No matter which protocol you use with PowerShell, it has a unified cmdlet to connect to one.
Of course this requires PowerShell available on both sides.

- Using SSH

```ps1
# login as <user> on <ip>
Enter-PSSession -HostName <host> -UserName <user> -Port <port>
# or use a short syntax
Enter-PSSession -HostName <usr>@<host>
```

- Using WSMan

```ps1
# -ComputerName used instead for connection by WSMan
Enter-PSSession -ComputerName <host> -UserName <user>
```

Optionally, you can store the session as variable instead of entering it by `New-PSSession`.

```ps1
$session = New-PSSession -HostName <host> -UserName <usr>
```

## Disconnect from Remote

```ps1
Exit-PSSession
```

## Execute Command on Remote

- Execute a same command on one or more remotes.

```ps1
Invoke-Command -HostName <host1>[,<host2>, ...] -UserName <usr> -ScriptBlock { <cmd> }
```

- Execute on a persistent session

```ps1
$session = New-PSSession -HostName <host> -UserName <usr>
icm -Session $s -ScriptBlock { <cmd> }
```

> [!NOTE]
> `Invoke-Command` returns deserialized object converted from transferred xml from remotes, it reflects data on remote only.
> You should only aggregate format it without mutating the values.
> `Enter-Session` does enter a PowerShell session, so it operates on a real PowerShell instance just like what you can do with SSH.
