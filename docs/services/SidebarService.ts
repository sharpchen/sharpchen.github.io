import Enumerable from 'linq';
import { DefaultTheme } from 'vitepress';
import { DocumentName, documentMap } from './IDocumentService';
import { DirectoryInfo, FileInfo, Path, documentRoot } from '../shared/FileSystem';
import { documentService } from './DocumentService';
import { IDocumentService } from './IDocumentService';
import { ISidebarService } from './ISidebarService';

class SidebarService implements ISidebarService {
  private readonly base: string = `/${documentRoot().name}`;
  readonly documentService: IDocumentService = documentService;
  getMultipleSidebar(): DefaultTheme.SidebarMulti {
    let sidebar: DefaultTheme.SidebarMulti = {};
    for (const name of Object.keys(documentMap)) {
      sidebar[`${this.base}/${name}/docs/`] = this.getSidebarOfDocument(name as DocumentName);
    }
    return sidebar;
  }
  getSidebarOfDocument(name: DocumentName): DefaultTheme.SidebarItem[] {
    const markdownEntry = this.documentService.getMarkdownEntryFolder(name as DocumentName);
    return [
      {
        text: name,
        items: this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`),
      },
    ];
  }
  transformFolderToSidebarItem(folder: DirectoryInfo, base: string): DefaultTheme.SidebarItem[] {
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
            text: Path.GetFileNameWithoutExtension(file.name),
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
