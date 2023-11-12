import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    lineNumbers: true,
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
  },
  title: "Documented Notes",
  description: "Personal Documented Notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "../about.md" },
      { text: "Contact", link: "../contact.md" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    outline: {
      level: [1, 6],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/UPIMMUNITY" }],
    siteTitle: "UpImmunity",
    externalLinkIcon: true,
    footer: {
      message: "Powered by VitePress - 1.0.0-rc.25",
      copyright: "Copyright © 2023-present UpImmunity",
    },
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },
});
