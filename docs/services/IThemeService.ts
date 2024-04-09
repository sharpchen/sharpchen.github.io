import { themes } from '../../.github/workflows/beforeBuild/sync-themes.mjs';
export type ThemeName = keyof typeof themes;
export interface IThemeService {
  register(): void;
  getTheme(name: ThemeName): any;
  themes(): any[];
}
