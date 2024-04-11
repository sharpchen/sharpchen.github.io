import * as fs from 'fs';
import path from 'path';
import * as shiki from 'shiki';
import { themes as themeInfo } from '../../.github/workflows/beforeBuild/sync-themes.mjs';
import type { TextmateTheme } from '../../.github/workflows/beforeBuild/types.mjs';
import { projectRoot } from '../shared/FileSystem';
import { IThemeService, ThemeName } from './IThemeService';
const highlighter = await shiki.getSingletonHighlighter();
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
  themes(): any[] {
    throw new Error('Method not implemented.');
  }
  isThemeRegistered(name: ThemeName): boolean {
    return this.innerThemeService.getLoadedThemes().includes(name);
  }
  physicalPathOfTheme(name: ThemeName): string {
    const ret = path.join(projectRoot().fullName, `public/${name}.json`);
    if (!fs.existsSync(ret)) throw new Error(`${name}.json does not exist at /public`);
    return ret;
  }
  parseTheme(filePath: string): TextmateTheme {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  async initializeRegistration(): Promise<void> {
    await Promise.all(
      (Object.entries(themeInfo) as [ThemeName, string][]).map(async x => {
        const p = this.physicalPathOfTheme(x[0]);
        const json = this.parseTheme(p);
        await this.register(json);
      })
    );
  }
}
export const themeService: IThemeService = new ThemeService();
await themeService.initializeRegistration();
