import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import type { MermaidConfig } from 'mermaid';
import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { type DocumentName, documentService } from '../services/DocumentService';
import { sidebarService } from '../services/SidebarService';
import { themeService } from '../services/ThemeService';
type VitepressThemeType = Exclude<
  Exclude<Parameters<typeof defineConfig>[0]['markdown'], undefined>['theme'],
  undefined
>;
type ShikiThemeType = Exclude<Awaited<ReturnType<typeof themeService.getTheme>>, null>;
type Is = ShikiThemeType extends VitepressThemeType ? true : false;
// https://vitepress.dev/reference/site-config
const vitepressConfig = defineConfig({
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
    theme: {
      light: await themeService.getTheme('Eva Light'),
      // dark: await themeService.getTheme('Eva Dark'),
      dark: await themeService.getTheme('JetBrains Rider Dark Theme'),
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
      {
        text: 'Documents',
        items: Object.keys(documentService.documentInfo)
          .filter((x): x is DocumentName => x !== 'Articles')
          .map(key => ({
            text: `${documentService.documentInfo[key].icon} ${key}`,
            link: documentService.tryGetIndexLinkOfDocument(key),
          })),
      },
      {
        text: 'Articles',
        link: documentService.tryGetIndexLinkOfDocument('Articles'),
      },
      { text: 'Home', link: '/' },
      // { text: 'About', link: '../about.md' },
      // { text: 'Contact', link: '../contact.md' },
    ],
    logo: '/favicon.ico',
    sidebar: sidebarService.getMultipleSidebar(),
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
    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/sharpchen/sharpchen.github.io/edit/main/docs/${filePath}`;
      },
      text: 'Edit this page on GitHub',
    },
  },
});
type MermaidPluginConfig = {
  mermaid: MermaidConfig;
  mermaidPlugin: {
    class: '';
  };
};
export default withMermaid({ ...({} as MermaidPluginConfig), ...vitepressConfig });
