# Custom markdown theme in VitePress

:::warning
`vitepress` migrated to `shiki` from `shikiji` since [1.0.0-rc41](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md#100-rc41-2024-2-1), this approach may have been deprecated.
:::

## What are textmate rules

TextMate grammars are for syntax highlighting and language support. The rules are defined in JSON format.

## How VitePress manage markdown themes

`VitePress` uses [`shikiji`](https://github.com/antfu/shikiji) to perform highlighting(built-in themes are also from `shikiji`).
To figure out how to create an theme instance with correct type, let's check source code of VitePress, `shiki` and `shikiji`.

```ts
// from vitepress source
import { IThemeRegistration } from 'shiki';

type ThemeOptions = IThemeRegistration | {
    light: IThemeRegistration;
    dark: IThemeRegistration;
};
interface MarkdownOptions extends MarkdownIt.Options {
    // ...
    theme?: ThemeOptions;
    // ...
}
```

```ts
// from shiki source
type IThemeRegistration = IShikiTheme | StringLiteralUnion<Theme>;

interface IShikiTheme extends IRawTheme { ... }

interface ThemeRegistrationRaw extends IRawTheme { }

interface ThemeRegistration extends ThemeRegistrationRaw { ... }
```

Luckily we have these methods from `shikiji` so we can perform registration for themes.
And for those abstraction relationships, we can pass `ThemeRegistration` instance to  `theme?: ThemeOptions`

```ts
// from shikiji
declare const getSingletonHighlighter: () => Promise<HighlighterGeneric< /* very long union type */ >;
```

```ts
// from shikiji
interface HighlighterGeneric<BundledLangKeys extends string, BundledThemeKeys extends string> {
    /**
     * Load a theme to the highlighter, so later it can be used synchronously.
     */
    loadTheme(...themes: (ThemeInput | BundledThemeKeys)[]): Promise<void>;
    /**
     * Get the theme registration object
     */
    getTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration;
    /**
     * Get the names of loaded themes
     */
    getLoadedThemes(): string[];
    // ...
}
```

## Parse json into `shikiji.ThemeRegistration`

1. First, get the theme represented as json you desired. If you are using built-in themes from `shikiji` you can find them in `node_modules/shikiji/dist/themes/*.mjs`. The anon object in the module is the presentation of the theme. No matter what method you take, make it a json and include it in your project.

2. Next, we find a way to register the modified theme.

```ts
import * as shikiji from 'shikiji';
import * as fs from 'fs';

// assuming that we have these theme available in somewhere. Then find its path by name.
type CustomMarkdownTheme = 'Eva-Dark' | 'Eva-Light' | 'Rider-Dark' | 'Darcula' | 'vscode-dark-plus';

export async function getRegisteredMarkdownTheme(theme: CustomMarkdownTheme): Promise<shikiji.ThemeRegistration> {
    let isThemeRegistered = (await shikiji.getSingletonHighlighter())
        .getLoadedThemes() // this method returns names of loaded themes, name is specified in each textmate rule json.
        .find(x => x === theme);
    if (!isThemeRegistered) {
        const myTheme = JSON.parse(
            fs.readFileSync(/* find the path of your json */), 'utf8')
        );
        (await shikiji.getSingletonHighlighter()).loadTheme(myTheme);
    }
    return (await shikiji.getSingletonHighlighter()).getTheme(theme);
}
```

## Specify themes in `config.mts`

Finally we can specify the theme in config, but this solution does not support hot reload for the theme json. **If you need to reload the theme, please rebuild.**

```ts
// config.mts
export default defineConfig({
    markdown: {
        lineNumbers: true,
        theme: {
            light: await getRegisteredMarkdownTheme('Eva-Light'),
            dark: await getRegisteredMarkdownTheme('vscode-dark-plus'),
        },
    },...
}
```

::: info

- [`shikiji` - Load Custom Themes](https://github.com/antfu/shikiji/blob/main/docs/themes.md#load-custom-themes)
- [MarkdownOption in `VitePress`](https://vitepress.dev/reference/site-config#markdown)

:::
