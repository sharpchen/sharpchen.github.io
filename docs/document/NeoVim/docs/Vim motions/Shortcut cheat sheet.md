# Vim motion cheat sheet

## Editing

|Usage|Command|
|---|---|
|close editor|`:q`|
|close editor without save|`:q!`|
|save current file|`:w`|

### Normal mode

|Usage|Motion|
|---|---|
|move cursor one line upward|`k`|
|move cursor one line downward|`j`|
|move cursor one character leftward|`h`|
|move cursor one character rightward|`l`|
|move cursor forward by word|`w`|
|move cursor backward by word|`b`|
|move cursor n lines upward|`<n>k`|
|move cursor n lines downward|`<n>j`|
|move cursor n characters leftward|`<n>h`|
|move cursor n characters rightward|`<n>l`|
|cut a whole line|`dd`|
|delete multiple lines|`d<n><j\|k>`|
|delete a word|`d<w\|b>`|
|delete multiple words|`d<n><w\|b>`|
|undo last manipulation|`u`|
|redo previous manipulation|`ctrl+r`|
|paste text|`p`|
|copy current line|`yy`|
|copy multiple lines|`y<n><k\|j>`|
|jump to next occurrence of character|`f<char>`|
|jump to previous occurrence of character|`F<char>`|
|cut inner word|`ciw`|
|cut inner word inside `""`|`ci"`|
|search for word cursor is on|`*`|

### Visual mode

|Usage|Command|
|---|---|
|copy selected text|`y`|

- Pressing `y` auto switches back to normal mode.
- deleting and copying share the same buffer, so deleting something will overwrite previous copied content.

## Env

|Usage|Command|
|---|---|
|check vim runtime path|`:h rtp`|
|sources current file|`:so`|

## File manipulation

|Usage|Command|
|---|---|
|create a new file|`%`|
|create a new directory|`d`|
|switch back to explorer|`:Ex`|
