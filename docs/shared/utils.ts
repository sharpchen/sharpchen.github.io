/**
 * - Converts a document name to corresponding registered route name.
 * @param fullName name of document root folder
 * @returns corresponding route name registered statically
 */
export function routeNameOfDocument(fullName: string): string {
    const ret = fullName.split(' ').join('').toLowerCase();
    return ret;
}

/**
 * truncateUrl('http://.../pages/document/.../xx.md', 'pages')
 * @param url url to truncate
 * @param prefix prefix to be truncated
 * @returns
 */
export function truncateUrl(url: string, prefix: string): string {
    const index = url.indexOf(prefix);
    if (index === -1) {
        return url;
    }
    return url.substring(index + prefix.length);
}

/**
 *
 * @param mdLink `http://../../xx.md`
 * @returns `http://../../xx.html`
 */
export function mdLinkToHtmlLink(mdLink: string) {
    if (mdLink.endsWith('.md')) {
        return `${mdLink.substring(0, mdLink.lastIndexOf('.md'))}.html`;
    }
    return mdLink;
}

export type DocumentPrevAndNext = {
    text: string;
    link: string;
};
import { DocumentResponse } from '../data/Document.data';
export function getPrevNext(
    docRoute: string,
    currentDocData: DocumentResponse
): DocumentPrevAndNext[] {
    const chain: DocumentPrevAndNext[] = [];
    const docInfo = currentDocData;
    if (docInfo.content.chapters.length > 0) {
        const chapters = docInfo.content.chapters.sort((x, y) => x.name.localeCompare(y.name));
        chapters.forEach(c => {
            c.filesRelativeToProjectRoot
                ?.map(x => {
                    return { text: x.substring(x.lastIndexOf('/') + 1), link: x };
                })
                ?.sort((x, y) => tryCompare(x.text, y.text))
                .forEach(f => chain.push({ text: f.text, link: f.link }));
        });
    } else {
        docInfo.content.filesRelativeToProjectRoot
            ?.map(x => {
                return { text: x.substring(x.lastIndexOf('/') + 1), link: x };
            })
            .sort((x, y) => tryCompare(x.text, y.text))
            .forEach(f => chain.push({ text: f.text, link: f.link }));
    }
    return chain;
}
export function tryCompare(x: string, y: string): number {
    if (startsWithIndex(x) && startsWithIndex(y)) {
        const xNum = parseInt(x.substring(0, x.indexOf('.')));
        const yNum = parseInt(y.substring(0, y.indexOf('.')));
        return compareIntegers(xNum, yNum);
    }
    return x.localeCompare(y);
}
function startsWithIndex(input: string): boolean {
    const regex = /^\d+\./;
    return regex.test(input);
}

function compareIntegers(a: number, b: number): number {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

import * as registeredInfo from '../[docRoute].paths';
import { Path, documentRoot, projectRoot } from './FileSystem';
import { DefaultTheme } from 'vitepress';
export function getSidebar(): DefaultTheme.Sidebar | undefined {
    const docRoot = documentRoot();
    const registeredDocs = registeredInfo.default.paths();
    // get all registered doc parents
    const docParents = docRoot
        .getDirectories()
        .filter(x => !x.name.startsWith('.'))
        .map(x => {
            return {
                name: x.name,
                docDir: x.getDirectories().filter(d => d.name === 'docs')[0],
            };
        })
        .filter(
            x =>
                registeredDocs.filter(y => y.params.docRoute === routeNameOfDocument(x.name))
                    .length !== 0
        );
    // generate sidebar for each docDir
    return docParents
        .map(x => {
            // if has chapters
            if (x.docDir.getDirectories().length !== 0) {
                const subs = x.docDir.getDirectories();
                return {
                    text: x.name,
                    collapsed: true,
                    items: subs.map(s => {
                        return {
                            collapsed: true,
                            text: s.name,
                            items: s.getFiles().map(f => {
                                return {
                                    text: f.name,
                                    link: Path.GetRelativePath(projectRoot().fullName, f.fullName),
                                };
                            }),
                        };
                    }),
                };
            } else {
                return {
                    collapsed: true,
                    text: x.name,
                    items: x.docDir
                        .getFiles()
                        .map(f => {
                            return {
                                text: f.name,
                                link: Path.GetRelativePath(projectRoot().fullName, f.fullName),
                            };
                        })
                        .sort((x, y) => tryCompare(x.text, y.text)),
                };
            }
        })
        .flat();
}
import * as shikiji from 'shikiji';
import * as fs from 'fs';
import path from 'path';
type CustomMarkdownTheme = 'Eva-Dark' | 'Eva-Light' | 'Rider-Dark' | 'Darcula' | 'vscode-dark-plus';
export async function getRegisteredMarkdownTheme(
    theme: CustomMarkdownTheme
): Promise<shikiji.ThemeRegistration> {
    let isThemeRegistered = (await shikiji.getSingletonHighlighter())
        .getLoadedThemes()
        .find(x => x === theme);
    if (!isThemeRegistered) {
        const myTheme = JSON.parse(
            fs.readFileSync(path.join(projectRoot().fullName, `public/${theme}.json`), 'utf8')
        );
        (await shikiji.getSingletonHighlighter()).loadTheme(myTheme);
    }
    return (await shikiji.getSingletonHighlighter()).getTheme(theme);
}
