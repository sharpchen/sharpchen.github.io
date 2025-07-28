import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import type { MermaidConfig } from 'mermaid';
import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { type DocumentName, documentService } from '../services/DocumentService';
import { sidebarService } from '../services/SidebarService';
import { themeService } from '../services/ThemeService';
import wikilinks from 'markdown-it-wikilinks';
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
      light: 'github-light',
      dark: 'github-dark',
      // light: await themeService.getTheme('Eva Light'),
      // dark: await themeService.getTheme('Eva Dark'),
      // light: await themeService.getTheme('JetBrains Rider New UI theme - Light'),
      // dark: await themeService.getTheme('JetBrains Rider New UI theme - Dark'),
    },
    codeTransformers: [transformerTwoslash()],
    config: md => {
      md.use(
        wikilinks({
          baseURL: '/document/', // Your base path
          makeAllLinksAbsolute: true, // Converts [[Page]] to /Page
        }),
      );
    },
  },
  lang: 'en-CA',
  locales: {
    root: {
      label: 'English',
      lang: 'en-CA',
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
        text: 'Skill',
        items: Object.keys(documentService.skillDocInfo)
          .filter((x): x is DocumentName => x !== 'Articles')
          .map(key => ({
            text: `${documentService.skillDocInfo[key].icon} ${key}`,
            link: documentService.tryGetIndexLinkOfDocument(key),
          })),
      },
      {
        text: 'Reading',
        items: Object.keys(documentService.readingDocInfo).map(key => ({
          text: `${documentService.readingDocInfo[key].icon} ${key}`,
          link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
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
      // formatOptions: {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   second: '2-digit',
      //   hourCycle: 'h23',
      // },
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
