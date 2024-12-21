# String

## Single-line string

```nix
"single"
```

## Interpolation

Nix does not handle string evaluation for all types but string, path and a nix package.
For other types, requires `builtins.toString`.

```nix
"${123}"  # cannot evaluate number to string # [!code error] 
"${builtins.toString 123}" # ok # [!code highlight] 
```

### Evaluation for Package

A package object will be evaluated to the corresponding path in nix store.

```nix
let
    pkgs = import <nixpkgs> { };
in
    "${pkgs.bash}" # /nix/store/p6k7xp1lsfmbdd731mlglrdj2d66mr82-bash-5.2p37
```

### Evaluation for Path

Each evaluation for a path will inform nix to copy the file or directory into nix store.
The final value evaluated will be the path of the copy in nix store.

```console
nix-repl> "${~/projects}"
copying '/home/sharpchen/projects' to the store
```

## Raw String

```nix
''
    <foo>
        I am a xml
    </foo>
''
```

### Syntax Injection

Multi-line string is typically useful to write shell scripts inside `nix`.

```nix
stdenv.mkDerivation {
  postInstall =
    ''
      mkdir $out/bin $out/etc
      cp foo $out/bin
      echo "Hello World" > $out/etc/foo.conf
      ${if enableBar then "cp bar $out/bin" else ""}
    '';
}
```

Some editors support syntax injection for multi-line string. 
Add filetype as comment before the string to inform syntax parser.

```nix
let
foo = # js
  ''
    console.log('hello nix!')
  '';
bar = /* js */ ''
    console.log('hello nix!')
  '';
in {}
```

### Escaping

To escape in multi-line, prefix with `''`

```nix
''
  This is a new line ''\n # [!code highlight] 
  This is a single quote: ''\'
  This is also a single quote: '''
  This is not a interpolation ''${foo} # [!code highlight] 
''
```

## String Concatenation

```nix
"foo" + "bar"
```

