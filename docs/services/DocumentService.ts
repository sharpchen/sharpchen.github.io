import { DocumentName, documentMap } from '../services/IDocumentService';
import * as File from '../shared/FileSystem';
import { IDocumentService } from './IDocumentService';

class DocumentService implements IDocumentService {
  getDocumentEntryFolder(name: DocumentName): File.DirectoryInfo {
    const ret = this.registeredDocumentFolders().find(x => x.name === name);
    if (!ret) throw new Error(`Document entry of ${name} not found.`);
    return ret;
  }
  registeredDocumentFolders(): File.DirectoryInfo[] {
    return this.documentSrc.getDirectories().filter(x => Object.keys(documentMap).includes(x.name));
  }
  physicalDocumentFolders(): File.DirectoryInfo[] {
    return this.documentSrc.getDirectories();
  }
  getMarkdownEntryFolder(name: DocumentName): File.DirectoryInfo {
    const ret = this.getDocumentEntryFolder(name)
      .getDirectories()
      .find(x => x.name === 'docs');
    if (!ret) throw new Error(`Markdown entry of ${name} not found.`);
    return ret;
  }
  registeredCount(): number {
    return Object.keys(documentMap).length;
  }
  physicalCount(): number {
    return this.documentSrc.getDirectories().length;
  }
  physicalCountBy(f: (x: File.DirectoryInfo) => boolean): number {
    return this.documentSrc.getDirectories().filter(x => f(x)).length;
  }
  getIndexLinkOfDocument(name: DocumentName): string {
    throw new Error('Method not implemented.');
  }
  get documentSrc(): File.DirectoryInfo {
    const ret = File.projectRoot()
      .getDirectories()
      .find(x => x.name === 'document');
    if (!ret) throw new Error('Document source not found.');
    return ret;
  }
}

export const documentService: IDocumentService = new DocumentService();
