# Understanding MSBuild

## File Types

- `.*proj`: project identifier file for each project
- `.props`: shared config to be imported at the beginning of the project file
- `.targets`: shared config to be imported at the end of the project file
- `.rsp`: [msbuild response file](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-response-files?view=vs-2022), default options for msbuild cli so you don't have to repeat them on each build

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
    - `<ItemDefinitionGroup>`: define a new shape of item with default metadata
    - `<Target>`: section to **wrap sub-procedures** and to be invoked during build
        - name it like a function
        - use `Name` attribute to specify a name for it
        - use `DependsOnTargets`, `BeforeTargets`, `AfterTargets` attributes to hook to another target section

> [!NOTE]
> `<PropertyGroup>`, `<ItemGroup>` and `<Target>` could have multiple declarations for better organization or conditional declaration using `Condition` attribute.

## Project Attributes

- `SDK`: specify a sdk so that msbuild can prepare dedicated builtin *targets* and *tasks* for corresponding type of project.
     > [!NOTE]
     > - a project with specified `SDK` is referred as *SDK-style project*
     > - a `<Project>` with `SDK` would auto import standard `*.targets` and `*.props`
     > - you could find standard config files from `${DOTNET_ROOT}/sdk/<dotnet_version>/Sdks/<sdk_name>/`

- `InitialTargets`: a list of targets should run first on build
- `DefaultTargets`: a list of targets should run after `InitialTargets` **when no any target specified from msbuild cli**

