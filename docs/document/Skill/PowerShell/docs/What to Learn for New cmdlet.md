# What to Learn from New cmdlet

## Find Positional Parameter

Positional parameter matters for understanding the examples listed on documentations since the example might elide parameter name.
We can take advantages of `Get-Help` and `Select-String` to capture those parameters that have a explicit order.
The `-Context` includes 3 lines above and 5 lines below the matched line to display the whole info of the parameter.

```ps1
help <cmd> | sls 'Position\??\s*\d' -Context 3,5
```

The example usage is exactly what we have used here, the `Select-String`.
It has two positional parameters, `-Pattern` and `-Path`.
So in the previous example, the `-Pattern` was omitted.

```console
$ help sls | sls 'Position\??\s*\d+' -Context 3,5

      -Path <string[]>

          Required?                    true
>         Position?                    1
          Accept pipeline input?       true (ByPropertyName)
          Parameter set name           File, FileRaw
          Aliases                      None
          Dynamic?                     false
          Accept wildcard characters?  false
      -Pattern <string[]>

          Required?                    true
>         Position?                    0
          Accept pipeline input?       false
          Parameter set name           (All)
          Aliases                      None
          Dynamic?                     false
          Accept wildcard characters?  false
```

## Find Parameters Accept Pipeline

Similar to finding position parameter.

```ps1
help <cmd> | sls 'Accept pipeline input\??\s*true.*$' -Context 5,4
```

## Path Specific Parameter

Commonly named parameters for path are `-Path`, `-FilePath`, `-LiteralPath`.
So once the cmdlet supports one of them, you should aware it probably supports one or more of others.

## Member of ParameterSet

Syntax of a cmdlet is not quite clear sometimes, you might just want to inspect parameters by parameterset name.

```ps1
$CommonParams = @( 
    'Verbose', 
    'Debug',
    'ErrorAction', 
    'WarningAction', 
    'InformationAction', 
    'ProgressAction',
    'ErrorVariable',
    'WarningVariable',
    'InformationVariable', 
    'OutVariable', 
    'OutBuffer',
    'PipelineVariable',
    'WhatIf',
    'Confirm'
)
$cmd = Get-Command $Command
$cmd = $cmd -is [System.Management.Automation.AliasInfo] ? (Get-Command $cmd.Definition) : $cmd
($cmd.ParameterSets | ForEach-Object {
    $out = [pscustomobject]@{ 
        Name = $_.Name
        Parameters = $_.Parameters | Where-Object Name -NotIn $CommonParams 
    }
    $joinParams = @{
        Property = 'Name'
        Separator = "$([System.Environment]::NewLine)`t" 
        OutputPrefix = "$($out.Name):$([System.Environment]::NewLine)`t"
        OutputSuffix = "`n"
    }
    $out.Parameters | Join-String @joinParams
}) -join "`n"
```
