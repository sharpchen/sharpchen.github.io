import * as fs from 'fs';
import path from 'path';
import * as shikiji from 'shikiji';
import { themes } from '../../.github/workflows/beforeBuild/sync-themes.mjs';
import { projectRoot } from './FileSystem';

export async function getRegisteredMarkdownTheme(
  theme: keyof typeof themes
): Promise<shikiji.ThemeRegistration> {
  let isThemeRegistered = (await shikiji.getSingletonHighlighter())
    .getLoadedThemes()
    .find(x => x === theme);
  if (!isThemeRegistered) {
    const myTheme = JSON.parse(
      fs.readFileSync(path.join(projectRoot().fullName, `public/${theme}.json`), 'utf8')
    );
    (await shikiji.getSingletonHighlighter()).loadTheme(myTheme);
  }
  return (await shikiji.getSingletonHighlighter()).getTheme(theme);
}
