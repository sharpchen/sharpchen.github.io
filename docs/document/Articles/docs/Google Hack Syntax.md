# Google Hack Syntax

## Operators

- `NOT` or `-`: exclude a word from search result
- `OR` or `|`: match one of the phrase, `foo | bar | baz`
- `"<phrase>"`: exact match
- `()`: group any expression
    ```txt
    # foo is mandatory, bar and baz are optional
    foo (bar | baz)
    ```
- `.`: any character
- `*`: any phrase

> [!TIP]
> Use `""` to represent raw string when you need to contain any special character above in your query

## Keywords

> [!NOTE]
> Do not leave spaces between keyword operator and the followed query
> You can use exact match `""` after keyword operator
> Wildcard not allowed in query after keyword operator

> not a exhaustive list but practical enough

- `intitle:`: contains phrase in title
- `inurl:`: match phrase in page url
- `intext:`: match phrase in `<body>` section of a page
- `inanchor:`: match links of anchors in the page
- `site:`: match by top-level domain
- `cache:`: finds snapshot of page, specify url after it
- `filetype:`: specify only one filetype, use `OR` if multiple filetypes are desired

## Best Practice

Ordering your query by `<normal query>[<operator options>][<keyword options>]` would be the best practice

```
I need foo -bar site:foo intitle:foo
```
