import * as shiki from 'shiki';
import { themes } from '../../.github/workflows/beforeBuild/sync-themes.mjs';
import { TextmateTheme } from '../../.github/workflows/beforeBuild/types.mjs';
export type ThemeName = keyof typeof themes;
export interface IThemeService {
  readonly innerThemeService: Awaited<ReturnType<typeof shiki.getSingletonHighlighter>>;
  register(theme: TextmateTheme): Promise<void>;
  getTheme(name: ThemeName): Promise<shiki.ThemeRegistration>;
  themes(): any[];
  isThemeRegistered(name: ThemeName): boolean;
  parseTheme(path: string): TextmateTheme;
  physicalPathOfTheme(name: ThemeName): string;
  initializeRegistration(): Promise<void>;
}
