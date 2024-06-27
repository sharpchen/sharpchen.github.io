import axios from 'axios';
import * as shiki from 'shiki';
import { getRepoFileInfo, githubService } from './GithubService';
import { IThemeService } from './IThemeService';
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
  'Eva-Light': { repo: 'fisheva/Eva-Theme', path: 'themes/Eva-Light.json', branch: 'master' },
  'Eva-Dark': { repo: 'fisheva/Eva-Theme', path: 'themes/Eva-Dark.json', branch: 'master' },
} satisfies Record<string, RemoteThemeInfo>;
export type ThemeName = keyof typeof themeInfos;
class ThemeService implements IThemeService {
  readonly innerThemeService: Awaited<ReturnType<typeof shiki.getSingletonHighlighter>> =
    highlighter;
  async register(theme: TextmateTheme): Promise<void> {
    if (this.isThemeRegistered(theme.name as ThemeName)) return;
    this.innerThemeService.loadTheme(theme);
  }
  async getTheme(name: ThemeName): Promise<shiki.ThemeRegistration> {
    if (!this.isThemeRegistered(name)) throw new Error(`Theme \`${name}\` not registered.`);
    return this.innerThemeService.getTheme(name);
  }
  isThemeRegistered(name: ThemeName): boolean {
    return this.innerThemeService.getLoadedThemes().includes(name);
  }
  async fetchThemeObject(info: RemoteThemeInfo): Promise<TextmateTheme> {
    console.error('hello???');
    const matches = (
      await githubService.fromRepository(info.repo).getTree({ branch: info.branch })
    ).filter(x => x.path === info.path);
    if (!matches.length) throw new Error();
    const url = (await getRepoFileInfo(info.repo, matches[0].path!)).download_url!;
    try {
      const response = await axios.get<string>(url, { responseType: 'text' });
      return (await import('jsonc-parser')).parse(response.data) as TextmateTheme;
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw error;
    }
  }
  async initializeRegistration(): Promise<void> {
    await Promise.all(
      (Object.entries(themeInfos) as [ThemeName, RemoteThemeInfo][]).map(async x => {
        const json = await this.fetchThemeObject(x[1]);
        await this.register(json);
      })
    );
  }
}
export const themeService: IThemeService = new ThemeService();
await themeService.initializeRegistration();
