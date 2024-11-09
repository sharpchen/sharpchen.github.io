# Adding New Style

## With dotnet cli

```sh
dotnet new avalonia.styles -o Styles -n NewStyle
```

## Default Template

Style template ships with a portion for previewer where you can add testing controls to see whether those styles works properly.

```xml
<Styles xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
  <Design.PreviewWith> <!-- [!code highlight]  -->
    <Border Padding="20"> <!-- [!code highlight]  -->
      <!-- Add Controls for Previewer Here --> <!-- [!code highlight]  -->
    </Border> <!-- [!code highlight]  -->
  </Design.PreviewWith> <!-- [!code highlight]  -->

  <!-- Add Styles Here -->
</Styles>
```

## Define a Style

A style starts with a `Selector` which is the rule of target matching, for figuring out which control should have those contained styling.
Contained styling is some key-value pair on properties.

> [!NOTE]
> See [selector syntax]()

```xml
<Styles xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
  <Design.PreviewWith> <!-- [!code highlight]  -->
    <Border Padding="20"> <!-- [!code highlight]  -->
      <!-- Add Controls for Previewer Here --> <!-- [!code highlight]  -->
    </Border> <!-- [!code highlight]  -->
  </Design.PreviewWith> <!-- [!code highlight]  -->

  <!-- Add Styles Here -->
  <Style Selector="TextBlock.h1"> <!-- [!code ++]  -->
    <Setter Property="FontWeight" Value="Bold" /> <!-- [!code ++]  -->
    <Setter Property="FontSize" Value="15" /> <!-- [!code ++]  -->
    <Setter Property="Margin" Value="5" /> <!-- [!code ++]  -->
  </Style> <!-- [!code ++]  -->

</Styles>
```
