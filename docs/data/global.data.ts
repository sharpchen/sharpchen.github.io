import { version } from '../../node_modules/vitepress/package.json';
const globalData = {
    vitepressVersion: version,
} as const;

const loader = {
    load: (): typeof globalData => globalData,
};
export default loader;
export declare const data: typeof globalData;
