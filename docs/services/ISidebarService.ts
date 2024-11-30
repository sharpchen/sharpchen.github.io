import { DefaultTheme } from 'vitepress';
import { DocumentName } from './DocumentService';
import * as File from '../shared/FileSystem';
import { IDocumentService } from './IDocumentService';
export interface ISidebarService {
  readonly documentService: IDocumentService;
  getMultipleSidebar(): DefaultTheme.SidebarMulti;
  getSidebarOfDocument(name: DocumentName): DefaultTheme.SidebarItem[];
  transformFolderToSidebarItem(
    folder: File.DirectoryInfo,
    baseLink: string,
  ): DefaultTheme.SidebarItem[];
}
