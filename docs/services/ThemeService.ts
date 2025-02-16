import axios from 'axios';
import * as shiki from 'shiki';
import { githubService } from './GithubService';
import type { IThemeService } from './IThemeService';

const highlighter = await shiki.getSingletonHighlighter();

type TextmateRule = {
  name?: string;
  scope: string;
  settings: { fontStyle?: string; foreground?: string };
};
export type TextmateTheme = {
  name: string;
  tokenColors: TextmateRule[];
};
export type RemoteThemeInfo = {
  repo: string;
  path: string;
  branch: string;
};

const themeInfos = {
  'Eva Light': {
    repo: 'fisheva/Eva-Theme',
    path: 'VSCode/themes/Eva-Light.json',
    branch: 'master',
  },
  'Eva Dark': {
    repo: 'fisheva/Eva-Theme',
    path: 'VSCode/themes/Eva-Dark.json',
    branch: 'master',
  },
  'JetBrains Rider Dark Theme': {
    repo: 'edsulaiman/jetbrains-rider-dark-theme',
    path: 'themes/JetBrains Rider Dark Theme-color-theme.json',
    branch: 'main',
  },
  'JetBrains Rider New UI theme - Dark': {
    repo: 'digimezzo/vscode-jetbrains-rider-new-ui-theme',
    path: 'themes/JetBrains Rider New UI-color-theme-dark.json',
    brach: 'main',
  },
  'JetBrains Rider New UI theme - Light': {
    repo: 'digimezzo/vscode-jetbrains-rider-new-ui-theme',
    path: 'themes/JetBrains Rider New UI-color-theme-light.json',
    brach: 'main',
  },
} satisfies Record<string, RemoteThemeInfo>;

export type ThemeName = keyof typeof themeInfos;

class ThemeService implements IThemeService {
  readonly innerThemeService: Awaited<ReturnType<typeof shiki.getSingletonHighlighter>> =
    highlighter;
  async register(theme: TextmateTheme): Promise<void> {
    if (this.isThemeRegistered(theme.name as ThemeName)) return;
    if (theme.name.includes('Eva')) {
      const foo = theme.tokenColors.filter(x => x.scope.startsWith('comment'))[0];
      foo.settings.fontStyle = '';
    }
    await this.innerThemeService.loadTheme(theme);
  }
  async getTheme(name: ThemeName): Promise<shiki.ThemeRegistration> {
    if (!this.isThemeRegistered(name)) throw new Error(`Theme \`${name}\` not registered.`);
    return this.innerThemeService.getTheme(name);
  }
  isThemeRegistered(name: ThemeName): boolean {
    return this.innerThemeService.getLoadedThemes().includes(name);
  }
  async fetchThemeObject(info: RemoteThemeInfo): Promise<TextmateTheme> {
    const url = (await githubService.fromRepository(info.repo).getFileInfo(info.path))
      .download_url!;
    try {
      const response = await axios.get<string>(url, { responseType: 'text' });
      const theme = (await import('jsonc-parser')).parse(response.data) as TextmateTheme;
      return theme;
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw error;
    }
  }
  async initializeRegistration(): Promise<void> {
    await Promise.all(
      (Object.entries(themeInfos) as [ThemeName, RemoteThemeInfo][]).map(async x => {
        const [themeName, info] = x;
        const theme = await this.fetchThemeObject(info);
        if (!theme.name) theme.name = themeName; // in case the theme does not have a name to indentify itself
        await this.register(theme);
        console.log(`Textmate theme: \`${themeName}\` has loaded.`);
      }),
    );
  }
}
export const themeService: IThemeService = new ThemeService();
await themeService.initializeRegistration();
