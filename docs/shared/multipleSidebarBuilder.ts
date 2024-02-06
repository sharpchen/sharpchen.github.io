import Enumerable from 'linq';
import { DefaultTheme } from 'vitepress';
import { DirectoryInfo, FileInfo, Path, documentRoot } from '../shared/FileSystem';
const docRoot = documentRoot();
export const builder = {
    base: `/${docRoot.name}` as string | undefined,
    sidebar: {} as DefaultTheme.SidebarMulti,
    rewrites: {} as Record<string, string>,
    registerSidebarAuto: function () {
        if (!this.base) throw new Error('base not set');
        const docFolders = docRoot.getDirectories();
        for (const index in docFolders) {
            if (Object.prototype.hasOwnProperty.call(docFolders, index)) {
                const docParent = docFolders[index];
                const docs = docParent.getDirectories().find(d => d.name === 'docs');
                if (!docs) throw new Error(`doc folder not found`);
                const current: DefaultTheme.SidebarItem[] = [
                    {
                        text: docParent.name,
                        items: folderToSidebarItems(docs, `${this.base}/${docParent.name}`),
                    },
                ];
                this.sidebar[`${this.base}/${docParent.name}/docs/`] = current;
            }
        }
        return this;
    },
    emitSidebar: function (): DefaultTheme.SidebarMulti {
        return this.sidebar;
    },
    emitRewrites: function (): Record<string, string> {
        return this.rewrites;
    },
    registerRewritesAuto: function () {
        if (!Object.keys(this.sidebar).length) throw new Error('sidebar not set');
        for (const sidebarRoute in this.sidebar) {
            if (Object.prototype.hasOwnProperty.call(this.sidebar, sidebarRoute)) {
                const sidebar = (this.sidebar as DefaultTheme.SidebarMulti)[sidebarRoute] as DefaultTheme.SidebarItem[];
                const { items: collapsibleOrLinkOnly } = sidebar[0]; // the items of first is the actual content
                let index: string;
                // if no second level
                if (Enumerable.from(collapsibleOrLinkOnly!).any(i => i.items === void 0)) {
                    index = Enumerable.from(collapsibleOrLinkOnly!)
                        .where(i => i.link !== void 0)
                        .firstOrDefault()?.link!;
                    this.rewrites[`${index}`] = `${sidebarRoute}index.html`;
                    continue;
                }
                // find a collapsible
                const parentOfIndex = Enumerable.from(collapsibleOrLinkOnly!)
                    .where(i => i.items !== void 0 && i.items.length > 0)
                    .orderBy(i => i.text)
                    .firstOrDefault();
                index = Enumerable.from(parentOfIndex?.items!)
                    .where(i => i.link !== void 0)
                    .orderBy(i => i.text)
                    .firstOrDefault()?.link!;
                this.rewrites[`${index}`] = `${sidebarRoute}index.html`;
            }
        }
        return this;
    },
};
builder.registerSidebarAuto().registerRewritesAuto();

function filesToSidebarItems(files: FileInfo[], base: string): DefaultTheme.SidebarItem[] {
    return files.map(file => {
        const link = `${base}/${file.name}`;
        return {
            text: Path.GetFileNameWithoutExtension(file.name),
            link: link.substring(0, link.lastIndexOf('.')),
        };
    });
}

function folderToSidebarItems(folder: DirectoryInfo, base: string): DefaultTheme.SidebarItem[] {
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
