# TemplatedControl

## TemplateControl is Style

The xaml part of `TemplatedControl` is essentially a predefined styles targeted to the code-behind type.
`TemplatedControl.Template` is of `IControlTemplate`, which is typically typed as `ControlTemplate`.
The xaml representation of `TemplatedControl` is a `ControlTheme`(a sibling type of `Style`) stored in `ResourceDictionary`.
Its value would be loaded by styling system, as what was defined in xaml part.

```cs
public class TemplatedControl : Control {
    /** ... **/
    public static readonly StyledProperty<IControlTemplate?> TemplateProperty =
        AvaloniaProperty.Register<TemplatedControl, IControlTemplate?>(nameof(Template));

    public IControlTemplate? Template {
        get => GetValue(TemplateProperty);
        set => SetValue(TemplateProperty, value);
    }
    /** ... **/
}
```

```xml
<ResourceDictionary
  xmlns="https://github.com/avaloniaui"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:controls="using:MyAva.Views">

  <Design.PreviewWith>
    <StackPanel Width="400" Spacing="10">
      <StackPanel Background="{DynamicResource SystemRegionBrush}">
        <controls:MyTemplatedControl />
        <controls:MyTemplatedControl />
      </StackPanel>
    </StackPanel>
  </Design.PreviewWith>

  <ControlTheme x:Key="{x:Type controls:MyTemplatedControl}" TargetType="controls:MyTemplatedControl">
    <Setter Property="Template">
      <ControlTemplate> <!-- [!code highlight] -->
        <TextBlock Text="Templated Control" /> <!-- [!code highlight] -->
      </ControlTemplate> <!-- [!code highlight] -->
    </Setter>
  </ControlTheme>
</ResourceDictionary>
```

> [!NOTE]
> Before Avalonia 0.11.0, `TemplatedControl` was structured as `Styles`.
>::: details older TemplatedControl presentation
>```xml
><Styles xmlns="https://github.com/avaloniaui"
>        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
>        xmlns:controls="using:MyAva.Views">
>    <Design.PreviewWith>
>        <controls:MyTemplatedControl />
>    </Design.PreviewWith>
>
>    <Style Selector="controls|MyTemplatedControl"> <!-- [!code highlight] -->
>        <!-- Set Defaults -->
>        <Setter Property="Template">
>            <ControlTemplate>
>                <TextBlock Text="Templated Control" />
>            </ControlTemplate>
>        </Setter>
>    </Style>
></Styles>
>```
>:::
