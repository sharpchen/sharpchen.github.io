import { version } from '../../node_modules/vitepress/package.json';

const documentNames = [
    'Articles',
    'Avalonia',
    'CesiumJS',
    'Csharp Design Patterns',
    'Docker',
    'Git',
    'JavaScript',
    'Mars3D',
    'Modern CSharp',
    'SQL',
    'TypeScript',
    'VBA',
    'Vue3',
] as const;
export type DocumentName = (typeof documentNames)[number];

const globalData = {
    vitepressVersion: version,
} as const;

const loader = {
    load: (): typeof globalData => globalData,
};
export default loader;
export declare const data: typeof globalData;
