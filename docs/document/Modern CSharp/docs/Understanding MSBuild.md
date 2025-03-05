# Understanding MSBuild

## File Types

- `.*proj`: project file for each project
- `.targets`: shared config for project within a same solution, can be imported to another.
- `.props`: 
- `*.rsp`: msbuild response file,

### Recommended Usage

- `*.targets`
    - set dependent properties
    - override properties

## File Structure

- `<Project>`: Top element
    - `<PropertyGroup>`: static values can be determined before build.
        - child tag can be arbitrary or pre-defined tag
        - use `$(propName)` to retrieve value of a property in any expression-allowed attribute, returns empty string if undefined.
        - has some builtin properties preserved
    - `<ItemGroup>`: items to be included on build, generally are config files
        - each child represents a type of items even when only one item was contained
            - each item in the child **has well-known metadata**
            - children with the same tag name are within a same source(they're just declared separately)
        - use `@(itemType)` to retrieve a list of items from *existing* `<ItemGroup>`
        - has some builtin item types preserved
    - `<Target>`: section to **wrap sub-procedures** and to be invoked during build
        - name it like a function
        - use `Name` attribute to specify a name for it
        - use `DependsOnTargets`, `BeforeTargets`, `AfterTargets` attributes to hook to another target section

> [!NOTE]
> `<PropertyGroup>`, `<ItemGroup>` and `<Target>` could have multiple declarations for better organization or conditional declaration using `Condition` attribute.

## Project Attributes

- `SDK`: sepcify a sdk so that msbuild can prepare dedicated builtin *targets* and *tasks* for corresponding type of project.
> a project with specified `SDK` is sometimes referred as *SDK-style project*

> [!NOTE]
> [Available SDKs](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#available-sdks) 

## Property Section

- reserved properties: pre-defined and cannot be overridden
- well-known properties: pre-defined and can be overridden

> [!NOTE]
> [Reserved & Well-Known Properties](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-reserved-and-well-known-properties?view=vs-2022#reserved-and-well-known-properties)

## Item Section

`<ItemGroup>` section is generally for specifying files to be included on build.
Children under `<ItemGroup>` are not necessarily files, **they can be any list with a name(the tag name) that has items represented as string**.
Attributes for child items are similar to parameters of item-cmdlet in PowerShell.

```xml
<ItemGroup>
  <!-- represents a normal list -->
  <!-- child tag with same name are included within same list -->
  <FooList Include="foo;bar" />
  <FooList Include="baz;qux" />

  <MyFile Include="*.cs"/>
</ItemGroup>
```

### Item Attributes

Item attributes are for controlling how items could be initialized, added and removed to a list

- `Include`: include items on declaration
    - use `KeepMetadata` or `RemoveMetadata` to optionally include or exclude metadata from when **creating items by transforming** from another **within a `<Target>`**
    ```xml
    <ItemGroup>
      <Old Include="*"> <!-- [!code highlight] -->
        <Foo>foo</Foo> <!-- [!code highlight] -->
        <Bar>bar</Bar> <!-- [!code highlight] -->
      </Old> <!-- [!code highlight] -->
    </ItemGroup>

    <Target>
      <ItemGroup>
        <New Include="@(Old)" RemoveMetadata="Foo"/> <!-- transform from Old --> <!-- [!code highlight] -->
      </ItemGroup>
       <!-- Old.Foo was removed after transformation -->
      <Message Text="Old.Foo was removed after transformation" <!-- [!code highlight] -->
        Condition="%(New.Foo) == ''" <!-- [!code highlight] -->
        Importance="high"/> <!-- [!code highlight] -->
    </Target>
    ```
    - use `KeepDuplicates` when adding new item within a `<Target>` that you expect the new would be added when deplicates exist.
    > [!WARNING]
    > The idendity of a item depends on all metadata within it, so as long as one metadata differ, it would not be considered as a duplicate.
    ```xml
    <ItemGroup>
      <FooList Include="foo;bar" />
      <FooList Include="foo;qux" />
    </ItemGroup>

    <Target Name="Hello">
      <ItemGroup>
        <!-- bar would not be added since it already exists in FooList -->
        <FooList Include="bar" KeepDuplicates="false" /> <!-- [!code highlight] -->
      </ItemGroup>
         <!-- foo;bar;foo;qux -->
      <Message Text="@(FooList)" Importance="high"></Message> <!-- [!code highlight] -->
    </Target>
    ```
- `Exclude`: exclude items on declaration
    ```xml
    <ItemGroup>
      <Compile Include="one.cs;three.cs" />
      <Compile Exclude="*.fs" />
    </ItemGroup>
    ```
- `Remove`: remove items after declaration, typically inside a `<Target>` section
    - optionally use `MatchOnMetadata` together to delete base on another type of items
    - optionally use `MatchOnMetadataOptions` to specify the comparing strategy on match
        - `CaseInsensitive`: the default when unspecified
        - `CaseSensitive`
        - `PathLike`: match paths ignoring separator and trailing slash
    ```xml
    <ItemGroup>
        <CSFile Include="Programs.cs"/>
        <CSFile Include="Foo.cs"/>
        <CSFile Include="Bar.cs"/>
        <Proj Include="Foo.csproj"/>
        <Proj Include="bar.csproj"/>
        <Proj Include="Baz.csproj"/>
    </ItemGroup>
    <Target Name="Hello">
        <!-- Proj items are to be matched by metadata FileName -->
        <ItemGroup>
            <CSFile Remove="@(Proj)" <!-- [!code highlight] -->
                MatchOnMetadata="FileName" <!-- [!code highlight] -->
                MatchOnMetadataOptions="CaseSensitive" /> <!-- [!code highlight] -->
        </ItemGroup>
        <!-- Remained cs items: Programs.cs -->
        <Message Text="Remained cs items: %(CSFile.Identity)" Importance="high"></Message>
    </Target>
    ```
- `Update`: update metadata **outside a `<Target>`**
    ```xml
    <ItemGroup>
      <FooList Include="foo;bar;baz">
        <!-- assign FooMetaData to all items in Include -->
        <FooMetaData>this is a foo metadata</FooMetaData>
      </FooList>
      <!-- update FooMetaData for foo and bar -->
      <FooList Update="foo;bar" FooMetaData="this is a bar metadata now!"/> <!-- [!code highlight] -->
    </ItemGroup>

    <Target Name="Hello">
      <Message Text="%(FooList.Identity): %(FooList.FooMetaData)" Importance="high"/>
      <!-- foo: this is a bar metadata now!
           bar: this is a bar metadata now!
           baz: this is a foo metadata -->
    </Target>
    ```

### Item Functions

There's some intrinsic functions to be used to **transform** a item list to another or **get properties** like `Count` of a item list.

> [!NOTE]
> [Item Functions](https://learn.microsoft.com/en-us/visualstudio/msbuild/item-functions?view=vs-2022)

> [!NOTE]
> If a expression includes item enumeration `%(itemType)`, item functions that returns a statistics of list would return result for each **distinct item**
>```xml
><ItemGroup>
>    <FooList Include="foo;bar" />
>    <FooList Include="foo;qux" />
></ItemGroup>
>
><Target Name="Hello">
>    <Message Text="%(FooList.Identity) @(FooList->Count())" Importance="high" /> <!-- [!code highlight] -->
>  <!-- foo 2
>       bar 1
>       qux 1 -->
></Target>
>```

### Default Filters

Builtin item tags like `Compile` has some default wildcards when `SDK` was sepcified.

> [!NOTE]
> [Default Includes and Excludes](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#default-includes-and-excludes) 

### Item Metadata

Each item has pre-defined metadata can be accessed.

> [!NOTE]
> [Well-Known Item Metadata](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-well-known-item-metadata?view=vs-2022)

> [!NOTE]
> If a item does not represent a file, the most of intrinsic metadata would be empty.



## Expression Syntax

Expression syntax in msbuild has some flavor of Command Prompt and PowerShell.

- **Operators**
    - **metadata accessor** `%(itemType.metadataName)`: iterate through the metadata of items for a same action applied on the expression.
    - **reference accessor** `$(propName)`: access properties or environment variable or (property is preferred when names conflict)
        - access a property with its name
        - capture a value calculated from a method call in [a powershell syntax](https://learn.microsoft.com/en-us/visualstudio/msbuild/property-functions?view=vs-2022#msbuild-condition-functions)
        - access [registry item](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-properties?view=vs-2022#registry-properties) with its path
    - **item accessor** `@(itemType)`
        - use `@(itemType, '<sep>')` to concat items using separator
        - use `@(itemType->expr)` to collected transformed values generated by `expr` to a list, `expr` can be a string interpolation or [*item function*](https://learn.microsoft.com/en-us/visualstudio/msbuild/item-functions?view=vs-2022)
        ```xml
        <ItemGroup>
            <MyFile Include="Programs.cs"/>
            <MyFile Include="*.csproj"/>
        </ItemGroup>

        <Target Name="Hello">
         <!-- Collected metadata: Program.cs; ConsoleApp.csproj -->
         <Message Text="Collected metadata: @(MyFile->'%(FileName)%(Extension)')"  <!-- [!code highlight] -->
                  Importance="high" /> <!-- [!code highlight] -->
         <Message Text="Exists: @(MyFile->Count())" <!-- 5 --> <!-- [!code highlight] -->
                  Importance="high" /> <!-- [!code highlight] -->
        </Target>
        ```

### Escaping

For [special characters](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-special-characters?view=vs-2022#special-characters), you may figure out its ASCII representation by: 

```ps1
[System.Uri]::EscapeDataString('"') # %22
```

> [!TIP]
> Notation like `&quot;` is also viable

## Conditional Component

[Some elements supports conditional include](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-conditions?view=vs-2022#supported-elements) using `Condition` attribute.
So one could include dedicated part of the config for different build scenarios.

```xml
<ItemGroup Condition="'$(DotNetBuildSourceOnly)' == 'true'"> <!-- [!code highlight] -->
    <PackageVersion Include="Microsoft.Build" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Framework" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Tasks.Core" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Utilities.Core" Version="17.3.4" />
</ItemGroup>

<ItemGroup Condition="'$(DotNetBuildSourceOnly)' != 'true' and '$(TargetFramework)' != 'net472'"> <!-- [!code highlight] -->
  <PackageVersion Include="Microsoft.Build" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Framework" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Tasks.Core" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Utilities.Core" Version="17.7.2" />
</ItemGroup>
```

## Builtin Variables

## Target Section

A task is a pre-defined procedure to be executed in `<Target>` section in their declared order.
The containing `Target` is like a function which must have a name while a task is just named as its tag.
MSBuild ships with some builtin task to be used out of box. 

```xml
<Target>
  <Csc
    Sources="@(Compile)"
    OutputAssembly="$(AppName).exe"
    EmitDebugInformation="true" />
</Target>
```

> [!NOTE]
> See: [MSBuild Task Reference](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-task-reference?view=vs-2022#in-this-section)

### Task Hooks

- `DependsOnTargets`

### Custom Task

MSBuild tasks are defined in certain language like csharp. You can implement one or some as nuget package.
Or you can implement one using [inline task](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-inline-tasks?view=vs-2022#the-structure-of-an-inline-task) directly within the config file.

> [!NOTE]
> See: [Task Writing](https://learn.microsoft.com/en-us/visualstudio/msbuild/task-writing?view=vs-2022)

### Update Metadata in Target

Such approach seems to only allow updating on all existing items since `Include` could try to add new items and new metadata would result them to be duplicates.

```xml
  <ItemGroup>
    <FooList Include="foo;bar;baz">
      <FooMetaData>this is a foo metadata</FooMetaData>
    </FooList>
  </ItemGroup>

  <Target Name="Hello">
    <ItemGroup>
      <FooList> <!-- no Include here --> <!-- [!code highlight] -->
        <!-- update all existing items from FooList -->
        <FooMetaData>this is a bar metadata now!</FooMetaData> <!-- [!code highlight] -->
      </FooList>
    </ItemGroup>

    <Message Text="%(FooList.Identity): %(FooList.FooMetaData)" Importance="high"/> <!-- [!code highlight] -->
     <!-- foo: this is a bar metadata now!
          bar: this is a bar metadata now!
          baz: this is a bar metadata now! -->
  </Target>
```

## Importing

- `*.props` should be imported in early stage
- `*.targets`: should be imported in build stage

## Evaluation Order

MSBuild files are order sensitive, order matters when properties and items may dependent on each other.


1. environment variables: they're stored as properties
2. imports & properties: evaluated by their declaration order
    - so, the order between imports and properties matters if you inter-reference them on expression
3. definition of items: how should item were filtered out and captured.
4. items: execute the process to fetch items and their metadata
5. inline tasks
6. targets: as well as items inside targets

## Folder-Specific Config

`Directory.Build.props` and `Directory.Build.targets` are special config files that could be auto-imported by msbuild.
Such file is a **template** rather than a static store for values, so the containing properties and tasks **could vary for each project**.
MSBuild would search upward for each aforementioned config file **until one was found**, it doesn't stop on solution root until it reaches the **drive root**

```xml
<!-- Directory.Build.props at solution root -->
<Project>
  <PropertyGroup>
    <!-- MSBuildProjectName varies for each project -->
    <!-- so it's not static even as a property -->
    <OutDir>C:\output\$(MSBuildProjectName)</OutDir>
  </PropertyGroup>
</Project>
```

`Directory.Build.props` is imported early in `Microsoft.Common.props` which is the default config for sdk-style projects, so properties in `Directory.Build.props` should not be dependent on other 

> [!TIP]
> - use `dotnet new buildprops` to create `Directory.Build.props`
> - use `dotnet new buildtargets` to create `Directory.Build.targets`


## MSBuild CLI

MSBuild cli was wrapped as `dotnet msbuild [-options]`

- `-p:<prop>=<value>`: override a property value(namely global property)
- `-t:<target>`: trigger a target(and its dependent hooks)
