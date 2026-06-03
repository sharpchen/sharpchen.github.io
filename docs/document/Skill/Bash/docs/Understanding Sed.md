# Understanding Sed

> [!IMPORTANT]
> This page specific to GUN `sed`.
> See [documentation](https://www.gnu.org/software/sed/manual/sed.html)

## Syntax

`sed` as a **Stream Editor** can do every basic editor modification, such as substitution, insertion, appendage etc.
It's an editor operated with pure text command without user interface.

The `sed` expression can have four components, range, command, pattern and operator,
where range cannot function on its own, it must combine with either command or pattern, or both.

```
[range][command][pattern][operator]
```

Despite the classic separator `/`, `sed` supports other single byte characters as separator, however seems to be undocumented on its man page.
This is documented on vim's `:h :g`(whose substitution inherited the syntax of `sed`):

> Instead of the '/' which surrounds the {pattern}, you can use any other
> single byte character, but not an alphabetic character, '\\', '"', '|' or '!'.

```sh
# They're equivalent:
ls | sed 's/foo/bar/'
ls | sed 's,foo,bar,'
ls | sed 's?foo?bar?'
```

A `sed` expression can have no pattern. When there's no pattern, every command or operator become a pure operation that can be combined on arbitrary order.
Each operation/script are separated by `;`.

```sh
# n is an command, p is an operator
# print current line and skip next line
seq 10 | sed -n 'p;n'
# skip current line and print next line
seq 10 | sed -n 'n;p'
```

A range can have multiple commands applied, by grouping them within `{}`

```sh
seq 10 | sed -n '2{ s/./x/ ; p }' # x
```

### Operators

An operator is a switch/flag that might accept a number/count.

1. `g`: substitute all matches

```sh
echo "foo foo foo foo" | sed 's/foo/bar/g' # bar bar bar bar
# replace all from the 3rd match
echo "foo foo foo foo" | sed 's/foo/bar/3g' # foo foo bar bar
```

2. `n`: substitute only the nth match
3. `I|i`: case-insensitive
4. `q`: quit(terminate) the printing, inclusively

```sh
ls | sed '10q'
# equivalent to
ls | head -10

# terminate printing on first match of `foo`(inclusive)
ls | sed '/foo/q'
ls | sed '/foo/q123' # quit with exit code 123
```

5. `Q`: quit(terminate) the printing, exclusively

```sh
seq 10 | sed '2Q' # 1
```

6. `d`: delete lines

```sh
ls | sed '/foo/d' # filter out on `foo` matched
ls | sed '1d' # skip first line

# skip first 10 lines
ls | sed '1,10d'
ls | tail -n +11
```

7. `p`: print lines matching expression
8. `=`: print line numbers(1-based index) instead

```sh
ls | sed -n '/foo/=' # indices of lines matching `foo`
```

9. `z`: empty current line

```sh
seq 3 | sed '2z' # replace second line with empty string
# equivalent to
seq 3 | sed '2s/.*//'
```

### Range

Range is a filter expression.

- `$`: last line
- `n,m`: `n` to `m`, inclusive
- `n,+m`: `n` to `n+m`, inclusive
- `n~m`: start from `n`, range keep jumping with step `m`
- `n,~m`: start from `n`, keep jumping to next one that is multiples of `m`
- `/<pattern>/`: every line matching the pattern
- `n,/<pattern>/`: start from `n` to the first line matches `<pattern>`
- `<range>!`: reverse range by `!`

```sh
seq 10 | sed -n '5,10p' # print 5-10th lines
seq 20 | sed -n '5,+10p' # print 5-15th lines
seq 20 | sed -n '5,~4p' # print from 6th to next line number that is of multiples of 4
seq 10 | sed -n '1~3p' # 1 4 7 10
seq 20 | sed -n '4,17!p' # excluding 4-17th lines
seq 10 | sed '2d' # delete the second line of the input

sed '/fullname/s/John/Jane/' file.txt # replace `John` to `Jane` only on lines match `fullname`

# start from 10th line, till the first line matches the pattern
seq 20 | sed -n '10,/[0-9]/p' # 10 11
```

> [!NOTE]
> Unlike command `s`, to use any delimiter and apply flags for pattern range, see [documentation](https://www.gnu.org/software/sed/manual/sed.html#selecting-lines-by-text-matching)

> [!NOTE]
> By `n,/<pattern>/` you might think of it as a range starting from `n` and includes every line matches `<pattern>`.
> That's indeed intuitive way to think it, but we already have `d` operator to do that. `n,/<pattern>/` is a supplement to the missing feature.
>
> ```sh
> seq 20 | sed -n '1,9d; /<pattern>/p'
> ```

> [!NOTE]
> `sed` always print every line unless deleted with `d` operator.
> `-n|--quite` is to suppress the default printing but keep the printing of explicit `p` operator.

### Commands

An command either instructs the **scanning behavior** or must have a **following context** to perform certain action.

1. `s`: substitute

```sh
ls | sed '5,10s/foo/bar/' # substitute 5th-10th lines
# substitute only the 3rd match
echo "foo foo foo foo" | sed 's/foo/bar/3' # foo foo bar foo
```

2. `n`: handle next line instead(meaning skip current line)

```sh
# print even lines as odd are skipped
seq 10 | sed 'n;p' # 2 4 6 8 10
```

3. `i`: prepend line to given range

```sh
seq 2 | sed '2i foo' # 1 foo 2
```

4. `a`: append line to given range

```sh
seq 2 | sed '2a foo' # 1 2 foo
```

5. `y`: replace character by given mapping

```sh
# foo -> 6oo
echo 'foo' | sed 'y/abcdefg/1234567/'
```

6. `c`: replace whole line instead of matching range

```sh
# replace 2nd to 6th lines as one `foo`
# meaning 2-6th lines are combined with one line `foo`
seq 10 | sed '2,6c foo'

# replace whole line to ???
echo 'foo bar' | sed '/foo/c ???'
```

## Deleting & Excluding Lines

We can exclude entires using `sed` with `d` operator:

```sh
seq 10 | sed '/[1-8]/d' # 9
```

> [!NOTE]
> `grep` can filter lines as well with `-v|--invert-match`
>
> ```sh
> seq 10 | grep '[1-8]' -v
> ```

As well as deleting matching lines from source file.

```sh
sed -i "/$pattern/d" "${file}"
sed -i -E "/\bgit\b/d" "$HISFILE" # delete lines with word git from history
```

## Take Lines

### Take First

```sh
ls | sed '10q'
# equivalent to
ls | head -10
```

### Take Last <Badge type="warning" text="Not Recommended" />

> [!WARNING]
> Do not use `sed` to skip as it's very very complicated, just use `tail -n <positive>`.

### Take in Middle

```sh
ls | sed '/'
```

## Skip Lines

### Skip First

```sh
ls | sed '1d' # skip first line

# skip first 10 lines
ls | sed '1,10d'
ls | tail -n +11
```

### Skip Last <Badge type="warning" text="Not Recommended" />

> [!WARNING]
> Do not use `sed` to skip as it's very very complicated, just use `head -n <negative>`.

### Skip in Middle

```sh
ls | sed '5,10d' # skip 5-10th
```
