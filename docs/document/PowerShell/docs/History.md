# History

## Search History

- Session history

```ps1
h | Select-String <text>
```

- All history

```ps1
gc (Get-PSReadLineOption).HistorySavePath | Select-String <text>
```
