# String

## Single-line string

```nix
"single"
```

## Multi-line string

When single-line string exceeds column number you want, use multi-line string. 
Leading two spaces are trimmed

```nix
''
  this is a 
  linebreak!
''
```

is equivalent to 

```nix
"this is a \nlinebreak!"
```

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

### Escaping

To escape in multi-line, prefix with `''`

```nix
''
  This is a dollar sign:
  ''$
  This is a new line ''\n
  This is a single quote: ''\'
  This is also a single quote: '''
''
```

## String concatenation

```nix
"foo" + "bar"
```

## String interpolation

```nix
"git path managed by nix: ${pkgs.git}"
```
