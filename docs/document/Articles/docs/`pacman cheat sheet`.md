# `pacman` cheat sheet

## Cheat sheet

|usage|command|
|---|---|
|install packages|`pacman -S <packages>`|
|list install packages|`pacman -Q`|
|list explicitly installed packages|`pacman -Qe`|
|uninstall packages|`pacman -R <packages>`|
|uninstall packages cascade|`pacman -Rc <packages>`|
|uninstall packages and its unused dependencies|`pacman -Rs <packages>`|
|search package|`pacman -Ss <regex>`|
|Removing unused packages|`pacman -Qdtq \| pacman -Rns -`|
