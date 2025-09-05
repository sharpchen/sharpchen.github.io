# Styling

Every `StyledProperty` or `AttachedProperty` can be targeted by styling system.

> [!NOTE]
> Avalonia does not enforce validation on whether a `AvaloniaProperty` can be styled.
> So `DirectProperty` can be targeted too, but it's certainly a bad practice.
> See: https://github.com/AvaloniaUI/Avalonia/issues/6837

## Local Styles

`StyledElement.Styles` is common property to set styles for containing control instance.

```xml
<StackPanel>
  <StackPanel.Styles> <!-- [!code focus] -->
    <Style Selector="Button.small"> <!-- [!code focus] -->
        <Setter Property="FontSize" Value="12" /> <!-- [!code focus] -->
    </Style> <!-- [!code focus] -->
    <Style Selector="Button.big"> <!-- [!code focus] -->
        <Setter Property="FontSize" Value="24" /> <!-- [!code focus] -->
    </Style> <!-- [!code focus] -->
  </StackPanel.Styles> <!-- [!code focus] -->

  <Button Classes="small big" Content="This Has FontSize=24" />
  <Button Classes="big small" Content="This Also Has FontSize=24" />
</StackPanel>
```

## Importing External Styles

<!-- TODO: example -->
```xml
<Styles>
   <!-- style from current assembly -->
  <StyleInclude Source="/Styles/AppStyles.axaml" /> <!-- [!code highlight] -->
   <!-- style from another assembly -->
  <StyleInclude Source="avares://MyApp.Shared/Styles/CommonAppStyles.axaml" /> <!-- [!code highlight] -->
</Styles>
```

> [!NOTE]
> See: https://docs.avaloniaui.net/docs/guides/styles-and-resources/how-to-use-included-styles

## Selector Syntax

Selector syntax is pretty similar to CSS, which could perform hierarchic querying, class querying as well as identifier querying, in a flexible combination.

- `MyControl`: exact type query
- `MyControl, AnotherControl`: multiple query separated by comma
- `MyControl.myclass`: class query
- `MyControl:focus`: pseudo class query, see [Pseudo classes](https://docs.avaloniaui.net/docs/reference/styles/pseudo-classes) for details
- `#MyName`: `Name` identifier query
- `StackPanel > Button.myclass`: direct children query
- `Button[IsPressed=true]`: property query
- `:is(MyControl)`: type query(including derived controls)
- `:is(Control).myclass`: type-less query since any control is of `Control`

> [!TIP]
> `.` was taken for class query, so avalonia uses `|` to access control type from namespace in `Selector` property string, `<namespace>|MyControl` for example.

> [!NOTE]
> See [Selector Syntax](https://docs.avaloniaui.net/docs/reference/styles/style-selector-syntax)

## Styling on Pseudo-Classes

To override value on selector with pseudo-class, avalonia requires some trick syntax `/template/ ...`.
Because all styles have lower priority than local property assignment in xaml, while pseudo class is a event-like status that should be evaluated on runtime.
In the following example, if a `Button` has been declared as `<Button Background="Blue" />`, the first attempt with `Selector="Button:pointerover"` would fail because the local assignment has the highest priority.
That's why we need a dedicated syntax `/template/` to target the nested presenter type, which is the real presentation of the `Button`, this way **distinguished** the `Selector` so we can make it work on `:pointerover` status.
So the presenter is like a shadow for the `Button`, they are really the container and being contained, we just need a way to let the styling system know it's something different so that it can manage the priority separately.

```xml
<Style Selector="Button">
  <Setter Property="Background" Value="Salmon" />
</Style>

<!-- you can't evaluate the effect of a style that has a lower priority --> <!-- [!code warning] -->
<Style Selector="Button:pointerover"> <!-- [!code warning] -->
  <Setter Property="Background" Value="Aquamarine" /> <!-- [!code warning] -->
</Style> <!-- [!code warning] -->

<!-- let styling system style on ContentPresenter instead --> <!-- [!code highlight] -->
<Style Selector="Button:pointerover /template/ ContentPresenter"> <!-- [!code highlight] -->
  <Setter Property="Background" Value="Aquamarine" /> <!-- [!code highlight] -->
</Style> <!-- [!code highlight] -->
```

> [!NOTE]
> See:
> - https://github.com/AvaloniaUI/Avalonia/pull/2662#issuecomment-515764732
> - https://github.com/AvaloniaUI/Avalonia/issues/2726#issuecomment-787748280
> - https://docs.avaloniaui.net/docs/guides/styles-and-resources/troubleshooting#selector-with-a-pseudoclass-doesnt-override-the-default

## Styling on AttachedProperty

<!-- TODO: add example -->

> [!NOTE]
> See: https://github.com/AvaloniaUI/Avalonia/discussions/15091

## ControlTheme

## Style Storage
