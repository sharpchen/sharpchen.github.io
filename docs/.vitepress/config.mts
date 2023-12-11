import { DefaultTheme, PageData, defineConfig } from 'vitepress';
import { Sidebar, generateSidebar } from 'vitepress-sidebar';
import { DirectoryInfo, Path, documentRoot, projectRoot } from '../shared/FileSystem';
import { getSidebar } from '../shared/utils';
import * as shikiji from 'shikiji';
import * as fs from 'fs';
import { getRegisteredMarkdownTheme } from '../shared/utils';
// https://vitepress.dev/reference/site-config
export default defineConfig({
    markdown: {
        lineNumbers: true,
        theme: {
            light: await getRegisteredMarkdownTheme('Eva-Light'),
            dark: 'dark-plus', // await getRegisteredMarkdownTheme('vscode-dark-plus'),
        },
    },
    locales: {
        root: {
            label: 'English',
            lang: 'en',
        },
    },
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    title: 'Documented Notes',
    titleTemplate: 'sharpchen',
    description: 'Personal Documented Notes',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '../about.md' },
            { text: 'Contact', link: '../contact.md' },
        ],
        logo: '/favicon.ico',
        sidebar: getSidebar(),
        outline: {
            level: 'deep',
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/sharpchen' }],
        siteTitle: 'sharpchen',
        externalLinkIcon: true,
        lastUpdated: {
            text: 'Last updated',
        },
        search: {
            provider: 'local',
        },
        docFooter: {
            prev: false,
            next: false,
        },
        editLink: {
            pattern: ({ filePath }) => {
                return `https://github.com/sharpchen/sharpchen.github.io/blob/main/docs/${filePath}`;
            },
            text: 'Edit this page on GitHub',
        },
    },
});
