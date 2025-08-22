# Data Binding

## Binding Markup Extensions

- `Binding`
- `CompiledBinding`
- `MultiBinding`
- `ReflectionBinding`
- ...

TODO: each binding markup is an extension type, how does it work?
https://docs.avaloniaui.net/docs/concepts/markupextensions

## Bind from Another Control

```xml
<TextBox Name="MyBox" Text="Bind me!">

<TextBlock Text="{Binding #MyBox.Text}" /> <!-- [!code highlight] -->
```

## Relational Binding

- `$parent`: direct parent
```xml
<Border Tag="Hello World!">
  <TextBlock Text="{Binding $parent.Tag}" /> <!-- [!code highlight] -->
</Border>
```
- `$parent[<idx>]`: any level of indirect parent, `idx` is `0` based
    - `$parent[0]` is equivalent to `$parent[0]`
```xml
<Border Tag="Hello World!">
  <Border>
    <TextBlock Text="{Binding $parent[1].Tag}" /> <!-- [!code highlight] -->
  </Border>
</Border>
```
- `$parent[<type>]`: the first parent of given type
```xml
<local:MyControl Tag="Hello World!">
  <Decorator>
    <TextBlock Text="{Binding $parent[local:MyControl].Tag}" /> <!-- [!code highlight] -->
  </Decorator>
</local:MyControl>
```


> [!NOTE]
> See [Binding To Controls](https://docs.avaloniaui.net/docs/guides/data-binding/binding-to-controls)

## Collection Binding

<!--TODO: https://docs.avaloniaui.net/docs/guides/data-binding/how-to-bind-to-a-collection -->

## Bind From Code

<!-- TODO: https://docs.avaloniaui.net/docs/guides/data-binding/binding-from-code -->
