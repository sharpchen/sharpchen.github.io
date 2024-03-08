# Enhancement

## Fix screen glitch when executing

For large amount of worksheet executions, screen may blink for each modification.
Add following to disable blinking until the subroutine finished.

```vb
Sub MySub()
    Application.ScreenUpdating = False
End Sub
```
