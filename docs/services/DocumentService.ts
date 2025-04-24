// import { DocumentName, documentMap } from '../services/IDocumentService';
import fg from 'fast-glob';
import Enumerable from 'linq';
import * as FileSystem from '../shared/FileSystem';
import type { IDocumentService } from './IDocumentService';

export type DocumentInfo = Record<string, { icon: string; description: string }>;

export const skillDocMap = {
  'Csharp Design Patterns': { icon: '👾', description: 'Design Patterns in C#' },
  'Modern CSharp': { icon: '🦖', description: '' },
  Articles: { icon: '📰', description: 'Regular articles' },
  Avalonia: { icon: '😱', description: 'AvaloniaUI' },
  Docker: { icon: '🐳', description: '' },
  Git: { icon: '🐙', description: 'Git mastery' },
  JavaScript: { icon: '😅', description: '' },
  // SQL: { icon: '🦭', description: '' },
  TypeScript: { icon: '🤯', description: 'Type wizard I will become...' },
  // VBA: { icon: '💩', description: 'VBA for excel' },
  // Vue3: { icon: '⚡', description: '' },
  'Unsafe CSharp': { icon: '😎', description: 'Entering the danger zone...' },
  // 'NeoVim ColorScheme Development': {
  //   icon: '🎨',
  //   description: 'Make your own nvim color scheme using lua.',
  // },
  Bash: { icon: '🐢', description: 'Shebang!' },
  'Regular Expression': { icon: '🐫', description: '' },
  Nix: { icon: '❄', description: 'Reproduce freedom' },
  'Entity Framework Core': { icon: '🗿', description: '' },
  // 'HTML & CSS': { icon: '😬', description: '' },
  PowerShell: { icon: '🐚', description: 'A pretty solid shell' },
  Lua: { icon: '🌝', description: 'I wish lua could have JavaScript syntax' },
} as const satisfies DocumentInfo;

const readingDocMap = {
  Test: { icon: '🚗', description: 'this is a test' },
} as const satisfies DocumentInfo;

export type DocumentName = keyof typeof skillDocMap | keyof typeof readingDocMap;

export type DocumentIcon =
  | (typeof skillDocMap)[keyof typeof skillDocMap]['icon']
  | (typeof readingDocMap)[keyof typeof readingDocMap]['icon'];

class DocumentService implements IDocumentService {
  readonly skillDocInfo: DocumentInfo = skillDocMap;
  readonly readingDocInfo: DocumentInfo = readingDocMap;

  get skillDocParent(): FileSystem.DirectoryInfo {
    const doc = FileSystem.projectRoot()
      .getDirectories()
      .find(x => x.name === 'document');
    const ret = doc.getDirectories().find(x => x.name === 'Skill');
    if (!ret) throw new Error('Skill Document source not found.');
    return ret;
  }

  get readingDocParent(): FileSystem.DirectoryInfo {
    const doc = FileSystem.projectRoot()
      .getDirectories()
      .find(x => x.name === 'document');
    const ret = doc.getDirectories().find(x => x.name === 'Reading');
    if (!ret) throw new Error('Reading Document source not found.');
    return ret;
  }

  get articleDocParent(): FileSystem.DirectoryInfo {
    const doc = FileSystem.projectRoot()
      .getDirectories()
      .find(x => x.name === 'document');
    const ret = doc.getDirectories().find(x => x.name === 'Articles');
    if (!ret) throw new Error('Articles Document source not found.');
    return ret;
  }

  isEmptyDocument(name: DocumentName): boolean {
    try {
      const entry = this.getMarkdownEntryFolder(name);
      return fg.globSync('**/*.md', { cwd: entry.fullName }).length === 0;
    } catch (error) {
      return true;
    }
  }

  /**
   * @param name - nameof document
   * @returns the very parent folder of the document
   */
  getDocumentEntryFolder(name: DocumentName): FileSystem.DirectoryInfo {
    if (name === 'Articles') {
      return this.articleDocParent;
    }

    let src: FileSystem.DirectoryInfo;

    if (Object.keys(skillDocMap).includes(name)) {
      src = this.skillDocParent;
    } else if (Object.keys(readingDocMap).includes(name)) {
      src = this.readingDocParent;
    }

    const ret = src.getDirectories().find(x => x.name === name);
    if (!ret) throw new Error(`Document entry of "${name}" not found.`);
    return ret;
  }

  /**
   * @param name - nameof the document
   * @returns docs folder of the document
   */
  getMarkdownEntryFolder(name: DocumentName): FileSystem.DirectoryInfo {
    const ret = this.getDocumentEntryFolder(name)
      .getDirectories()
      .find(x => x.name === 'docs');
    if (!ret) throw new Error(`Markdown entry of "${name}" not found.`);
    return ret;
  }

  /**
   * find a entry file location for given document name
   * @param name - nameof document
   * @returns relative path to the document file
   */
  tryGetIndexLinkOfDocument(name: DocumentName): string {
    if (this.isEmptyDocument(name)) return '/';

    const solveSharpSign = (link: string) => {
      if (link.includes('Csharp')) return link.replace('#', 'Csharp');
      return link.replace('#', 'Sharp');
    };

    const shouldSolveSharpSign = (name: DocumentName) => name.includes('#');

    let src: FileSystem.DirectoryInfo;
    if (Object.keys(skillDocMap).includes(name)) {
      src = this.skillDocParent;
    } else if (Object.keys(readingDocMap).includes(name)) {
      src = this.readingDocParent;
    }
    const markdownEntry = this.getMarkdownEntryFolder(name);
    let linkContext = `document/${src.name}/${name}/`;

    if (markdownEntry.getFiles().length) {
      const file = Enumerable.from(markdownEntry.getFiles())
        .orderBy(x => x.name)
        .first();
      const link = `${linkContext}/docs/${FileSystem.Path.GetFileNameWithoutExtension(file?.name!)}`;
      return shouldSolveSharpSign(name) ? solveSharpSign(link) : link;
    }

    const { firstFolder, depth } = this.tryGetFirstChapterFolderOfDocument(name);
    const file = firstFolder?.getFiles()[0];

    for (let i = depth - 1; i > 0; i--) {
      linkContext += `${file?.directory.up(i)?.name}/`;
    }

    const link = `${linkContext}${firstFolder?.name}/${FileSystem.Path.GetFileNameWithoutExtension(
      file?.name!,
    )}`;

    return shouldSolveSharpSign(name) ? solveSharpSign(link) : link;
  }

  tryGetFirstChapterFolderOfDocument(name: DocumentName): {
    firstFolder: FileSystem.DirectoryInfo;
    depth: number;
  } {
    const markdownEntry = this.getMarkdownEntryFolder(name);
    return getFirst(markdownEntry);

    function getFirst(
      current: FileSystem.DirectoryInfo,
      depth: number = 1,
    ): { firstFolder: FileSystem.DirectoryInfo; depth: number } {
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
