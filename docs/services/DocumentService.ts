// import { DocumentName, documentMap } from '../services/IDocumentService';
import fg from 'fast-glob';
import Enumerable from 'linq';
import * as File from '../shared/FileSystem';
import type { IDocumentService } from './IDocumentService';

export type DocumentInfo = Record<string, { icon: string; description: string }>;

export const documentMap = {
  'Csharp Design Patterns': { icon: '👾', description: 'Design Patterns in C#' },
  // 'Modern CSharp': { icon: '🦖', description: 'Modernized C# since 2015?' },
  Articles: { icon: '📰', description: 'Regular articles' },
  Avalonia: { icon: '😱', description: 'AvaloniaUI' },
  Docker: { icon: '🐳', description: 'Ultimate Docker' },
  Git: { icon: '😸', description: 'Git mastery' },
  JavaScript: { icon: '😅', description: '' },
  SQL: { icon: '🦭', description: '' },
  TypeScript: { icon: '🤯', description: '' },
  // VBA: { icon: '💩', description: 'VBA for excel' },
  // Vue3: { icon: '⚡', description: '' },
  'Unsafe CSharp': { icon: '😎', description: 'Entering the danger zone...' },
  'NeoVim ColorScheme Development': {
    icon: '🎨',
    description: 'Make your own nvim color scheme using lua.',
  },
  Bash: { icon: '🐢', description: 'Shebang!' },
  'Regular Expression': { icon: '🐫', description: 'Memory lossss for every 6 months' },
  Nix: { icon: '❄', description: 'Reproduce freedom' },
  'Entity Framework Core': { icon: '🗿', description: '' },
  'HTML & CSS': { icon: '😬', description: '' },
} as const satisfies DocumentInfo;

export type DocumentName = keyof typeof documentMap;

export type DocumentIcon = (typeof documentMap)[DocumentName]['icon'];

export type DocumentDescription = (typeof documentMap)[DocumentName]['description'];

class DocumentService implements IDocumentService {
  isEmptyDocument(name: DocumentName): boolean {
    try {
      const entry = this.getMarkdownEntryFolder(name);
      return fg.globSync('**/*.md', { cwd: entry.fullName }).length === 0;
    } catch (error) {
      return true;
    }
  }
  readonly documentInfo: DocumentInfo = documentMap;
  getDocumentEntryFolder(name: DocumentName): File.DirectoryInfo {
    const ret = this.registeredDocumentFolders().find(x => x.name === name);
    if (!ret) throw new Error(`Document entry of "${name}" not found.`);
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
    if (!ret) throw new Error(`Markdown entry of "${name}" not found.`);
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
  tryGetIndexLinkOfDocument(name: DocumentName): string {
    if (this.isEmptyDocument(name)) return '/';
    const solveSharpSign = (link: string) => {
      if (link.includes('Csharp')) return link.replace('#', 'Csharp');
      return link.replace('#', 'Sharp');
    };
    const shouldSolveSharpSign = (name: DocumentName) => name.includes('#');
    const markdownEntry = this.getMarkdownEntryFolder(name);
    let linkContext = `${this.documentSrc.name}/${name}/`;
    if (markdownEntry.getFiles().length) {
      const file = Enumerable.from(markdownEntry.getFiles())
        .orderBy(x => x.name)
        .first();
      const link = `${linkContext}/docs/${File.Path.GetFileNameWithoutExtension(file?.name!)}`;
      return shouldSolveSharpSign(name) ? solveSharpSign(link) : link;
    }
    const { firstFolder, depth } = this.tryGetFirstChapterFolderOfDocument(name);
    const file = firstFolder?.getFiles()[0];
    for (let i = depth - 1; i > 0; i--) {
      linkContext += `${file?.directory.up(i)?.name}/`;
    }
    const link = `${linkContext}${firstFolder?.name}/${File.Path.GetFileNameWithoutExtension(
      file?.name!,
    )}`;
    return shouldSolveSharpSign(name) ? solveSharpSign(link) : link;
  }
  get documentSrc(): File.DirectoryInfo {
    const ret = File.projectRoot()
      .getDirectories()
      .find(x => x.name === 'document');
    if (!ret) throw new Error('Document source not found.');
    return ret;
  }
  tryGetFirstChapterFolderOfDocument(name: DocumentName): {
    firstFolder: File.DirectoryInfo;
    depth: number;
  } {
    const markdownEntry = this.getMarkdownEntryFolder(name);
    return getFirst(markdownEntry);

    function getFirst(
      current: File.DirectoryInfo,
      depth: number = 1,
    ): { firstFolder: File.DirectoryInfo; depth: number } {
      const nextLevelsSorted = Enumerable.from(
        current
          .getDirectories()
          .filter(x => x.getFiles().length > 0 || x.getDirectories().length > 0),
      ).orderBy(x => x.name);
      //if no folder
      if (!nextLevelsSorted.count()) return { firstFolder: current, depth: depth };
      //if has folders
      return getFirst(nextLevelsSorted.first(), depth + 1);
    }
  }
  tryGetFormulaNameOfDocument(name: DocumentName): string {
    if (name.includes('Csharp')) return name.replace('Csharp', 'C#');
    if (name.includes('Sharp')) return name.replace('Sharp', '#');
    return name;
  }
}

export const documentService: IDocumentService = new DocumentService();
