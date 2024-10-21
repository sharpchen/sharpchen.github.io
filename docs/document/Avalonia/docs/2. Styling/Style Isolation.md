# Style Isolation

A style in avalonia can be a single file and can be imported into a control.

## Create a isolated style

```bash
dotnet new avalonia.styles -n MyStyle
```

```xml{10-12}
<Styles xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Design.PreviewWith>
        <Border Padding="20">
            <!-- Add Controls for Previewer Here -->
        </Border>   
    </Design.PreviewWith>

    <!-- Add Styles Here -->
    <Style Selector="TextBlock">
        <Setter Property="Background" Value="LightGoldenrodYellow"></Setter>
    </Style>
</Styles>

```

## Importing a style

```xml{9}
<UserControl xmlns="https://github.com/avaloniaui"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             xmlns:control="using:AvaloniaApplication"
             mc:Ignorable="d" d:DesignWidth="800" d:DesignHeight="450"
             x:Class="AvaloniaApplication.MyUserControl">
    <UserControl.Styles>
        <StyleInclude Source="MyStyles.axaml"></StyleInclude>
    </UserControl.Styles>
    <TextBlock Text="Hello from template" TextAlignment="Center"  Width="200" Height="20"/>

</UserControl>

```