> [!NOTE]
> [Available SDKs](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#available-sdks)

## Property Section

Two kinds of properties:

- reserved properties: pre-defined and cannot be overridden,
- well-known properties: pre-defined and can be overridden
- properties set by specified sdk, all other sdk inherits from `Microsoft.NET.Sdk`, see: [.NET project SDKs](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview?view=aspnetcore-9.0)

> [!NOTE]
> [Reserved & Well-Known Properties](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-reserved-and-well-known-properties?view=vs-2022#reserved-and-well-known-properties)

### Property Functions

> [!NOTE]
> [Property Functions](https://learn.microsoft.com/en-us/visualstudio/msbuild/property-functions?view=vs-2022)

### Merge Properties

```xml
<PropertyGroup>
    <Foo>foo;bar</Foo>
    <!-- override self with interpolating itself -->
    <Foo>$(Foo);baz</Foo>
</PropertyGroup>

<Target>
  <!-- foo;bar;baz -->
  <Message Text="$(Foo)" Importance="high"/>
</Target>
```

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
      <Old Include="*">
        <Foo>foo</Foo>
        <Bar>bar</Bar>
      </Old>
    </ItemGroup>

    <Target>
      <ItemGroup>
        <New Include="@(Old)" RemoveMetadata="Foo"/> <!-- transform from Old -->
      </ItemGroup>
       <!-- Old.Foo was removed after transformation -->
      <Message Text="Old.Foo was removed after transformation"
        Condition="%(New.Foo) == ''"
        Importance="high"/>
    </Target>
    ```
    - use `KeepDuplicates` when adding new item within a `<Target>` that you expect the new would be added when duplicates exist.
    > [!WARNING]
    > The identity of an item depends on all metadata within it, so as long as one metadata differ, it would not be considered as a duplicate.
    ```xml
    <ItemGroup>
      <FooList Include="foo;bar" />
      <FooList Include="foo;qux" />
    </ItemGroup>

    <Target Name="Hello">
      <ItemGroup>
        <!-- bar would not be added since it already exists in FooList -->
        <FooList Include="bar" KeepDuplicates="false" />
      </ItemGroup>
         <!-- foo;bar;foo;qux -->
      <Message Text="@(FooList)" Importance="high"></Message>
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
            <CSFile Remove="@(Proj)"
                MatchOnMetadata="FileName"
                MatchOnMetadataOptions="CaseSensitive" />
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
      <FooList Update="foo;bar" FooMetaData="this is a bar metadata now!"/>
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
>    <Message Text="%(FooList.Identity) @(FooList->Count())" Importance="high" />
>  <!-- foo 2
>       bar 1
>       qux 1 -->
></Target>
>```

### Default Filters

Builtin item tags like `Compile` has some default wildcard when `SDK` was specified.

> [!NOTE]
> [Default Includes and Excludes](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#default-includes-and-excludes)

### Item Metadata

Each item has pre-defined metadata can be accessed.

> [!NOTE]
> [Well-Known Item Metadata](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-well-known-item-metadata?view=vs-2022)

> [!NOTE]
> If a item does not represent a file, the most of intrinsic metadata would be empty.

#### Metadata Mutation

Metadata should be mutated by batching using a `Condition` within a `<Target>`

```xml
  <ItemGroup>
    <Foo Include="2" Bar="foo" />
    <Foo Include="1" Bar="bar" />
  </ItemGroup>

  <Target Name="Foo">
    <ItemGroup>
      <Foo Condition=" '%(Bar)' == 'blue' ">
        <Bar>baz</Bar>
      </Foo>
    </ItemGroup>
  </Target>
```

### Common Items

- `Reference`: reference to dll files
- `PackageReference`: reference packages to be restored by nuget
- `ProjectReference`: reference project by project file, builds projects cascading
- `Compile`: what source files to be included during compilation
    - `*.{cs,vb,fs}` are implicitly included by `<Compile>` depending on the project type
    ```console
    $ dotnet msbuild ./foo.csproj -getItem:Compile
    {
      "Items": {
        "Compile": [
            ...
        ]
    }
    ```
- `Using`: extra global using by specifying namespaces
```xml
<ItemGroup>
  <Using Include="System.IO.Pipes" />
</ItemGroup>
```

> [!NOTE]
> For more common item names, see [Common MSBuild project items](https://learn.microsoft.com/en-us/visualstudio/msbuild/common-msbuild-project-items?view=vs-2022)

## ItemDefinitionGroup Section

```xml
  <ItemDefinitionGroup>
    <Foo>
      <!-- metadata Bar has default value bar -->
      <Bar>bar</Bar>
    </Foo>
  </ItemDefinitionGroup>

  <ItemGroup>
    <Foo Include="foo"></Foo>
  </ItemGroup>

  <Target Name="Hello">
    <!-- bar -->
    <Message Text="%(Foo.Bar)" Importance="high"/>
  </Target>
```

> [!NOTE]
> [ItemDefinitionGroup](https://learn.microsoft.com/en-us/visualstudio/msbuild/item-definitions?view=vs-2022)

## Expression Syntax

Expression syntax in msbuild has some flavor of Command Prompt and PowerShell.

- **Operators**
    - **metadata accessor** `%(itemType.metadataName)`: iterate through the metadata of items for a same action applied on the expression.
    - **reference accessor** `$(propName)`: access properties or environment variable or (property is preferred when names conflict)
        - access a property with its name
        - capture a value calculated from a method call in [a powershell syntax](https://learn.microsoft.com/en-us/visualstudio/msbuild/property-functions?view=vs-2022#msbuild-condition-functions)
        - access [registry item](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-properties?view=vs-2022#registry-properties) with its path
    - **item accessor** `@(itemType)`
        - use `@(itemType, '<sep>')` to concatenate items using separator
        - use `@(itemType->expr)` to collected transformed values generated by `expr` to a list, `expr` can be a string interpolation or [*item function*](https://learn.microsoft.com/en-us/visualstudio/msbuild/item-functions?view=vs-2022)
        ```xml
        <ItemGroup>
            <MyFile Include="Programs.cs"/>
            <MyFile Include="*.csproj"/>
        </ItemGroup>

        <Target Name="Hello">
         <!-- Collected metadata: Program.cs; ConsoleApp.csproj -->
         <Message Text="Collected metadata: @(MyFile->'%(FileName)%(Extension)')"
                  Importance="high" />
         <!-- 5 -->
         <Message Text="Exists: @(MyFile->Count())"
                  Importance="high" />
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
<ItemGroup Condition="'$(DotNetBuildSourceOnly)' == 'true'">
    <PackageVersion Include="Microsoft.Build" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Framework" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Tasks.Core" Version="17.3.4" />
    <PackageVersion Include="Microsoft.Build.Utilities.Core" Version="17.3.4" />
</ItemGroup>

<ItemGroup Condition="'$(DotNetBuildSourceOnly)' != 'true' and '$(TargetFramework)' != 'net472'">
  <PackageVersion Include="Microsoft.Build" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Framework" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Tasks.Core" Version="17.7.2" />
  <PackageVersion Include="Microsoft.Build.Utilities.Core" Version="17.7.2" />
</ItemGroup>
```

## Target Section

A task is a pre-defined procedure to be executed in `<Target>` section in their declared order.
The containing `Target` is like a function which must have a name while a task is just named as its tag.
MSBuild ships with some builtin task to be used out of box.

```xml
<Target>
  <!-- Csc is a builtin task from sdk -->
  <Csc
    Sources="@(Compile)"
    OutputAssembly="$(AppName).exe"
    EmitDebugInformation="true" />
</Target>
```

> [!NOTE]
> See: [MSBuild Task Reference](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-task-reference?view=vs-2022#in-this-section)

### Builtin Targets

MSBuild has some pre-defined targets to perform common actions like `Build`, `Clean`...
Targets starts with `After` and `Before` are preserved to be overridden as a hook on specific target, such as `AfterBuild` and `BeforeBuild` are hooks on `Build`.

> [!NOTE]
> Use `dotnet msbuild -targets|-ts [proj]` to check existing targets(including builtin) from a project file.
>```ps1
># filter out internal targets starts with _
>dotnet msbuild -targets | where { $_ -notmatch '^_' }
>```

### Target Hooks

- `DependsOnTargets`: this target must be executed after the specified target
- `BeforeTarget`

### Custom Task

MSBuild tasks are defined in certain language like `C#`. You can implement one or some as nuget package.
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
      <FooList> <!-- no Include here -->
        <!-- update all existing items from FooList -->
        <FooMetaData>this is a bar metadata now!</FooMetaData>
      </FooList>
    </ItemGroup>

    <Message Text="%(FooList.Identity): %(FooList.FooMetaData)" Importance="high"/>
     <!-- foo: this is a bar metadata now!
          bar: this is a bar metadata now!
          baz: this is a bar metadata now! -->
  </Target>
```

### Emit Property and Item from Task

- one task could emit multiple items and properties(use multiple `<Output>`)
- the task supports output parameter(specific value for `TaskParameter`)
    - search `output parameter` to check available `TaskParameter` on documentation of a task
- use `PropertyName` or `ItemName` attribute to specify the name to emit

```xml
  <ItemGroup>
    <NewDir Include="foo;bar" />
  </ItemGroup>

  <Target>
    <MakeDir Directories="@(NewDir)">
      emit DirCreated property with the value of DirectoriesCreated
      <Output TaskParameter="DirectoriesCreated" ItemName="DirCreated"/>
    </MakeDir>
    <!-- log out new property -->
    <Message Text="@(DirCreated)" Importance="high"/>
  </Target>
```

## Import & Evaluation Order

The only file msbuild cares for build is the `*.*proj` file, all other files are just imports within it.
The evaluation happens upon the project file, and splits the file into a process with priorities for different section.

### SDK Style

Aforementioned SDK-style project has implicit `<Import>` for standard `props` and `targets`.

- standard `props` were imported

### Evaluation

> [!NOTE]
> [Evaluation Phase](https://learn.microsoft.com/en-us/visualstudio/msbuild/build-process-overview?view=vs-2022#evaluation-phase)

MSBuild files are order sensitive, order matters when properties and items may dependent on each other.
MSBuild merges imported config files and *proj* file into one object, and then evaluate all values of different parts.

1. **environment variables:** they're stored as properties
2. **imports & properties:** evaluated by their declaration order
    - when evaluating a import, the **evaluation process** applies to it **recursively**.
    - the order between imports and properties matters if you inter-reference them on expression
    - never reference items on properties not within a target
3. **definition of items:** how should item were filtered out and captured.
4. **items:** execute the process to fetch items and their metadata
5. inline tasks(`<UsingTask>`)
6. **targets:** as well as items inside targets

> [!IMPORTANT]
> Expressions are lazily evaluated until the identifier been referenced got evaluated.
> So any expression to be evaluated on evaluation time(*not within a target*) would be like a template.
> That is to say, the order doesn't matter when you inter-reference items and properties.
> See: [Subtle effects of the evaluation order](https://learn.microsoft.com/en-us/visualstudio/msbuild/comparing-properties-and-items?view=vs-2022#subtle-effects-of-the-evaluation-order)
>```xml
>  <PropertyGroup>
>  <!-- reference before FooList were evaluated -->
>    <Foo>@(FooList)</Foo>
>  </PropertyGroup>
>
>  <ItemGroup>
>    <FooList Include="foo;bar"/>
>  </ItemGroup>
>
>  <Target Name="Hello">
>    <!-- foo;bar -->
>    <Message Text="$(Foo)" Importance="high"></Message>
>  </Target>
>```


## Folder-Specific Config

Folder-Specific config files includes:

- `Directory.Build.props`: content to be imported before standard config automatically for current or child folders
- `Directory.Build.targets`: content to be imported after content of project file automatically for current or child folders
- `Directory.Build.rsp`: default options for msbuild cli to be passed automatically on each build
    ```
    # inside rsp file
    -v:diag -t:Clean
    ```
- `Directory.Packages.props`: for central package management, fixed version by `<PackageVersion>`
    ```xml
      <PropertyGroup>
        <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
      </PropertyGroup>
      <ItemGroup>
        <PackageVersion Include="Newtonsoft.Json" Version="13.0.1" />
      </ItemGroup>
    ```

> [!NOTE]
> [Introducing Central Package Management](https://devblogs.microsoft.com/nuget/introducing-central-package-management/)

All these kind of config are special config files that would be auto-imported by msbuild at certain phase.
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

### Best Practice

- `Directory.Build.props`: imported before standard msbuild config
    - to set **independent** properties
    - to set conditional items

- `Directory.Build.targets`: imported after standard
    - to override properties
    - to set **dependent** properties
    - to set targets

- `$(MSBuildProjectFullPath).user`: extra config specific to local machine, should not be included in source control

> [!TIP]
> - use `dotnet new buildprops` to create `Directory.Build.props`
> - use `dotnet new buildtargets` to create `Directory.Build.targets`
> - use `dotnet new packagesprops` to create `Directory.Packages.props`

## MSBuild CLI

> [!NOTE]
> [MSBuild CLI Reference](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-command-line-reference?view=vs-2022#switches)

MSBuild cli was wrapped as `dotnet msbuild [-options]` within `dotnet` cli.

- `-p:<prop>=<value>`: override a property value(namely global property)
- `-t:<target>[;..]`: trigger a target(and its dependent hooks)
- `-r`: `Restore` before building

> [!NOTE]
> `dotnet` cli essentially wrapped `msbuild` cli and has some shorthand for common usage of `msbuild`.
> All build and restore related command from `dotnet` are wrapper of a `msbuild` command.
> Such targets like `Build` are pre-defined targets.
>```sh
># they're equivalent
>dotnet build
>dotnet msbuild -t:Build
>dotnet msbuild # Build would be the default target if no other targets were specified
>
>dotnet pack
>dotnet msbuild -t:Pack
>
>dotnet restore -p:Foo=foo
>dotnet msbuild -t:Restore -p:Foo=foo
>```

### Target Execution Order

Targets would be executed by the order they were specified(each target triggers and waits its dependent targets)

```sh
dotnet msbuild -t:Clean,Build # Clean first then Build
```

> [!NOTE]
> [Target Order](https://learn.microsoft.com/en-us/visualstudio/msbuild/target-build-order?view=vs-2022#determine-the-target-build-order)
