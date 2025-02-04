# Scoped Options

Scoped options are constrains to describe the state of a **item**, only specific to items alive during a session like aliases, functions and variables.

Item cmdlets may have `-Options` parameter but there won't have completion for it unless you're operating on a session state item.

> [!NOTE]
> See [ScopedItemOptions](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.scopeditemoptions?view=powershellsdk-7.4.0&viewFallbackFrom=powershellsdk-7.0.0) 
