# What to Learn from New cmdlet

## Find Positional Parameter

Positional parameter matters for understanding the examples listed on documentations since the example might elide parameter name.
We can take advantages of `Get-Help` and `Select-String` to capture those parameters that have a explicit order.
The `-Context` includes 3 lines above and 5 lines below the display the whole info of the parameter.

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

## Find Parameters Accepts Pipeline

Similar to finding position parameter.

```ps1
help <cmd> | sls 'Accept pipeline input\??\s*true.*$' -Context 5,4
```
