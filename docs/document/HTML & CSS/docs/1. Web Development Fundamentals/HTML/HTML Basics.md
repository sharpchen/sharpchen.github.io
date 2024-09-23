# HTML Basics

## Document type declaration

The Document Type Declaration (DOCTYPE) is an instruction that defines the type of document being used and specifies the version of HTML or XHTML that the document is written in.
It is placed at the very top of an HTML document before the `<html>` tag.
The DOCTYPE helps browsers render the page correctly and ensures that the document adheres to the rules of the specified version.

Before HTML5, the instruction is really long.

- HTML 4.01 Transitional:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

- HTML 4.01 Strict:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Strict//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

- XHTML 1.0 Transitional:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

Since HTML5 we got a more concise syntax.

- HTML5:

```html
<!DOCTYPE html>
```

> [!TIP]
> HTML is not case sensitive, so `<!doctype HTML>` is fine too.

## Structure of html

- `<!DOCTYPE ..>`
- `<html>`
    - `<head>`
        - `<meta>`: provides metadata about the document
        - `<link>`: links to external stylesheets or other resources
        - `<base>`: specifies a base URL for all relative URLs in the document
        - `<title>`: the title of the document that appears in the browser tab
        - `<style>`: internal css
        - `<script>`: links to or contains JavaScript code.
    - `<body>`: the actually page
        - other elements...
