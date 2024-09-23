import { exec, spawnSync } from 'node:child_process';
import type { DefaultTheme } from 'vitepress';
import {
  type DirectoryInfo,
  type FileInfo,
  Path,
  documentRoot,
  projectRoot,
} from '../shared/FileSystem';
import { type DocumentName, documentMap, documentService } from './DocumentService';
import type { IDocumentService } from './IDocumentService';
import type { ISidebarService } from './ISidebarService';
import { async } from 'fast-glob';
import path from 'node:path';
const solveSharpSign = (text: string) => {
  if (text.includes('sharp')) return text.replace('sharp', '#');
  if (text.includes('Sharp')) return text.replace('Sharp', '#');
  return text;
};
class SidebarService implements ISidebarService {
  private readonly base: string = `/${documentRoot().name}`;
  readonly documentService: IDocumentService = documentService;
  getMultipleSidebar(): DefaultTheme.SidebarMulti {
    const sidebar: DefaultTheme.SidebarMulti = {};
    for (const name of Object.keys(documentMap)) {
      sidebar[`${this.base}/${name}/docs/`] = this.getSidebarOfDocument(name as DocumentName);
    }
    return sidebar;
  }
  getSidebarOfDocument(name: DocumentName): DefaultTheme.SidebarItem[] {
    const markdownEntry = this.documentService.getMarkdownEntryFolder(name as DocumentName);
    return [
      {
        text: solveSharpSign(name),
        items:
          name === 'Articles'
            ? this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`).sort(
                compareTrackedDate,
              )
            : this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`),
      },
    ];
    function compareTrackedDate(a: DefaultTheme.SidebarItem, b: DefaultTheme.SidebarItem) {
      return gitTrackedDate(a.link) - gitTrackedDate(b.link);
    }
    function gitTrackedDate(file: string): Date {
      const foo = new Date(
        spawnSync('git', [
          'log',
          '-1',
          '--pretty="%ai"',
          path.join(documentRoot().fullName, file),
        ]).stdout.toString(),
      );
      console.log(foo);
      return foo;
    }
  }
  transformFolderToSidebarItem(folder: DirectoryInfo, base: string): DefaultTheme.SidebarItem[] {
    const subs = folder.getDirectories();
    // load files in this folder
    const items: DefaultTheme.SidebarItem[] = folder.getFiles().length
      ? filesToSidebarItems(folder.getFiles(), `${base}/${folder.name}`)
      : [];
    for (const index in subs) {
      if (Object.prototype.hasOwnProperty.call(subs, index)) {
        const sub = subs[index];
        const currentSidebarItem: DefaultTheme.SidebarItem = {
          collapsed: false,
          text: solveSharpSign(sub.name.replace(/^\d+\.\s*/, '')), // remove leading index
          items: this.transformFolderToSidebarItem(sub, `${base}/${folder.name}`),
        };
        items.push(currentSidebarItem);
      }
    }
    return items;
    function filesToSidebarItems(files: FileInfo[], base: string): DefaultTheme.SidebarItem[] {
      return files
        .map(file => {
          const link = `${base}/${file.name}`;
          return {
            text: solveSharpSign(Path.GetFileNameWithoutExtension(file.name)),
            link: link.substring(0, link.lastIndexOf('.')),
          };
        })
        .sort((x, y) => {
          //   if (!/^\d+\.\s*/.test(x.text) || !/^\d+\.\s*/.test(y.text))
          //     throw new Error(
          //       `Files:\n${Enumerable.from(files)
          //         .select(f => f.fullName)
          //         .aggregate(
          //           (prev, current) => `${prev},\n${current}\n`
          //         )} don't have consistent leading indices.`
          //     );
          return (
            parseInt(x.text.match(/^\d+\.\s*/)?.[0]!) - parseInt(y.text.match(/^\d+\.\s*/)?.[0]!)
          );
        });
    }
  }
}

export const sidebarService: ISidebarService = new SidebarService();
