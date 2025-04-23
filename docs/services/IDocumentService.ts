import * as File from '../shared/FileSystem';
import { DocumentInfo, DocumentName } from './DocumentService';

export interface IDocumentService {
  readonly skillDocInfo: DocumentInfo;
  readonly readingDocInfo: DocumentInfo;
  get skillDocParent(): File.DirectoryInfo;
  get readingDocParent(): File.DirectoryInfo;
  get articleDocParent(): File.DirectoryInfo;
  tryGetIndexLinkOfDocument(name: DocumentName): string;
  getMarkdownEntryFolder(name: DocumentName): File.DirectoryInfo;
  getDocumentEntryFolder(name: DocumentName): File.DirectoryInfo;
  tryGetFirstChapterFolderOfDocument(name: DocumentName): {
    firstFolder: File.DirectoryInfo;
    depth: number;
  };
  tryGetFormulaNameOfDocument(name: DocumentName): string;
  isEmptyDocument(name: DocumentName): boolean;
}
