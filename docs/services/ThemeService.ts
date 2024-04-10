import { IThemeService, ThemeName } from './IThemeService';

export class ThemeService implements IThemeService {
  register(): void {
    throw new Error('Method not implemented.');
  }
  getTheme(name: ThemeName) {
    throw new Error('Method not implemented.');
  }
  themes(): any[] {
    throw new Error('Method not implemented.');
  }
}
