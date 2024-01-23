# Start your first source generator for C #

## Init your source generator project ##

### Create a new classlib project for source generator ###

```bash
dotnet new classlib -n MySourceGenerator
```

### Add dependencies ###

```bash
dotnet add package Microsoft.CodeAnalysis.Analyzers && dotnet add package Microsoft.CodeAnalysis.CSharp
```

### Configure `.csproj` property ###

- Set `TargetFramework` as `netstandard2.0`, it's required, not an option.

> Additionally, set the `LangVersion` as your need, or it will target to `C# 7.3` by default.

```xml{5,8}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netstandard2.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <LangVersion>latest</LangVersion>
    <EnforceExtendedAnalyzerRules>true</EnforceExtendedAnalyzerRules>
  </PropertyGroup>

</Project>

```

## Init your console project for testing your generator ##

### Create a new console project ##

```bash
dotnet new console -n WorkWithSourceGenerator
```

### Reference source generator project in console project ###

Edit your `.csproj` in console project as following.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <ItemGroup>
    <ProjectReference Include="../MySourceGenerator/MySourceGenerator.csproj" OutputItemType="Analyzer" ReferenceOutputAssembly="false" /> // [!code ++]
  </ItemGroup>

</Project>
```

:::tip
In this case, two projects are placed in a same folder.
:::

## Create a new generator ##

Create a new file in generator project, implement `IIncrementalGenerator` for your generator.

```cs
using Microsoft.CodeAnalysis;

namespace MySourceGenerator;

[Generator]
public class HelloSourceGenerator : IIncrementalGenerator
{
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        throw new NotImplementedException();
    }
}

```

:::warning
`ISourceGenerator` should be deprecated since `.NET6`, why is that?
Check out this: [Source generator updates: incremental generators](https://andrewlock.net/exploring-dotnet-6-part-9-source-generator-updates-incremental-generators/)
:::

## Start with `SyntaxProvider` ##

### Filter what syntax node to work with ##

:::info

[Check all syntax api available](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax?view=roslyn-dotnet-4.7.0)

:::
