import { version } from '../../node_modules/vitepress/package.json';

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

const globalData = {
  vitepressVersion: version,
} as const;

const loader = {
  load: (): typeof globalData => globalData,
};
export default loader;
export declare const data: typeof globalData;
