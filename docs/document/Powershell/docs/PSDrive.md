# PSProvider

**PSProvider** is another confusing concept from powershell.
A PSProvider basically provides a way to browse and access items from a source.
There's some builtin PSProviders like `FileSystem`, `Registry` on windows and so on.

You can check all available providers by:

```console
$ Get-PSProvider

Name                 Capabilities                                                          Drives
----                 ------------                                                          ------
Registry             ShouldProcess                                                         {HKLM, HKCU}
Alias                ShouldProcess                                                         {Alias}
Environment          ShouldProcess                                                         {Env}
FileSystem           Filter, ShouldProcess, Credentials                                    {C, D, Temp}
Function             ShouldProcess                                                         {Function}
Variable             ShouldProcess                                                         {Variable}
Certificate          ShouldProcess                                                         {Cert}
WSMan                Credentials                                                           {WSMan}
```

## PSDrive

Each PSProvider can have one or more **PSDrive**.

PSDrive is kind of like one of the entries of a PSProvider.

Check all available PSDrive by `Get-PSDrive`.
