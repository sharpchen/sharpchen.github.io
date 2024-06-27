import * as shiki from 'shiki';
import { RemoteThemeInfo, TextmateTheme, ThemeName } from './ThemeService';
// export type ThemeName = keyof typeof themes;
export interface IThemeService {
  readonly innerThemeService: Awaited<ReturnType<typeof shiki.getSingletonHighlighter>>;
  register(theme: TextmateTheme): Promise<void>;
  getTheme(name: ThemeName): Promise<shiki.ThemeRegistration>;
  isThemeRegistered(name: ThemeName): boolean;
  fetchThemeObject(themeInfo: RemoteThemeInfo): Promise<TextmateTheme>;
  initializeRegistration(): Promise<void>;
}
