# Path

## Resolve Path

- `-Path(0, pv)`: expand path containing special characters like `~` or UNC(Universal Naming Convention) path and some other special paths
    ```ps1
    Resolve-Path '~/*' # returns all PathInfo of children under `~`
    Resolve-Path ~ # returns expanded path as PathInfo of `~`
    ```
- `-Relative(switch)`: get all relative paths from current path or specified location of items to be listed
    ```ps1
    Resolve-Path '~/*' -Relative # list all relative string of children under ~ relative to current location
    ```
- `-RelativeBasePath`: get all relative paths from specified location of items to be listed
    ```ps1
    Resolve-Path '~/*' -RelativeBasePath ~ -Relative # list all children of ~ relative to ~ itself
    ```

## Part of Path

- `-Path(0, pv)`: get parent path as `PathInfo`
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) # C:\Users\username\AppData\Local\Temp
    ```
- `-Parent(!, switch)`: optional, the default flag for `Split-Path`, returns the parent container of `-Path`
- `-Leaf(switch)`: get base name of a path
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) -Leaf # tmpfigvir.tmp
    ```
- `-LeafBase(switch)`: get base name without extension
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) -LeafBase # tmpfigvir
    ```
- `-Extension(switch)`: get extension
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) -Extension # .tmp
    ```
- `-Qualifier(switch)`: get drive prefix of the path, not available on non-Windows platform
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) -Qualifier # C:
    ```
- `-NoQualifier(switch)`: exclude the drive prefix of the path, not available on non-Windows platform
    ```ps1
    Split-Path ([System.IO.Path]::GetTempFileName()) -NoQualifier # \Users\username\AppData\Local\Temp\tmpoo33lr.tmp
    ```
- `-IsAbsolute(switch)`: telling whether the path is absolute
- `-Resolve(switch)`: handles relative or wildcard path for `-Path`
    ```ps1
    Split-Path ~/* -Resolve # all parents of children under ~, which are all the same as `Resolve-Path ~`
    ```

## Path Validation

- `-Path(0, pv)`: telling whether the path exists, can be relative
    ```ps1
    Test-Path '~/.vimrc'
    Test-Path '../.gitignore'
    ```
- `-Filter`: common filter
    ```ps1
    Test-Path '~/*rc'
    ```
- `-IsValid(switch)`: telling whether the provided path has correct syntax
    ```ps1
    Test-Path 'foo/bar' # False
    Test-Path 'foo/bar' -IsValid # True
    ```
- `-Exclude` & `-Include`: telling whether any/no path matches the specified pattern
    ```ps1
    Test-Path '~/*' -Exclude *rc # is there any file exists besides rc files?
    ```
- `-PathType`: telling whether the path is a leaf or a container(leaf is the child of a container)
    ```ps1
    Test-Path '~/.vimrc' -PathType Leaf # True, it is a file indeed
    ```
    > [!NOTE]
    > The meaning of `Leaf` is not the same as `Leaf` in `Split-Path`, `Leaf` can be any kind of child of a container in `Split-Path`.
- `-NewerThan` & `-OlderThan`: telling whether the path was created before/after a date(can be date string)
    ```ps1
    Test-Path ~/.vimrc -NewerThan "2012.6.12"
    ```

## Join Path

- `-Path(0)` & `-ChildPath(1)`: join one or more parents with single child
    ```ps1
    Join-Path C:, D: foo
    # C:\foo
    # D:\foo
    ```
- `-AdditionalChildPath(remain)`: accepts unlimited count of child paths
    ```ps1
    Join-Path -Path foo -ChildPath foo -AdditionalChildPath foo, foo, foo # this is how it work formally
    Join-Path foo foo foo foo foo # this is how you could use it in daily life
    ```
- `-Resolve(switch)`: resolve( and validate) the path and join them, supports wildcard to join multiple matches at one time
    ```ps1
    Join-Path ~/Projects nix-config -Resolve # C:\Users\username\Projects\nix-config
    Join-Path ~/Projects .git -Resolve # C:\Users\username\Projects\.git does not exist #  [!code error] 
    Join-Path ~/Projects * -Resolve # equvalent to `Resolve-Path ~/Projects/* | % Path` # [!code highlight] 
    ```
