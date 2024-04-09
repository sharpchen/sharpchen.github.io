import * as File from '../shared/FileSystem';

export interface IDocumentService {
  physicalCount(): number;
  registeredCount(): number;
  physicalCountBy(f: (x: File.DirectoryInfo) => boolean): number;
  getIndexLinkOfDocument(name: DocumentName): string;
  get documentSrc(): File.DirectoryInfo;
  getMarkdownEntryFolder(name: DocumentName): File.DirectoryInfo;
  getDocumentEntryFolder(name: DocumentName): File.DirectoryInfo;
  registeredDocumentFolders(): File.DirectoryInfo[];
  physicalDocumentFolders(): File.DirectoryInfo[];
}
export const documentMap = {
  'Csharp Design Patterns': '👾',
  'Modern CSharp': '🐱‍👤',
  Articles: '📰',
  Avalonia: '😱',
  Docker: '🐋',
  Git: '🐱',
  JavaScript: '😅',
  SQL: '📝',
  TypeScript: '⌨',
  VBA: '💩',
  Vue3: '⚡',
} as const;
export type DocumentName = keyof typeof documentMap;
export type DocumentIcon = (typeof documentMap)[keyof typeof documentMap];
