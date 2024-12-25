# Serialization

> [!TIP]
> For deserialization, see `gcm -Verb Import`

## JSON

```ps1
ls | ConverTo-JSON
ls | ConverTo-JSON > foo.json
```

## XML

Powershell has a special xml format for itself called `Clixml`, this is specific to powershell.

```ps1
ls | Export-Clixml foo.xml
```


## CSV

```ps1
ls | ConverTo-Csv > foo.csv
ls | Export-Csv foo.csv
```

## HTML

## TXT
