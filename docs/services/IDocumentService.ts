import * as File from '../shared/FileSystem';
import { DocumentInfo, DocumentName } from './DocumentService';

export interface IDocumentService {
  readonly documentInfo: DocumentInfo;
  physicalCount(): number;
  registeredCount(): number;
  physicalCountBy(f: (x: File.DirectoryInfo) => boolean): number;
  tryGetIndexLinkOfDocument(name: DocumentName): string;
  get documentSrc(): File.DirectoryInfo;
  getMarkdownEntryFolder(name: DocumentName): File.DirectoryInfo;
  getDocumentEntryFolder(name: DocumentName): File.DirectoryInfo;
  registeredDocumentFolders(): File.DirectoryInfo[];
  physicalDocumentFolders(): File.DirectoryInfo[];
  tryGetFirstChapterFolderOfDocument(name: DocumentName): {
    firstFolder: File.DirectoryInfo;
    depth: number;
  };
  tryGetFormulaNameOfDocument(name: DocumentName): string;
  isEmptyDocument(name: DocumentName): boolean;
}
