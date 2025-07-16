# File IO

## Line by Line

`Get-Content` is bad practice when the file is larger enough to process line by line, the memory might overflow during runtime.
Using `.NET` class such as `FileStream` can be just fine but a little complicated. The most direct solution is using `switch -File` statement.
A `switch` statement with `-File` flag enumerates the whole file line by line, each line was matched with given pattern, and such pattern can combine with other flags such as `-CaseSensitive`.
You may use `break` to terminate the whole loop or `continue` to skip to next iteration.

```ps1
switch -CaseSensitive -Wildcard -File ~/.local/state/nvim/lsp.log {
    'fsautocomplete' {
        if ($shouldSkip) { continue }
        $_ # current line
    }
    'ERROR' {
        break; # the whole switch is terminated
    }
    default {
    }
}
```

> [!NOTE]
> There should not exist brackets around file name in `switch -File <filename>`
