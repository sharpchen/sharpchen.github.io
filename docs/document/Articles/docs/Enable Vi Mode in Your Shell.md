# Enable Vi Mode in Your Shell

## Bash

```sh
# ~/.inputrc
set editing-mode vi # enable for all input box in shell
set keymap vi-insert
set show-mode-in-prompt on # enable mode indicator
set vi-cmd-mode-string "\1\e[2 q\2" # block bar in normal mode
set vi-ins-mode-string "\1\e[6 q\2" # vertical bar in insert mode
```

## PowerShell

Make sure you have `PSReadLine` installed.

```ps1
Set-PSReadLineOption -EditMode Vi
$OnViModeChange = {
    if ($args[0] -eq 'Command') {
        # Set the cursor to a blinking block.
        Write-Host -NoNewLine "`e[2 q"
    } else {
        # Set the cursor to a blinking line.
        Write-Host -NoNewLine "`e[5 q"
    }
}
Set-PSReadLineOption -ViModeIndicator Script -ViModeChangeHandler $OnViModeChange
```
