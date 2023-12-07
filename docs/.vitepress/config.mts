import { DefaultTheme, PageData, defineConfig } from 'vitepress';
import { Sidebar, generateSidebar } from 'vitepress-sidebar';
import { DirectoryInfo, Path, documentRoot, projectRoot } from '../shared/FileSystem';
import { getSidebar } from '../shared/utils';
// https://vitepress.dev/reference/site-config
export default defineConfig({
    markdown: {
        lineNumbers: true,
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
        logo: '../public/favicon.ico',
        sidebar: getSidebar(),
        outline: {
            level: 'deep',
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/sharpchen' }],
        siteTitle: 'sharpchen',
        externalLinkIcon: true,
        footer: {
            message: 'Powered by VitePress - 1.0.0-rc.25',
            copyright: 'Copyright © 2023-present sharpchen',
        },
        lastUpdated: {
            text: 'Last updated',
            formatOptions: {
                dateStyle: 'long',
                timeStyle: 'short',
            },
        },
        search: {
            provider: 'local',
        },
        docFooter: {
            prev: false,
            next: false,
        },
    },
});
