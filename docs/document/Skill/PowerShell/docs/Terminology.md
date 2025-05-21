# Terminology

Powershell has its own terminologies besides other shells like bash.
It's a shell integrated with .NET, it's not a independent platform.

- `cmdlet`: pre-compiled .NET assemblies work for PowerShell, implemented using other languages typically in `C#`.
- `function`: a command implemented using powershell language itself.
- `application`: external executable.

## Session

Session is an environment state created on Powershell instance starts.
A session is not a scope, all environment of sessions are isolated.
The scope of the session is the top scope.

### SessionState

A SessionState object holds the state of a PowerShell session or a module.
Most importantly, the SessionState manages variables, functions and cmdlets by holding a stack of Scopes.
**`[scriptblock]` uses the SessionState object to look for variables and functions based on the scoping rule**.

## Runspace

Runspace is a customized instance of Powershell by powershell code.
In general, you can't control how powershell loads Providers and builtin member and so on.
So Powershell exposes such api to create a customized object to represent the truncated or enhanced instance of the Powershell environment.
By this approach, you can expose minimal privileges and custom utilities to users for certain tasks.

Each Runspace creates isolated session state just like a normal powershell instance.

A normal powershell can be referred as a Runspace too.

## Execution Policy

Execution Policy is dedicated for Windows platform, it restricts the authority to execute a valid PowerShell script or command.

- `AllSigned`: requires scripts to be signed by trusted-publisher
- `Bypass`: does not block anything
- `Default`: `Restricted` for Windows personal and `RemoteSigned` for Windows Server
- `Unrestricted`: default and unchangeable for non-windows platform
- `Restricted`: no script allowed; command execution allowed
