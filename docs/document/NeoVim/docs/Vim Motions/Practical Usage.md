# Practical Usage

## Delete code block

Let a code block as following, sometimes you have to delete the whole function body or a whole certain level.
Try deleteing the whole block with **just one keymap**!

:::code-group
```js[before]
function foo() {
    // delete me!
    return { // [!code --] 
        foo: 'foo', // [!code --] 
        bar: { // [!code --] 
            baz: 'baz' // [!code --] 
        } // [!code --] 
    }  // [!code --] 
}
```

```js[after]
function foo() {
}
```
:::

### Solution

- `di{`

`di{` deletes the content inside the nearest `{}` pair. **So make sure you have your cursor in the right place, or it will delete a unexpected level.**

:::info
`di` can combine with many punctuation like `'`, `"`, `<`, `(`, `[`
:::

:::info
`di{` is equivalent to `di}`, same for others
:::

## Delete a xml tag content

:::code-group
```xml[before]
<foo>
    <foo>
        foooooooooo
        <bar>
            barrrrrrrr
        </bar>
    </foo>
</foo>
```

```xml[after]
<foo></foo>
```
:::

### Solution

- `dit`
