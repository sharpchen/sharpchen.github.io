# Create your own nerd font

## Download `font-patcher`

[Nerd font repo](https://github.com/ryanoasis/nerd-fonts) offers a script and resources to generate ner font with existing font.

[Click to download `FontPatcher.zip`](https://github.com/ryanoasis/nerd-fonts/blob/master/FontPatcher.zip)

## Install `Python3`

The `font-patcher` script requires `python3`.

```bash
winget install python -y
```

## Install `fontforge`

Download installer from [FontForge on Windows](https://fontforge.org/en-US/downloads/windows/)

Add new path to `PATH`

```ps1
$env:PATH += ';C:\Program Files (x86)\FontForgeBuilds\bin'
```

## Run patcher script

Redirect to the folder you decompressed

```bash
fontforge --script ./font-patcher --complete <YOUR FONT FILE>
```

Created nerd font will be placed at where the script locates.
