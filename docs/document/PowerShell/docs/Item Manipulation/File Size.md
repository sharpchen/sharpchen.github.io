# Units of Size

Powershell has builtin suffix for some numeric types that can represent file size and memory size like `mb`, `gb` and so on.
Powershell recognized the units and convert it into the base representation of size which is `byte`.
So it's like some implicit operators in `C++` that do the job for us.

- **NOT** case-sensitive
- Auto converts into bytes(the default unit)
- No concrete or wrapper type exists, just a annotation.


```ps1
gci | where { $_.Length > 1kb }
```
