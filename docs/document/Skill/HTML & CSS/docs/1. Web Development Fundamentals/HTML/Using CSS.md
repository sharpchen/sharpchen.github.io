# Using CSS

## Inline css

```html
<p style="color: blue; background-color: yellow;">
    boom!
</p>
```

## Embedded css

```html
<head>
    <style>
        p {
            color: blue;
        }
    </style>
    <style>
        p {
            color: yellow;
        }
    </style>
    <!-- The lastly defined embedded css takes the precedence -->
    <!-- if they sets style for the same target -->
</head>
```

> [!WARNING]
> Embedded css should always defined in `<head>` section.

## External css

- `rel` attribute implies the type of the source imported.
- `href` attribute specifies the source location.

```html
<head>
    <link href="./style.css" rel="stylesheet"/>
    <link href="./foo.css" rel="stylesheet"/>
    <!-- The last imported external css takes the precedence -->
    <!-- if they sets style for the same target -->
</head>
```

## Priorities of css

- The more native css has the higher priority.

Inline css > Embedded css > External css

- For the same type of css defined, the latter one takes the precedence.
