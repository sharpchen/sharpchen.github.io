import { DefaultTheme } from 'vitepress';
import { DirectoryInfo, FileInfo, Path, documentRoot } from '../shared/FileSystem';
import { folderToSidebarItems } from './utils';
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
                if (!docs) throw new Error(`doc folder for ${docParent.name} not found`);
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
};
builder.registerSidebarAuto();
