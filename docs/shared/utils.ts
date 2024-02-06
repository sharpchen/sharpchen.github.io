import * as fs from 'fs';
import path from 'path';
import * as shikiji from 'shikiji';
import { DefaultTheme } from 'vitepress';
import { themes } from '../../.github/workflows/beforeBuild/sync-themes.mjs';
import { FileInfo, Path, DirectoryInfo, projectRoot } from './FileSystem';

export async function getRegisteredMarkdownTheme(theme: keyof typeof themes): Promise<shikiji.ThemeRegistration> {
    let isThemeRegistered = (await shikiji.getSingletonHighlighter()).getLoadedThemes().find(x => x === theme);
    if (!isThemeRegistered) {
        const myTheme = JSON.parse(fs.readFileSync(path.join(projectRoot().fullName, `public/${theme}.json`), 'utf8'));
        (await shikiji.getSingletonHighlighter()).loadTheme(myTheme);
    }
    return (await shikiji.getSingletonHighlighter()).getTheme(theme);
}

export function filesToSidebarItems(files: FileInfo[], base: string): DefaultTheme.SidebarItem[] {
    return files.map(file => {
        const link = `${base}/${file.name}`;
        return {
            text: Path.GetFileNameWithoutExtension(file.name),
            link: link.substring(0, link.lastIndexOf('.')),
        };
    });
}

export function folderToSidebarItems(folder: DirectoryInfo, base: string): DefaultTheme.SidebarItem[] {
    if (!folder.exists) throw new Error(`folder: ${folder.name} not found`);
    const subs = folder.getDirectories();
    // load files in this folder
    let items: DefaultTheme.SidebarItem[] = folder.getFiles().length
        ? filesToSidebarItems(folder.getFiles(), `${base}/${folder.name}`)
        : [];
    for (const index in subs) {
        if (Object.prototype.hasOwnProperty.call(subs, index)) {
            const sub = subs[index];
            const currentSidebarItem: DefaultTheme.SidebarItem = {
                collapsed: false,
                text: sub.name.replace(/^\d+\.\s*/, ''), // remove leading index
                items: folderToSidebarItems(sub, `${base}/${folder.name}`),
            };
            items.push(currentSidebarItem);
        }
    }
    return items;
}
