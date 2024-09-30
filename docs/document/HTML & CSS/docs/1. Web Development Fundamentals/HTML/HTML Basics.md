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

A common structure of html:

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
        - `<header>`
             - `<nav>`: navigation
        - `<main>`: main page in the middle, shoule be unique
            - `<section>`: different sections in main page
        - `<aside>`: can be a sidebar like toc in left or right
        - `<footer>` 

> [!IMPORTANT]
> It's just an example! It can be any form.

## Metadata

`<meta>` is used for defining a many metadata of the html page.
`name` attribute as the key, `content` attribute is the value for the metadata.

- `viewport`: visible area

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- [!code highlight]  -->
  <title>I am foo</title>
</head>
</html>
```

- `keywords`: simply for SEO, not really useful in these days.

`<meta name="keywords" content="typescript, tutorial">{:html}`

- `desc`: description for the page, should be shown in search results.

`<meta name="desc" content="a tutorial website">{:html}`

## HTML entities

A escaping for characters.

`&nbsp;{:html}` for example.

> [!TIP]
> [Full list of HTML entities](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references) 
