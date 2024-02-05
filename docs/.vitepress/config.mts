import { defineConfig } from 'vitepress';
import { transformerTwoslash } from 'vitepress-plugin-twoslash';
import { getRegisteredMarkdownTheme, getSidebar } from '../shared/utils';
// https://vitepress.dev/reference/site-config
import { builder } from '../shared/multipleSidebarBuilder';
// console.log(JSON.stringify(builder.emitSidebar(), null, 2));
console.log(JSON.stringify(builder.emitRewrites(), null, 2));
export default defineConfig({
    markdown: {
        lineNumbers: true,
        theme: {
            // @ts-ignore
            light: await getRegisteredMarkdownTheme('Eva Light'),
            // @ts-ignore
            dark: await getRegisteredMarkdownTheme('Eva Dark'),
        },
        codeTransformers: [transformerTwoslash()],
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
        sidebar: builder.emitSidebar(), //getSidebar(),
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
        // docFooter: {
        //     prev: false,
        //     next: false,
        // },
        editLink: {
            pattern: ({ filePath }) => {
                return `https://github.com/sharpchen/sharpchen.github.io/edit/main/docs/${filePath}`;
            },
            text: 'Edit this page on GitHub',
        },
    },
});
