#

## Anchor(Hyperlink)

- Normal hyperlink
    - `<a href="https://www.foo.com"></a>{:html}`
- Downloadable hyperlink
    - `<a href="https://www.foo.com/bar.jpg" download></a>{:html}`
    - `<a href="https://www.foo.com/bar/" download></a>{:html}`

> [!IMPORTANT]
> Must specify a protocol for external links.

- Jump to section
    - `<a href="#<element_id>">foo</a>{:html}`
    - `<a href="#">foo</a>{:html}`: jump to top

- Email
    - `<a href="emailto:Iamfoo@gmail.com">Email Me!</a>{:html}`

## Video & Audio

- Auto play video
    - `<video autoplay src="./foo.mp4"></video>{:html}`
- With controls
    - `<video controls src="./foo.mp4"></video>{:html}`
- Looping play
    - `<video loop src="./foo.mp4"></video>{:html}`
- Providing message if client doesn't support `<video>`
    - `<video src="./foo.mp4">Video not supported in your broswer</video>{:html}`

> [!NOTE]
> Same for `<audio>`

## List & Table

List and Table are groups of related elements commonly used together.

### List elements
- `<ul>`: unordered list
- `<ol>`: ordered list
- `<li>`: list item
- `<dl>`: description list
    - `<dt>`: description term
    - `<dd>`: description detail

`<li>` in `<ol>` is ordered, while in `<ul>` is not.

```html
<body>
  <ul>
    <li>foo</li> <!-- [!code highlight] -->
    <li>bar</li> <!-- [!code highlight] -->
    <li>
      <ol>
        <li>1</li> <!-- [!code highlight] -->
        <li>2</li> <!-- [!code highlight] -->
        <li>3</li> <!-- [!code highlight] -->
      </ol>
    </li>
  </ul>
</body>
```

`<dl>` is kind a list of pair of content to be described and the description content.

```html
<body>
  <dl>
    <dt>foo</dt>
    <dd>I am foo</dd>
    <!-- like a pair -->
    <dt>bar</dt>
    <dd>I am bar</dd>
  </dl>
</body>
```

### Table

- `<table>`
    - `<th>`: table header
    - `<tr>`: table row
        - `<td>`: table data
        - other `<td>`...
    - `<thead>`: head of table, just for grouping
    - `<tbody>`: data body of table, just for grouping
    - `<tfoot>`: table footer, can be used for data aggregation like sum of the values

```html
<table>
    <thead>
      <tr>
        <th>name</th>
        <th>age</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>18</td>
      </tr>
      <tr>
        <td>Jane</td>
        <td>18</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>Row Count</th>
        <th>2</th>
      </tr>
    </tfoot>
</table>
```

Should be equivalent to(besides the style):
| name | age |
| -------------- | --------------- |
| John | 18 |
| Jane | 18 |
|Row Count|2|

## Container elements

### Div

### Span

### Article & Figure

- `<article>`
    - `<figure>`: a wrapper for image
        - `<img>`: image contained
        - `<figcaption>`: description for the image
    - `<p>`: just for normal paragraph
        - `<mark>`: mark the content with light yellow background by default
        - `<time>`: mark a time, useful for SEO
