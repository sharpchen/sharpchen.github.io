# Package manager cache cleaning cheat sheet

|package manager|command|reference|
|---|---|---|
|`nuget`|`dotnet nuget locals all --clear`|[Managing the global packages, cache, and temp folders](https://learn.microsoft.com/en-us/nuget/consume-packages/managing-the-global-packages-and-cache-folders)|
|`pnpm`|`pnpm store prune`|[pnpm prune](https://pnpm.io/cli/prune/)|
|`npm`|`npm cache clean -f`|[npm-cache](https://docs.npmjs.com/cli/v10/commands/npm-cache)|
