// docs/.vitepress/config.mts
import { defineConfig } from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/vitepress@1.1.0_@algolia+client-search@4.23.2_@types+node@20.12.7_axios@1.6.8_search-insights@2.13.0_typescript@5.4.4/node_modules/vitepress/dist/node/index.js";
import { withMermaid } from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/vitepress-plugin-mermaid@2.0.16_mermaid@10.9.0_vitepress@1.1.0/node_modules/vitepress-plugin-mermaid/dist/vitepress-plugin-mermaid.es.mjs";
import { transformerTwoslash } from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/vitepress-plugin-twoslash@0.10.2_typescript@5.4.4/node_modules/vitepress-plugin-twoslash/dist/index.mjs";

// docs/shared/FileSystem.ts
import * as fs from "fs";
import * as path from "path";
var __vite_injected_original_dirname = "D:\\repo\\sharpchen.github.io\\docs\\shared";
var FileSystemInfo = class {
  path;
  constructor(path4) {
    this.path = path4;
  }
};
var DirectoryInfo = class _DirectoryInfo extends FileSystemInfo {
  constructor(directoryPath) {
    super(directoryPath);
    this.path = directoryPath;
  }
  get name() {
    return path.basename(this.path);
  }
  get fullName() {
    return this.path;
  }
  get exists() {
    return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
  }
  get parent() {
    const parentPath = path.dirname(this.path);
    return parentPath !== this.path ? new _DirectoryInfo(parentPath) : null;
  }
  getFiles() {
    if (!this.exists) {
      return [];
    }
    const fileInfos = fs.readdirSync(this.path).map((fileName) => {
      const filePath = path.join(this.path, fileName);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        return new FileInfo(filePath);
      }
    }).filter(Boolean);
    return fileInfos;
  }
  getDirectories() {
    try {
      const directoryNames = fs.readdirSync(this.path).filter((item) => fs.statSync(path.join(this.path, item)).isDirectory());
      return directoryNames.map((directory) => new _DirectoryInfo(path.join(this.path, directory)));
    } catch (error) {
      console.error(`Error reading directories in ${this.path}: ${error.message}`);
      return [];
    }
  }
  up(count) {
    if (count < 0)
      throw new Error("count must be greater than or equal to 0");
    let current = this;
    for (let i = 0; i < count; i++) {
      current = current?.parent;
    }
    return current || void 0;
  }
};
var FileInfo = class extends FileSystemInfo {
  constructor(filePath) {
    super(filePath);
    this.path = filePath;
  }
  get name() {
    return path.basename(this.path);
  }
  get fullName() {
    return this.path;
  }
  get exists() {
    return fs.existsSync(this.path) && fs.statSync(this.path).isFile();
  }
  get length() {
    if (!this.exists) {
      return 0;
    }
    return fs.statSync(this.path).size;
  }
  get directory() {
    const directoryPath = path.dirname(this.path);
    return new DirectoryInfo(directoryPath);
  }
};
var Path = class {
  constructor() {
  }
  static GetRelativePath(relativeTo, to) {
    return path.relative(relativeTo, to);
  }
  static GetBaseName(fullName) {
    return path.basename(fullName);
  }
  static GetFileNameWithoutExtension(path4) {
    const fileName = new FileInfo(path4).name;
    const lastPeriod = fileName.lastIndexOf(".");
    return lastPeriod < 0 ? fileName : fileName.slice(0, lastPeriod);
  }
};
function projectRoot() {
  return new DirectoryInfo(__vite_injected_original_dirname).parent;
}
function documentRoot() {
  return projectRoot().getDirectories().filter((x) => x.name === "document")[0];
}

// docs/services/DocumentService.ts
import fg from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js";
import Enumerable from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/linq@4.0.2/node_modules/linq/linq.js";
var documentMap = {
  "Csharp Design Patterns": { icon: "\u{1F47E}", description: "Design Patterns in C#" },
  "Modern CSharp": { icon: "\u{1F996}", description: "Modernized C# since 2015?" },
  Articles: { icon: "\u{1F4F0}", description: "Regular articles" },
  Avalonia: { icon: "\u{1F631}", description: "AvaloniaUI" },
  Docker: { icon: "\u{1F40B}", description: "Ultimate Docker" },
  Git: { icon: "\u{1F431}", description: "Git mastery" },
  JavaScript: { icon: "\u{1F605}", description: "JavaScript for C# developer" },
  SQL: { icon: "\u{1F4DD}", description: "SQL syntax for beginners with MySQL" },
  TypeScript: { icon: "\u2328", description: "TypeScript for C# developer" },
  VBA: { icon: "\u{1F4A9}", description: "VBA for excel" },
  Vue3: { icon: "\u26A1", description: "Vue3 for .NET blazor developer" },
  "Unsafe CSharp": { icon: "\u{1F60E}", description: "Entering the danger zone..." },
  "NeoVim ColorScheme Development": {
    icon: "\u{1F3A8}",
    description: "Make your own nvim color scheme using lua."
  },
  Bash: { icon: "\u{1F422}", description: "shebang!" }
};
var DocumentService = class {
  isEmptyDocument(name) {
    try {
      const entry = this.getMarkdownEntryFolder(name);
      return fg.globSync(`**/*.md`, { cwd: entry.fullName }).length === 0;
    } catch (error) {
      return true;
    }
  }
  documentInfo = documentMap;
  getDocumentEntryFolder(name) {
    const ret = this.registeredDocumentFolders().find((x) => x.name === name);
    if (!ret)
      throw new Error(`Document entry of "${name}" not found.`);
    return ret;
  }
  registeredDocumentFolders() {
    return this.documentSrc.getDirectories().filter((x) => Object.keys(documentMap).includes(x.name));
  }
  physicalDocumentFolders() {
    return this.documentSrc.getDirectories();
  }
  getMarkdownEntryFolder(name) {
    const ret = this.getDocumentEntryFolder(name).getDirectories().find((x) => x.name === "docs");
    if (!ret)
      throw new Error(`Markdown entry of "${name}" not found.`);
    return ret;
  }
  registeredCount() {
    return Object.keys(documentMap).length;
  }
  physicalCount() {
    return this.documentSrc.getDirectories().length;
  }
  physicalCountBy(f) {
    return this.documentSrc.getDirectories().filter((x) => f(x)).length;
  }
  tryGetIndexLinkOfDocument(name) {
    if (this.isEmptyDocument(name))
      return "/";
    const solveSharpSign2 = (link2) => {
      if (link2.includes("Csharp"))
        return link2.replace("#", "Csharp");
      return link2.replace("#", "Sharp");
    };
    const shouldSolveSharpSign = (name2) => name2.includes("#");
    const markdownEntry = this.getMarkdownEntryFolder(name);
    let linkContext = `${this.documentSrc.name}/${name}/`;
    if (markdownEntry.getFiles().length) {
      const file2 = Enumerable.from(markdownEntry.getFiles()).orderBy((x) => x.name).first();
      const link2 = `${linkContext}/docs/${Path.GetFileNameWithoutExtension(file2?.name)}`;
      return shouldSolveSharpSign(name) ? solveSharpSign2(link2) : link2;
    }
    const { firstFolder, depth } = this.tryGetFirstChapterFolderOfDocument(name);
    const file = firstFolder?.getFiles()[0];
    for (let i = depth - 1; i > 0; i--) {
      linkContext += file?.directory.up(i)?.name + "/";
    }
    const link = `${linkContext}${firstFolder?.name}/${Path.GetFileNameWithoutExtension(
      file?.name
    )}`;
    return shouldSolveSharpSign(name) ? solveSharpSign2(link) : link;
  }
  get documentSrc() {
    const ret = projectRoot().getDirectories().find((x) => x.name === "document");
    if (!ret)
      throw new Error("Document source not found.");
    return ret;
  }
  tryGetFirstChapterFolderOfDocument(name) {
    const markdownEntry = this.getMarkdownEntryFolder(name);
    return getFirst(markdownEntry);
    function getFirst(current, depth = 1) {
      const nextLevelsSorted = Enumerable.from(
        current.getDirectories().filter((x) => x.getFiles().length > 0 || x.getDirectories().length > 0)
      ).orderBy((x) => x.name);
      if (!nextLevelsSorted.count())
        return { firstFolder: current, depth };
      return getFirst(nextLevelsSorted.first(), depth + 1);
    }
  }
  tryGetFormulaNameOfDocument(name) {
    if (name.includes("Csharp"))
      return name.replace("Csharp", "C#");
    if (name.includes("Sharp"))
      return name.replace("Sharp", "#");
    return name;
  }
};
var documentService = new DocumentService();

// docs/services/SidebarService.ts
var solveSharpSign = (text) => {
  if (text.includes("sharp"))
    return text.replace("sharp", "#");
  if (text.includes("Sharp"))
    return text.replace("Sharp", "#");
  return text;
};
var SidebarService = class {
  base = `/${documentRoot().name}`;
  documentService = documentService;
  getMultipleSidebar() {
    let sidebar = {};
    for (const name of Object.keys(documentMap)) {
      sidebar[`${this.base}/${name}/docs/`] = this.getSidebarOfDocument(name);
    }
    return sidebar;
  }
  getSidebarOfDocument(name) {
    const markdownEntry = this.documentService.getMarkdownEntryFolder(name);
    return [
      {
        text: solveSharpSign(name),
        items: this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`)
      }
    ];
  }
  transformFolderToSidebarItem(folder, base) {
    const subs = folder.getDirectories();
    let items = folder.getFiles().length ? filesToSidebarItems(folder.getFiles(), `${base}/${folder.name}`) : [];
    for (const index in subs) {
      if (Object.prototype.hasOwnProperty.call(subs, index)) {
        const sub = subs[index];
        const currentSidebarItem = {
          collapsed: false,
          text: solveSharpSign(sub.name.replace(/^\d+\.\s*/, "")),
          // remove leading index
          items: this.transformFolderToSidebarItem(sub, `${base}/${folder.name}`)
        };
        items.push(currentSidebarItem);
      }
    }
    return items;
    function filesToSidebarItems(files, base2) {
      return files.map((file) => {
        const link = `${base2}/${file.name}`;
        return {
          text: solveSharpSign(Path.GetFileNameWithoutExtension(file.name)),
          link: link.substring(0, link.lastIndexOf("."))
        };
      }).sort((x, y) => {
        return parseInt(x.text.match(/^\d+\.\s*/)?.[0]) - parseInt(y.text.match(/^\d+\.\s*/)?.[0]);
      });
    }
  }
};
var sidebarService = new SidebarService();

// docs/services/ThemeService.ts
import * as fs2 from "fs";
import path3 from "path";
import * as shiki from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/shiki@1.3.0/node_modules/shiki/dist/index.mjs";

// .github/workflows/beforeBuild/sync-themes.mjs
import axios from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/axios@1.6.8/node_modules/axios/index.js";
import * as JSONC from "file:///D:/repo/sharpchen.github.io/node_modules/.pnpm/jsonc-parser@3.2.1/node_modules/jsonc-parser/lib/umd/main.js";
import path2 from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///D:/repo/sharpchen.github.io/.github/workflows/beforeBuild/sync-themes.mjs";
var themes = {
  "Eva Dark": "https://raw.githubusercontent.com/sharpchen/Eva-Theme/variant/themes/Eva-Dark.json",
  "Eva Light": "https://raw.githubusercontent.com/sharpchen/Eva-Theme/variant/themes/Eva-Light.json"
};
var jsonOutDir = path2.join(
  path2.dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
  "../../../docs/public/"
);

// docs/services/ThemeService.ts
var highlighter = await shiki.getSingletonHighlighter();
var ThemeService = class {
  innerThemeService = highlighter;
  async register(theme) {
    if (this.isThemeRegistered(theme.name))
      return;
    this.innerThemeService.loadTheme(theme);
  }
  async getTheme(name) {
    if (!this.isThemeRegistered(name))
      throw new Error(`Theme \`${name}\` not registered.`);
    return this.innerThemeService.getTheme(name);
  }
  themes() {
    throw new Error("Method not implemented.");
  }
  isThemeRegistered(name) {
    return this.innerThemeService.getLoadedThemes().includes(name);
  }
  physicalPathOfTheme(name) {
    const ret = path3.join(projectRoot().fullName, `public/${name}.json`);
    if (!fs2.existsSync(ret))
      throw new Error(`${name}.json does not exist at /public`);
    return ret;
  }
  parseTheme(filePath) {
    return JSON.parse(fs2.readFileSync(filePath, "utf-8"));
  }
  async initializeRegistration() {
    await Promise.all(
      Object.entries(themes).map(async (x) => {
        const p = this.physicalPathOfTheme(x[0]);
        const json = this.parseTheme(p);
        await this.register(json);
      })
    );
  }
};
var themeService = new ThemeService();
await themeService.initializeRegistration();

// docs/.vitepress/config.mts
var vitepressConfig = defineConfig({
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
    theme: {
      light: await themeService.getTheme("Eva Light"),
      dark: await themeService.getTheme("Eva Dark")
    },
    codeTransformers: [transformerTwoslash()]
  },
  locales: {
    root: {
      label: "English",
      lang: "en"
    }
  },
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  title: "Documented Notes",
  titleTemplate: "sharpchen",
  description: "Personal Documented Notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "../about.md" },
      { text: "Contact", link: "../contact.md" }
    ],
    logo: "/favicon.ico",
    sidebar: sidebarService.getMultipleSidebar(),
    outline: {
      level: "deep"
    },
    socialLinks: [{ icon: "github", link: "https://github.com/sharpchen" }],
    siteTitle: "sharpchen",
    externalLinkIcon: true,
    lastUpdated: {
      text: "Last updated"
    },
    search: {
      provider: "local"
    },
    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/sharpchen/sharpchen.github.io/edit/main/docs/${filePath}`;
      },
      text: "Edit this page on GitHub"
    }
  }
});
var config_default = withMermaid({ ...{}, ...vitepressConfig });
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAiZG9jcy9zaGFyZWQvRmlsZVN5c3RlbS50cyIsICJkb2NzL3NlcnZpY2VzL0RvY3VtZW50U2VydmljZS50cyIsICJkb2NzL3NlcnZpY2VzL1NpZGViYXJTZXJ2aWNlLnRzIiwgImRvY3Mvc2VydmljZXMvVGhlbWVTZXJ2aWNlLnRzIiwgIi5naXRodWIvd29ya2Zsb3dzL2JlZm9yZUJ1aWxkL3N5bmMtdGhlbWVzLm1qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFxkb2NzXFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgTWVybWFpZENvbmZpZyB9IGZyb20gJ21lcm1haWQnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnO1xyXG5pbXBvcnQgeyB3aXRoTWVybWFpZCB9IGZyb20gJ3ZpdGVwcmVzcy1wbHVnaW4tbWVybWFpZCc7XHJcbmltcG9ydCB7IHRyYW5zZm9ybWVyVHdvc2xhc2ggfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLXR3b3NsYXNoJztcclxuaW1wb3J0IHsgc2lkZWJhclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9TaWRlYmFyU2VydmljZSc7XHJcbmltcG9ydCB7IHRoZW1lU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL1RoZW1lU2VydmljZSc7XHJcbnR5cGUgVml0ZXByZXNzVGhlbWVUeXBlID0gRXhjbHVkZTxcclxuICBFeGNsdWRlPFBhcmFtZXRlcnM8dHlwZW9mIGRlZmluZUNvbmZpZz5bMF1bJ21hcmtkb3duJ10sIHVuZGVmaW5lZD5bJ3RoZW1lJ10sXHJcbiAgdW5kZWZpbmVkXHJcbj47XHJcbnR5cGUgU2hpa2lUaGVtZVR5cGUgPSBFeGNsdWRlPEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2YgdGhlbWVTZXJ2aWNlLmdldFRoZW1lPj4sIG51bGw+O1xyXG50eXBlIElzID0gU2hpa2lUaGVtZVR5cGUgZXh0ZW5kcyBWaXRlcHJlc3NUaGVtZVR5cGUgPyB0cnVlIDogZmFsc2U7XHJcbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcclxuY29uc3Qgdml0ZXByZXNzQ29uZmlnID0gZGVmaW5lQ29uZmlnKHtcclxuICBjbGVhblVybHM6IHRydWUsXHJcbiAgbWFya2Rvd246IHtcclxuICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgdGhlbWU6IHtcclxuICAgICAgbGlnaHQ6IGF3YWl0IHRoZW1lU2VydmljZS5nZXRUaGVtZSgnRXZhIExpZ2h0JyksXHJcbiAgICAgIGRhcms6IGF3YWl0IHRoZW1lU2VydmljZS5nZXRUaGVtZSgnRXZhIERhcmsnKSxcclxuICAgIH0sXHJcbiAgICBjb2RlVHJhbnNmb3JtZXJzOiBbdHJhbnNmb3JtZXJUd29zbGFzaCgpXSxcclxuICB9LFxyXG4gIGxvY2FsZXM6IHtcclxuICAgIHJvb3Q6IHtcclxuICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcclxuICAgICAgbGFuZzogJ2VuJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBoZWFkOiBbWydsaW5rJywgeyByZWw6ICdpY29uJywgaHJlZjogJy9mYXZpY29uLmljbycgfV1dLFxyXG4gIHRpdGxlOiAnRG9jdW1lbnRlZCBOb3RlcycsXHJcbiAgdGl0bGVUZW1wbGF0ZTogJ3NoYXJwY2hlbicsXHJcbiAgZGVzY3JpcHRpb246ICdQZXJzb25hbCBEb2N1bWVudGVkIE5vdGVzJyxcclxuICB0aGVtZUNvbmZpZzoge1xyXG4gICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xyXG4gICAgbmF2OiBbXHJcbiAgICAgIHsgdGV4dDogJ0hvbWUnLCBsaW5rOiAnLycgfSxcclxuICAgICAgeyB0ZXh0OiAnQWJvdXQnLCBsaW5rOiAnLi4vYWJvdXQubWQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ0NvbnRhY3QnLCBsaW5rOiAnLi4vY29udGFjdC5tZCcgfSxcclxuICAgIF0sXHJcbiAgICBsb2dvOiAnL2Zhdmljb24uaWNvJyxcclxuICAgIHNpZGViYXI6IHNpZGViYXJTZXJ2aWNlLmdldE11bHRpcGxlU2lkZWJhcigpLFxyXG4gICAgb3V0bGluZToge1xyXG4gICAgICBsZXZlbDogJ2RlZXAnLFxyXG4gICAgfSxcclxuICAgIHNvY2lhbExpbmtzOiBbeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9zaGFycGNoZW4nIH1dLFxyXG4gICAgc2l0ZVRpdGxlOiAnc2hhcnBjaGVuJyxcclxuICAgIGV4dGVybmFsTGlua0ljb246IHRydWUsXHJcbiAgICBsYXN0VXBkYXRlZDoge1xyXG4gICAgICB0ZXh0OiAnTGFzdCB1cGRhdGVkJyxcclxuICAgIH0sXHJcbiAgICBzZWFyY2g6IHtcclxuICAgICAgcHJvdmlkZXI6ICdsb2NhbCcsXHJcbiAgICB9LFxyXG4gICAgZWRpdExpbms6IHtcclxuICAgICAgcGF0dGVybjogKHsgZmlsZVBhdGggfSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL3NoYXJwY2hlbi9zaGFycGNoZW4uZ2l0aHViLmlvL2VkaXQvbWFpbi9kb2NzLyR7ZmlsZVBhdGh9YDtcclxuICAgICAgfSxcclxuICAgICAgdGV4dDogJ0VkaXQgdGhpcyBwYWdlIG9uIEdpdEh1YicsXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG50eXBlIE1lcm1haWRQbHVnaW5Db25maWcgPSB7XHJcbiAgbWVybWFpZDogTWVybWFpZENvbmZpZztcclxuICBtZXJtYWlkUGx1Z2luOiB7XHJcbiAgICBjbGFzczogJyc7XHJcbiAgfTtcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgd2l0aE1lcm1haWQoeyAuLi4oe30gYXMgTWVybWFpZFBsdWdpbkNvbmZpZyksIC4uLnZpdGVwcmVzc0NvbmZpZyB9KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxyZXBvXFxcXHNoYXJwY2hlbi5naXRodWIuaW9cXFxcZG9jc1xcXFxzaGFyZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFxkb2NzXFxcXHNoYXJlZFxcXFxGaWxlU3lzdGVtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zaGFyZWQvRmlsZVN5c3RlbS50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmFic3RyYWN0IGNsYXNzIEZpbGVTeXN0ZW1JbmZvIHtcclxuICBwcm90ZWN0ZWQgcGF0aDogc3RyaW5nO1xyXG4gIGFic3RyYWN0IGdldCBuYW1lKCk6IHN0cmluZztcclxuICBhYnN0cmFjdCBnZXQgZnVsbE5hbWUoKTogc3RyaW5nO1xyXG4gIGFic3RyYWN0IGdldCBleGlzdHMoKTogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBEaXJlY3RvcnlJbmZvIGV4dGVuZHMgRmlsZVN5c3RlbUluZm8ge1xyXG4gIGNvbnN0cnVjdG9yKGRpcmVjdG9yeVBhdGg6IHN0cmluZykge1xyXG4gICAgc3VwZXIoZGlyZWN0b3J5UGF0aCk7XHJcbiAgICB0aGlzLnBhdGggPSBkaXJlY3RvcnlQYXRoO1xyXG4gIH1cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHBhdGguYmFzZW5hbWUodGhpcy5wYXRoKTtcclxuICB9XHJcblxyXG4gIGdldCBmdWxsTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICB9XHJcblxyXG4gIGdldCBleGlzdHMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZnMuZXhpc3RzU3luYyh0aGlzLnBhdGgpICYmIGZzLnN0YXRTeW5jKHRoaXMucGF0aCkuaXNEaXJlY3RvcnkoKTtcclxuICB9XHJcbiAgZ2V0IHBhcmVudCgpOiBEaXJlY3RvcnlJbmZvIHwgbnVsbCB7XHJcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gcGF0aC5kaXJuYW1lKHRoaXMucGF0aCk7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aCAhPT0gdGhpcy5wYXRoID8gbmV3IERpcmVjdG9yeUluZm8ocGFyZW50UGF0aCkgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgZ2V0RmlsZXMoKTogRmlsZUluZm9bXSB7XHJcbiAgICBpZiAoIXRoaXMuZXhpc3RzKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0IGZpbGVJbmZvcyA9IGZzXHJcbiAgICAgIC5yZWFkZGlyU3luYyh0aGlzLnBhdGgpXHJcbiAgICAgIC5tYXAoZmlsZU5hbWUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMucGF0aCwgZmlsZU5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0LmlzRmlsZSgpKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IEZpbGVJbmZvKGZpbGVQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5maWx0ZXIoQm9vbGVhbikgYXMgRmlsZUluZm9bXTtcclxuICAgIHJldHVybiBmaWxlSW5mb3M7XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3RvcmllcygpOiBEaXJlY3RvcnlJbmZvW10ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGlyZWN0b3J5TmFtZXMgPSBmc1xyXG4gICAgICAgIC5yZWFkZGlyU3luYyh0aGlzLnBhdGgpXHJcbiAgICAgICAgLmZpbHRlcihpdGVtID0+IGZzLnN0YXRTeW5jKHBhdGguam9pbih0aGlzLnBhdGgsIGl0ZW0pKS5pc0RpcmVjdG9yeSgpKTtcclxuICAgICAgcmV0dXJuIGRpcmVjdG9yeU5hbWVzLm1hcChkaXJlY3RvcnkgPT4gbmV3IERpcmVjdG9yeUluZm8ocGF0aC5qb2luKHRoaXMucGF0aCwgZGlyZWN0b3J5KSkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyBkaXJlY3RvcmllcyBpbiAke3RoaXMucGF0aH06ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICB1cChjb3VudDogbnVtYmVyKTogRGlyZWN0b3J5SW5mbyB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAoY291bnQgPCAwKSB0aHJvdyBuZXcgRXJyb3IoJ2NvdW50IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAnKTtcclxuICAgIGxldCBjdXJyZW50OiBEaXJlY3RvcnlJbmZvIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHRoaXM7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgY3VycmVudCA9IGN1cnJlbnQ/LnBhcmVudDtcclxuICAgIH1cclxuICAgIHJldHVybiBjdXJyZW50IHx8IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWxlSW5mbyBleHRlbmRzIEZpbGVTeXN0ZW1JbmZvIHtcclxuICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihmaWxlUGF0aCk7XHJcbiAgICB0aGlzLnBhdGggPSBmaWxlUGF0aDtcclxuICB9XHJcblxyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gcGF0aC5iYXNlbmFtZSh0aGlzLnBhdGgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZ1bGxOYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXRoO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGV4aXN0cygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKHRoaXMucGF0aCkgJiYgZnMuc3RhdFN5bmModGhpcy5wYXRoKS5pc0ZpbGUoKTtcclxuICB9XHJcblxyXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy5leGlzdHMpIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnMuc3RhdFN5bmModGhpcy5wYXRoKS5zaXplO1xyXG4gIH1cclxuICBnZXQgZGlyZWN0b3J5KCk6IERpcmVjdG9yeUluZm8ge1xyXG4gICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHBhdGguZGlybmFtZSh0aGlzLnBhdGgpO1xyXG4gICAgcmV0dXJuIG5ldyBEaXJlY3RvcnlJbmZvKGRpcmVjdG9yeVBhdGgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhdGgge1xyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG4gIHN0YXRpYyBHZXRSZWxhdGl2ZVBhdGgocmVsYXRpdmVUbzogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHJlbGF0aXZlVG8sIHRvKTtcclxuICB9XHJcbiAgc3RhdGljIEdldEJhc2VOYW1lKGZ1bGxOYW1lOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKGZ1bGxOYW1lKTtcclxuICB9XHJcbiAgc3RhdGljIEdldEZpbGVOYW1lV2l0aG91dEV4dGVuc2lvbihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgZmlsZU5hbWU6IHN0cmluZyA9IG5ldyBGaWxlSW5mbyhwYXRoKS5uYW1lO1xyXG4gICAgY29uc3QgbGFzdFBlcmlvZDogbnVtYmVyID0gZmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKTtcclxuICAgIHJldHVybiBsYXN0UGVyaW9kIDwgMFxyXG4gICAgICA/IGZpbGVOYW1lIC8vIE5vIGV4dGVuc2lvbiB3YXMgZm91bmRcclxuICAgICAgOiBmaWxlTmFtZS5zbGljZSgwLCBsYXN0UGVyaW9kKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0Um9vdCgpOiBEaXJlY3RvcnlJbmZvIHtcclxuICByZXR1cm4gbmV3IERpcmVjdG9yeUluZm8oX19kaXJuYW1lKS5wYXJlbnQhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZG9jdW1lbnRSb290KCk6IERpcmVjdG9yeUluZm8ge1xyXG4gIHJldHVybiBwcm9qZWN0Um9vdCgpXHJcbiAgICAuZ2V0RGlyZWN0b3JpZXMoKVxyXG4gICAgLmZpbHRlcih4ID0+IHgubmFtZSA9PT0gJ2RvY3VtZW50JylbMF07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxyZXBvXFxcXHNoYXJwY2hlbi5naXRodWIuaW9cXFxcZG9jc1xcXFxzZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccmVwb1xcXFxzaGFycGNoZW4uZ2l0aHViLmlvXFxcXGRvY3NcXFxcc2VydmljZXNcXFxcRG9jdW1lbnRTZXJ2aWNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zZXJ2aWNlcy9Eb2N1bWVudFNlcnZpY2UudHNcIjsvLyBpbXBvcnQgeyBEb2N1bWVudE5hbWUsIGRvY3VtZW50TWFwIH0gZnJvbSAnLi4vc2VydmljZXMvSURvY3VtZW50U2VydmljZSc7XHJcbmltcG9ydCBmZyBmcm9tICdmYXN0LWdsb2InO1xyXG5pbXBvcnQgRW51bWVyYWJsZSBmcm9tICdsaW5xJztcclxuaW1wb3J0ICogYXMgRmlsZSBmcm9tICcuLi9zaGFyZWQvRmlsZVN5c3RlbSc7XHJcbmltcG9ydCB7IElEb2N1bWVudFNlcnZpY2UgfSBmcm9tICcuL0lEb2N1bWVudFNlcnZpY2UnO1xyXG5leHBvcnQgdHlwZSBEb2N1bWVudEluZm8gPSBSZWNvcmQ8c3RyaW5nLCB7IGljb246IHN0cmluZzsgZGVzY3JpcHRpb246IHN0cmluZyB9PjtcclxuZXhwb3J0IGNvbnN0IGRvY3VtZW50TWFwID0ge1xyXG4gICdDc2hhcnAgRGVzaWduIFBhdHRlcm5zJzogeyBpY29uOiAnXHVEODNEXHVEQzdFJywgZGVzY3JpcHRpb246ICdEZXNpZ24gUGF0dGVybnMgaW4gQyMnIH0sXHJcbiAgJ01vZGVybiBDU2hhcnAnOiB7IGljb246ICdcdUQ4M0VcdUREOTYnLCBkZXNjcmlwdGlvbjogJ01vZGVybml6ZWQgQyMgc2luY2UgMjAxNT8nIH0sXHJcbiAgQXJ0aWNsZXM6IHsgaWNvbjogJ1x1RDgzRFx1RENGMCcsIGRlc2NyaXB0aW9uOiAnUmVndWxhciBhcnRpY2xlcycgfSxcclxuICBBdmFsb25pYTogeyBpY29uOiAnXHVEODNEXHVERTMxJywgZGVzY3JpcHRpb246ICdBdmFsb25pYVVJJyB9LFxyXG4gIERvY2tlcjogeyBpY29uOiAnXHVEODNEXHVEQzBCJywgZGVzY3JpcHRpb246ICdVbHRpbWF0ZSBEb2NrZXInIH0sXHJcbiAgR2l0OiB7IGljb246ICdcdUQ4M0RcdURDMzEnLCBkZXNjcmlwdGlvbjogJ0dpdCBtYXN0ZXJ5JyB9LFxyXG4gIEphdmFTY3JpcHQ6IHsgaWNvbjogJ1x1RDgzRFx1REUwNScsIGRlc2NyaXB0aW9uOiAnSmF2YVNjcmlwdCBmb3IgQyMgZGV2ZWxvcGVyJyB9LFxyXG4gIFNRTDogeyBpY29uOiAnXHVEODNEXHVEQ0REJywgZGVzY3JpcHRpb246ICdTUUwgc3ludGF4IGZvciBiZWdpbm5lcnMgd2l0aCBNeVNRTCcgfSxcclxuICBUeXBlU2NyaXB0OiB7IGljb246ICdcdTIzMjgnLCBkZXNjcmlwdGlvbjogJ1R5cGVTY3JpcHQgZm9yIEMjIGRldmVsb3BlcicgfSxcclxuICBWQkE6IHsgaWNvbjogJ1x1RDgzRFx1RENBOScsIGRlc2NyaXB0aW9uOiAnVkJBIGZvciBleGNlbCcgfSxcclxuICBWdWUzOiB7IGljb246ICdcdTI2QTEnLCBkZXNjcmlwdGlvbjogJ1Z1ZTMgZm9yIC5ORVQgYmxhem9yIGRldmVsb3BlcicgfSxcclxuICAnVW5zYWZlIENTaGFycCc6IHsgaWNvbjogJ1x1RDgzRFx1REUwRScsIGRlc2NyaXB0aW9uOiAnRW50ZXJpbmcgdGhlIGRhbmdlciB6b25lLi4uJyB9LFxyXG4gICdOZW9WaW0gQ29sb3JTY2hlbWUgRGV2ZWxvcG1lbnQnOiB7XHJcbiAgICBpY29uOiAnXHVEODNDXHVERkE4JyxcclxuICAgIGRlc2NyaXB0aW9uOiAnTWFrZSB5b3VyIG93biBudmltIGNvbG9yIHNjaGVtZSB1c2luZyBsdWEuJyxcclxuICB9LFxyXG4gIEJhc2g6IHsgaWNvbjogJ1x1RDgzRFx1REMyMicsIGRlc2NyaXB0aW9uOiAnc2hlYmFuZyEnIH0sXHJcbn0gYXMgY29uc3Qgc2F0aXNmaWVzIERvY3VtZW50SW5mbztcclxuZXhwb3J0IHR5cGUgRG9jdW1lbnROYW1lID0ga2V5b2YgdHlwZW9mIGRvY3VtZW50TWFwO1xyXG5leHBvcnQgdHlwZSBEb2N1bWVudEljb24gPSAodHlwZW9mIGRvY3VtZW50TWFwKVtEb2N1bWVudE5hbWVdWydpY29uJ107XHJcbmV4cG9ydCB0eXBlIERvY3VtZW50RGVzY3JpcHRpb24gPSAodHlwZW9mIGRvY3VtZW50TWFwKVtEb2N1bWVudE5hbWVdWydkZXNjcmlwdGlvbiddO1xyXG5jbGFzcyBEb2N1bWVudFNlcnZpY2UgaW1wbGVtZW50cyBJRG9jdW1lbnRTZXJ2aWNlIHtcclxuICBpc0VtcHR5RG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKTogYm9vbGVhbiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuZ2V0TWFya2Rvd25FbnRyeUZvbGRlcihuYW1lKTtcclxuICAgICAgcmV0dXJuIGZnLmdsb2JTeW5jKGAqKi8qLm1kYCwgeyBjd2Q6IGVudHJ5LmZ1bGxOYW1lIH0pLmxlbmd0aCA9PT0gMDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkb25seSBkb2N1bWVudEluZm86IERvY3VtZW50SW5mbyA9IGRvY3VtZW50TWFwO1xyXG4gIGdldERvY3VtZW50RW50cnlGb2xkZXIobmFtZTogRG9jdW1lbnROYW1lKTogRmlsZS5EaXJlY3RvcnlJbmZvIHtcclxuICAgIGNvbnN0IHJldCA9IHRoaXMucmVnaXN0ZXJlZERvY3VtZW50Rm9sZGVycygpLmZpbmQoeCA9PiB4Lm5hbWUgPT09IG5hbWUpO1xyXG4gICAgaWYgKCFyZXQpIHRocm93IG5ldyBFcnJvcihgRG9jdW1lbnQgZW50cnkgb2YgXCIke25hbWV9XCIgbm90IGZvdW5kLmApO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbiAgcmVnaXN0ZXJlZERvY3VtZW50Rm9sZGVycygpOiBGaWxlLkRpcmVjdG9yeUluZm9bXSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFNyYy5nZXREaXJlY3RvcmllcygpLmZpbHRlcih4ID0+IE9iamVjdC5rZXlzKGRvY3VtZW50TWFwKS5pbmNsdWRlcyh4Lm5hbWUpKTtcclxuICB9XHJcbiAgcGh5c2ljYWxEb2N1bWVudEZvbGRlcnMoKTogRmlsZS5EaXJlY3RvcnlJbmZvW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRTcmMuZ2V0RGlyZWN0b3JpZXMoKTtcclxuICB9XHJcbiAgZ2V0TWFya2Rvd25FbnRyeUZvbGRlcihuYW1lOiBEb2N1bWVudE5hbWUpOiBGaWxlLkRpcmVjdG9yeUluZm8ge1xyXG4gICAgY29uc3QgcmV0ID0gdGhpcy5nZXREb2N1bWVudEVudHJ5Rm9sZGVyKG5hbWUpXHJcbiAgICAgIC5nZXREaXJlY3RvcmllcygpXHJcbiAgICAgIC5maW5kKHggPT4geC5uYW1lID09PSAnZG9jcycpO1xyXG4gICAgaWYgKCFyZXQpIHRocm93IG5ldyBFcnJvcihgTWFya2Rvd24gZW50cnkgb2YgXCIke25hbWV9XCIgbm90IGZvdW5kLmApO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbiAgcmVnaXN0ZXJlZENvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZG9jdW1lbnRNYXApLmxlbmd0aDtcclxuICB9XHJcbiAgcGh5c2ljYWxDb3VudCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRTcmMuZ2V0RGlyZWN0b3JpZXMoKS5sZW5ndGg7XHJcbiAgfVxyXG4gIHBoeXNpY2FsQ291bnRCeShmOiAoeDogRmlsZS5EaXJlY3RvcnlJbmZvKSA9PiBib29sZWFuKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRvY3VtZW50U3JjLmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKHggPT4gZih4KSkubGVuZ3RoO1xyXG4gIH1cclxuICB0cnlHZXRJbmRleExpbmtPZkRvY3VtZW50KG5hbWU6IERvY3VtZW50TmFtZSk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5pc0VtcHR5RG9jdW1lbnQobmFtZSkpIHJldHVybiAnLyc7XHJcbiAgICBjb25zdCBzb2x2ZVNoYXJwU2lnbiA9IChsaW5rOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKGxpbmsuaW5jbHVkZXMoJ0NzaGFycCcpKSByZXR1cm4gbGluay5yZXBsYWNlKCcjJywgJ0NzaGFycCcpO1xyXG4gICAgICByZXR1cm4gbGluay5yZXBsYWNlKCcjJywgJ1NoYXJwJyk7XHJcbiAgICB9O1xyXG4gICAgY29uc3Qgc2hvdWxkU29sdmVTaGFycFNpZ24gPSAobmFtZTogRG9jdW1lbnROYW1lKSA9PiBuYW1lLmluY2x1ZGVzKCcjJyk7XHJcbiAgICBjb25zdCBtYXJrZG93bkVudHJ5ID0gdGhpcy5nZXRNYXJrZG93bkVudHJ5Rm9sZGVyKG5hbWUpO1xyXG4gICAgbGV0IGxpbmtDb250ZXh0ID0gYCR7dGhpcy5kb2N1bWVudFNyYy5uYW1lfS8ke25hbWV9L2A7XHJcbiAgICBpZiAobWFya2Rvd25FbnRyeS5nZXRGaWxlcygpLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBmaWxlID0gRW51bWVyYWJsZS5mcm9tKG1hcmtkb3duRW50cnkuZ2V0RmlsZXMoKSlcclxuICAgICAgICAub3JkZXJCeSh4ID0+IHgubmFtZSlcclxuICAgICAgICAuZmlyc3QoKTtcclxuICAgICAgY29uc3QgbGluayA9IGAke2xpbmtDb250ZXh0fS9kb2NzLyR7RmlsZS5QYXRoLkdldEZpbGVOYW1lV2l0aG91dEV4dGVuc2lvbihmaWxlPy5uYW1lISl9YDtcclxuICAgICAgcmV0dXJuIHNob3VsZFNvbHZlU2hhcnBTaWduKG5hbWUpID8gc29sdmVTaGFycFNpZ24obGluaykgOiBsaW5rO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBmaXJzdEZvbGRlciwgZGVwdGggfSA9IHRoaXMudHJ5R2V0Rmlyc3RDaGFwdGVyRm9sZGVyT2ZEb2N1bWVudChuYW1lKTtcclxuICAgIGNvbnN0IGZpbGUgPSBmaXJzdEZvbGRlcj8uZ2V0RmlsZXMoKVswXTtcclxuICAgIGZvciAobGV0IGkgPSBkZXB0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgbGlua0NvbnRleHQgKz0gZmlsZT8uZGlyZWN0b3J5LnVwKGkpPy5uYW1lICsgJy8nO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGluayA9IGAke2xpbmtDb250ZXh0fSR7Zmlyc3RGb2xkZXI/Lm5hbWV9LyR7RmlsZS5QYXRoLkdldEZpbGVOYW1lV2l0aG91dEV4dGVuc2lvbihcclxuICAgICAgZmlsZT8ubmFtZSFcclxuICAgICl9YDtcclxuICAgIHJldHVybiBzaG91bGRTb2x2ZVNoYXJwU2lnbihuYW1lKSA/IHNvbHZlU2hhcnBTaWduKGxpbmspIDogbGluaztcclxuICB9XHJcbiAgZ2V0IGRvY3VtZW50U3JjKCk6IEZpbGUuRGlyZWN0b3J5SW5mbyB7XHJcbiAgICBjb25zdCByZXQgPSBGaWxlLnByb2plY3RSb290KClcclxuICAgICAgLmdldERpcmVjdG9yaWVzKClcclxuICAgICAgLmZpbmQoeCA9PiB4Lm5hbWUgPT09ICdkb2N1bWVudCcpO1xyXG4gICAgaWYgKCFyZXQpIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgc291cmNlIG5vdCBmb3VuZC4nKTtcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHRyeUdldEZpcnN0Q2hhcHRlckZvbGRlck9mRG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKToge1xyXG4gICAgZmlyc3RGb2xkZXI6IEZpbGUuRGlyZWN0b3J5SW5mbztcclxuICAgIGRlcHRoOiBudW1iZXI7XHJcbiAgfSB7XHJcbiAgICBjb25zdCBtYXJrZG93bkVudHJ5ID0gdGhpcy5nZXRNYXJrZG93bkVudHJ5Rm9sZGVyKG5hbWUpO1xyXG4gICAgcmV0dXJuIGdldEZpcnN0KG1hcmtkb3duRW50cnkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEZpcnN0KFxyXG4gICAgICBjdXJyZW50OiBGaWxlLkRpcmVjdG9yeUluZm8sXHJcbiAgICAgIGRlcHRoOiBudW1iZXIgPSAxXHJcbiAgICApOiB7IGZpcnN0Rm9sZGVyOiBGaWxlLkRpcmVjdG9yeUluZm87IGRlcHRoOiBudW1iZXIgfSB7XHJcbiAgICAgIGNvbnN0IG5leHRMZXZlbHNTb3J0ZWQgPSBFbnVtZXJhYmxlLmZyb20oXHJcbiAgICAgICAgY3VycmVudFxyXG4gICAgICAgICAgLmdldERpcmVjdG9yaWVzKClcclxuICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmdldEZpbGVzKCkubGVuZ3RoID4gMCB8fCB4LmdldERpcmVjdG9yaWVzKCkubGVuZ3RoID4gMClcclxuICAgICAgKS5vcmRlckJ5KHggPT4geC5uYW1lKTtcclxuICAgICAgLy9pZiBubyBmb2xkZXJcclxuICAgICAgaWYgKCFuZXh0TGV2ZWxzU29ydGVkLmNvdW50KCkpIHJldHVybiB7IGZpcnN0Rm9sZGVyOiBjdXJyZW50LCBkZXB0aDogZGVwdGggfTtcclxuICAgICAgLy9pZiBoYXMgZm9sZGVyc1xyXG4gICAgICByZXR1cm4gZ2V0Rmlyc3QobmV4dExldmVsc1NvcnRlZC5maXJzdCgpLCBkZXB0aCArIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuICB0cnlHZXRGb3JtdWxhTmFtZU9mRG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKTogc3RyaW5nIHtcclxuICAgIGlmIChuYW1lLmluY2x1ZGVzKCdDc2hhcnAnKSkgcmV0dXJuIG5hbWUucmVwbGFjZSgnQ3NoYXJwJywgJ0MjJyk7XHJcbiAgICBpZiAobmFtZS5pbmNsdWRlcygnU2hhcnAnKSkgcmV0dXJuIG5hbWUucmVwbGFjZSgnU2hhcnAnLCAnIycpO1xyXG4gICAgcmV0dXJuIG5hbWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZG9jdW1lbnRTZXJ2aWNlOiBJRG9jdW1lbnRTZXJ2aWNlID0gbmV3IERvY3VtZW50U2VydmljZSgpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFxkb2NzXFxcXHNlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxyZXBvXFxcXHNoYXJwY2hlbi5naXRodWIuaW9cXFxcZG9jc1xcXFxzZXJ2aWNlc1xcXFxTaWRlYmFyU2VydmljZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXMvU2lkZWJhclNlcnZpY2UudHNcIjtpbXBvcnQgeyBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xyXG5pbXBvcnQgeyBEaXJlY3RvcnlJbmZvLCBGaWxlSW5mbywgUGF0aCwgZG9jdW1lbnRSb290IH0gZnJvbSAnLi4vc2hhcmVkL0ZpbGVTeXN0ZW0nO1xyXG5pbXBvcnQgeyBEb2N1bWVudE5hbWUsIGRvY3VtZW50TWFwLCBkb2N1bWVudFNlcnZpY2UgfSBmcm9tICcuL0RvY3VtZW50U2VydmljZSc7XHJcbmltcG9ydCB7IElEb2N1bWVudFNlcnZpY2UgfSBmcm9tICcuL0lEb2N1bWVudFNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJU2lkZWJhclNlcnZpY2UgfSBmcm9tICcuL0lTaWRlYmFyU2VydmljZSc7XHJcbmNvbnN0IHNvbHZlU2hhcnBTaWduID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gIGlmICh0ZXh0LmluY2x1ZGVzKCdzaGFycCcpKSByZXR1cm4gdGV4dC5yZXBsYWNlKCdzaGFycCcsICcjJyk7XHJcbiAgaWYgKHRleHQuaW5jbHVkZXMoJ1NoYXJwJykpIHJldHVybiB0ZXh0LnJlcGxhY2UoJ1NoYXJwJywgJyMnKTtcclxuICByZXR1cm4gdGV4dDtcclxufTtcclxuY2xhc3MgU2lkZWJhclNlcnZpY2UgaW1wbGVtZW50cyBJU2lkZWJhclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgYmFzZTogc3RyaW5nID0gYC8ke2RvY3VtZW50Um9vdCgpLm5hbWV9YDtcclxuICByZWFkb25seSBkb2N1bWVudFNlcnZpY2U6IElEb2N1bWVudFNlcnZpY2UgPSBkb2N1bWVudFNlcnZpY2U7XHJcbiAgZ2V0TXVsdGlwbGVTaWRlYmFyKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFyTXVsdGkge1xyXG4gICAgbGV0IHNpZGViYXI6IERlZmF1bHRUaGVtZS5TaWRlYmFyTXVsdGkgPSB7fTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhkb2N1bWVudE1hcCkpIHtcclxuICAgICAgc2lkZWJhcltgJHt0aGlzLmJhc2V9LyR7bmFtZX0vZG9jcy9gXSA9IHRoaXMuZ2V0U2lkZWJhck9mRG9jdW1lbnQobmFtZSBhcyBEb2N1bWVudE5hbWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNpZGViYXI7XHJcbiAgfVxyXG4gIGdldFNpZGViYXJPZkRvY3VtZW50KG5hbWU6IERvY3VtZW50TmFtZSk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcclxuICAgIGNvbnN0IG1hcmtkb3duRW50cnkgPSB0aGlzLmRvY3VtZW50U2VydmljZS5nZXRNYXJrZG93bkVudHJ5Rm9sZGVyKG5hbWUgYXMgRG9jdW1lbnROYW1lKTtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBzb2x2ZVNoYXJwU2lnbihuYW1lKSxcclxuICAgICAgICBpdGVtczogdGhpcy50cmFuc2Zvcm1Gb2xkZXJUb1NpZGViYXJJdGVtKG1hcmtkb3duRW50cnksIGAke3RoaXMuYmFzZX0vJHtuYW1lfWApLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgdHJhbnNmb3JtRm9sZGVyVG9TaWRlYmFySXRlbShmb2xkZXI6IERpcmVjdG9yeUluZm8sIGJhc2U6IHN0cmluZyk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcclxuICAgIGNvbnN0IHN1YnMgPSBmb2xkZXIuZ2V0RGlyZWN0b3JpZXMoKTtcclxuICAgIC8vIGxvYWQgZmlsZXMgaW4gdGhpcyBmb2xkZXJcclxuICAgIGxldCBpdGVtczogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10gPSBmb2xkZXIuZ2V0RmlsZXMoKS5sZW5ndGhcclxuICAgICAgPyBmaWxlc1RvU2lkZWJhckl0ZW1zKGZvbGRlci5nZXRGaWxlcygpLCBgJHtiYXNlfS8ke2ZvbGRlci5uYW1lfWApXHJcbiAgICAgIDogW107XHJcbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIHN1YnMpIHtcclxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdWJzLCBpbmRleCkpIHtcclxuICAgICAgICBjb25zdCBzdWIgPSBzdWJzW2luZGV4XTtcclxuICAgICAgICBjb25zdCBjdXJyZW50U2lkZWJhckl0ZW06IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbSA9IHtcclxuICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICB0ZXh0OiBzb2x2ZVNoYXJwU2lnbihzdWIubmFtZS5yZXBsYWNlKC9eXFxkK1xcLlxccyovLCAnJykpLCAvLyByZW1vdmUgbGVhZGluZyBpbmRleFxyXG4gICAgICAgICAgaXRlbXM6IHRoaXMudHJhbnNmb3JtRm9sZGVyVG9TaWRlYmFySXRlbShzdWIsIGAke2Jhc2V9LyR7Zm9sZGVyLm5hbWV9YCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpdGVtcy5wdXNoKGN1cnJlbnRTaWRlYmFySXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpdGVtcztcclxuICAgIGZ1bmN0aW9uIGZpbGVzVG9TaWRlYmFySXRlbXMoZmlsZXM6IEZpbGVJbmZvW10sIGJhc2U6IHN0cmluZyk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcclxuICAgICAgcmV0dXJuIGZpbGVzXHJcbiAgICAgICAgLm1hcChmaWxlID0+IHtcclxuICAgICAgICAgIGNvbnN0IGxpbmsgPSBgJHtiYXNlfS8ke2ZpbGUubmFtZX1gO1xyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGV4dDogc29sdmVTaGFycFNpZ24oUGF0aC5HZXRGaWxlTmFtZVdpdGhvdXRFeHRlbnNpb24oZmlsZS5uYW1lKSksXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmsuc3Vic3RyaW5nKDAsIGxpbmsubGFzdEluZGV4T2YoJy4nKSksXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnQoKHgsIHkpID0+IHtcclxuICAgICAgICAgIC8vICAgaWYgKCEvXlxcZCtcXC5cXHMqLy50ZXN0KHgudGV4dCkgfHwgIS9eXFxkK1xcLlxccyovLnRlc3QoeS50ZXh0KSlcclxuICAgICAgICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAvLyAgICAgICBgRmlsZXM6XFxuJHtFbnVtZXJhYmxlLmZyb20oZmlsZXMpXHJcbiAgICAgICAgICAvLyAgICAgICAgIC5zZWxlY3QoZiA9PiBmLmZ1bGxOYW1lKVxyXG4gICAgICAgICAgLy8gICAgICAgICAuYWdncmVnYXRlKFxyXG4gICAgICAgICAgLy8gICAgICAgICAgIChwcmV2LCBjdXJyZW50KSA9PiBgJHtwcmV2fSxcXG4ke2N1cnJlbnR9XFxuYFxyXG4gICAgICAgICAgLy8gICAgICAgICApfSBkb24ndCBoYXZlIGNvbnNpc3RlbnQgbGVhZGluZyBpbmRpY2VzLmBcclxuICAgICAgICAgIC8vICAgICApO1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGFyc2VJbnQoeC50ZXh0Lm1hdGNoKC9eXFxkK1xcLlxccyovKT8uWzBdISkgLSBwYXJzZUludCh5LnRleHQubWF0Y2goL15cXGQrXFwuXFxzKi8pPy5bMF0hKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzaWRlYmFyU2VydmljZTogSVNpZGViYXJTZXJ2aWNlID0gbmV3IFNpZGViYXJTZXJ2aWNlKCk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccmVwb1xcXFxzaGFycGNoZW4uZ2l0aHViLmlvXFxcXGRvY3NcXFxcc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFxkb2NzXFxcXHNlcnZpY2VzXFxcXFRoZW1lU2VydmljZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXMvVGhlbWVTZXJ2aWNlLnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgc2hpa2kgZnJvbSAnc2hpa2knO1xyXG5pbXBvcnQgeyB0aGVtZXMgYXMgdGhlbWVJbmZvIH0gZnJvbSAnLi4vLi4vLmdpdGh1Yi93b3JrZmxvd3MvYmVmb3JlQnVpbGQvc3luYy10aGVtZXMubWpzJztcclxuaW1wb3J0IHR5cGUgeyBUZXh0bWF0ZVRoZW1lIH0gZnJvbSAnLi4vLi4vLmdpdGh1Yi93b3JrZmxvd3MvYmVmb3JlQnVpbGQvdHlwZXMubWpzJztcclxuaW1wb3J0IHsgcHJvamVjdFJvb3QgfSBmcm9tICcuLi9zaGFyZWQvRmlsZVN5c3RlbSc7XHJcbmltcG9ydCB7IElUaGVtZVNlcnZpY2UsIFRoZW1lTmFtZSB9IGZyb20gJy4vSVRoZW1lU2VydmljZSc7XHJcbmNvbnN0IGhpZ2hsaWdodGVyID0gYXdhaXQgc2hpa2kuZ2V0U2luZ2xldG9uSGlnaGxpZ2h0ZXIoKTtcclxuY2xhc3MgVGhlbWVTZXJ2aWNlIGltcGxlbWVudHMgSVRoZW1lU2VydmljZSB7XHJcbiAgcmVhZG9ubHkgaW5uZXJUaGVtZVNlcnZpY2U6IEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2Ygc2hpa2kuZ2V0U2luZ2xldG9uSGlnaGxpZ2h0ZXI+PiA9XHJcbiAgICBoaWdobGlnaHRlcjtcclxuICBhc3luYyByZWdpc3Rlcih0aGVtZTogVGV4dG1hdGVUaGVtZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHRoaXMuaXNUaGVtZVJlZ2lzdGVyZWQodGhlbWUubmFtZSBhcyBUaGVtZU5hbWUpKSByZXR1cm47XHJcbiAgICB0aGlzLmlubmVyVGhlbWVTZXJ2aWNlLmxvYWRUaGVtZSh0aGVtZSk7XHJcbiAgfVxyXG4gIGFzeW5jIGdldFRoZW1lKG5hbWU6IFRoZW1lTmFtZSk6IFByb21pc2U8c2hpa2kuVGhlbWVSZWdpc3RyYXRpb24+IHtcclxuICAgIGlmICghdGhpcy5pc1RoZW1lUmVnaXN0ZXJlZChuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBUaGVtZSBcXGAke25hbWV9XFxgIG5vdCByZWdpc3RlcmVkLmApO1xyXG4gICAgcmV0dXJuIHRoaXMuaW5uZXJUaGVtZVNlcnZpY2UuZ2V0VGhlbWUobmFtZSk7XHJcbiAgfVxyXG4gIHRoZW1lcygpOiBhbnlbXSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XHJcbiAgfVxyXG4gIGlzVGhlbWVSZWdpc3RlcmVkKG5hbWU6IFRoZW1lTmFtZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5uZXJUaGVtZVNlcnZpY2UuZ2V0TG9hZGVkVGhlbWVzKCkuaW5jbHVkZXMobmFtZSk7XHJcbiAgfVxyXG4gIHBoeXNpY2FsUGF0aE9mVGhlbWUobmFtZTogVGhlbWVOYW1lKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHJldCA9IHBhdGguam9pbihwcm9qZWN0Um9vdCgpLmZ1bGxOYW1lLCBgcHVibGljLyR7bmFtZX0uanNvbmApO1xyXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHJldCkpIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfS5qc29uIGRvZXMgbm90IGV4aXN0IGF0IC9wdWJsaWNgKTtcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHBhcnNlVGhlbWUoZmlsZVBhdGg6IHN0cmluZyk6IFRleHRtYXRlVGhlbWUge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKSk7XHJcbiAgfVxyXG4gIGFzeW5jIGluaXRpYWxpemVSZWdpc3RyYXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgKE9iamVjdC5lbnRyaWVzKHRoZW1lSW5mbykgYXMgW1RoZW1lTmFtZSwgc3RyaW5nXVtdKS5tYXAoYXN5bmMgeCA9PiB7XHJcbiAgICAgICAgY29uc3QgcCA9IHRoaXMucGh5c2ljYWxQYXRoT2ZUaGVtZSh4WzBdKTtcclxuICAgICAgICBjb25zdCBqc29uID0gdGhpcy5wYXJzZVRoZW1lKHApO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVnaXN0ZXIoanNvbik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5leHBvcnQgY29uc3QgdGhlbWVTZXJ2aWNlOiBJVGhlbWVTZXJ2aWNlID0gbmV3IFRoZW1lU2VydmljZSgpO1xyXG5hd2FpdCB0aGVtZVNlcnZpY2UuaW5pdGlhbGl6ZVJlZ2lzdHJhdGlvbigpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHJlcG9cXFxcc2hhcnBjaGVuLmdpdGh1Yi5pb1xcXFwuZ2l0aHViXFxcXHdvcmtmbG93c1xcXFxiZWZvcmVCdWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccmVwb1xcXFxzaGFycGNoZW4uZ2l0aHViLmlvXFxcXC5naXRodWJcXFxcd29ya2Zsb3dzXFxcXGJlZm9yZUJ1aWxkXFxcXHN5bmMtdGhlbWVzLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvLy5naXRodWIvd29ya2Zsb3dzL2JlZm9yZUJ1aWxkL3N5bmMtdGhlbWVzLm1qc1wiO2ltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0ICogYXMgSlNPTkMgZnJvbSAnanNvbmMtcGFyc2VyJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRoZW1lcyA9IHtcclxuICAnRXZhIERhcmsnOiAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3NoYXJwY2hlbi9FdmEtVGhlbWUvdmFyaWFudC90aGVtZXMvRXZhLURhcmsuanNvbicsXHJcbiAgJ0V2YSBMaWdodCc6XHJcbiAgICAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3NoYXJwY2hlbi9FdmEtVGhlbWUvdmFyaWFudC90aGVtZXMvRXZhLUxpZ2h0Lmpzb24nLFxyXG59O1xyXG5leHBvcnQgY29uc3QganNvbk91dERpciA9IHBhdGguam9pbihcclxuICBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSxcclxuICAnLi4vLi4vLi4vZG9jcy9wdWJsaWMvJ1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHJldHVybnMge1Byb21pc2U8aW1wb3J0KCcuL3R5cGVzLm1qcycpLlRleHRtYXRlVGhlbWUgfCB1bmRlZmluZWQ+fVxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRoZW1lSnNvbih1cmwpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcclxuICAgIGNvbnN0IHRleHQgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7aW1wb3J0KCcuL3R5cGVzLm1qcycpLlRleHRtYXRlVGhlbWV9XHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGpzb24gPSBKU09OQy5wYXJzZSh0ZXh0KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IGpzb24ubmFtZSxcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0b2tlbkNvbG9yczoganNvbi50b2tlbkNvbG9ycy5tYXAociA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgc2NvcGU6IHIuc2NvcGUsIHNldHRpbmdzOiByLnNldHRpbmdzIH07XHJcbiAgICAgIH0pLFxyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS53YXJuKGBGZXRjaCAke3VybH0gZmFpbGVkIWAsIGVycm9yKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jQWxsVGhlbWVzKCkge1xyXG4gIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgT2JqZWN0LmVudHJpZXModGhlbWVzKS5tYXAoYXN5bmMgeCA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IHhbMV07XHJcbiAgICAgIGNvbnN0IHRoZW1lSnNvbiA9IGF3YWl0IGdldFRoZW1lSnNvbih1cmwpO1xyXG4gICAgICBjb25zdCBuYW1lID0geFswXTtcclxuICAgICAgaWYgKHRoZW1lSnNvbikge1xyXG4gICAgICAgIGF3YWl0IGZzLndyaXRlRmlsZShcclxuICAgICAgICAgIHBhdGguam9pbihqc29uT3V0RGlyLCBuYW1lICsgJy5qc29uJyksXHJcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGVtZUpzb24sIG51bGwsIDIpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IHN5bmNlZCB0aGVtZTogJHtuYW1lfWApO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICk7XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsbUJBQW1CO0FB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QUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7QUFDTyxJQUFNLGVBQThCLElBQUksYUFBYTtBQUM1RCxNQUFNLGFBQWEsdUJBQXVCOzs7QUovQjFDLElBQU0sa0JBQWtCLGFBQWE7QUFBQSxFQUNuQyxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsTUFDTCxPQUFPLE1BQU0sYUFBYSxTQUFTLFdBQVc7QUFBQSxNQUM5QyxNQUFNLE1BQU0sYUFBYSxTQUFTLFVBQVU7QUFBQSxJQUM5QztBQUFBLElBQ0Esa0JBQWtCLENBQUMsb0JBQW9CLENBQUM7QUFBQSxFQUMxQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxRQUFRLE1BQU0sZUFBZSxDQUFDLENBQUM7QUFBQSxFQUN0RCxPQUFPO0FBQUEsRUFDUCxlQUFlO0FBQUEsRUFDZixhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUE7QUFBQSxJQUVYLEtBQUs7QUFBQSxNQUNILEVBQUUsTUFBTSxRQUFRLE1BQU0sSUFBSTtBQUFBLE1BQzFCLEVBQUUsTUFBTSxTQUFTLE1BQU0sY0FBYztBQUFBLE1BQ3JDLEVBQUUsTUFBTSxXQUFXLE1BQU0sZ0JBQWdCO0FBQUEsSUFDM0M7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLFNBQVMsZUFBZSxtQkFBbUI7QUFBQSxJQUMzQyxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsYUFBYSxDQUFDLEVBQUUsTUFBTSxVQUFVLE1BQU0sK0JBQStCLENBQUM7QUFBQSxJQUN0RSxXQUFXO0FBQUEsSUFDWCxrQkFBa0I7QUFBQSxJQUNsQixhQUFhO0FBQUEsTUFDWCxNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLFNBQVMsQ0FBQyxFQUFFLFNBQVMsTUFBTTtBQUN6QixlQUFPLG1FQUFtRSxRQUFRO0FBQUEsTUFDcEY7QUFBQSxNQUNBLE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFPRCxJQUFPLGlCQUFRLFlBQVksRUFBRSxHQUFJLENBQUMsR0FBMkIsR0FBRyxnQkFBZ0IsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJzb2x2ZVNoYXJwU2lnbiIsICJsaW5rIiwgIm5hbWUiLCAiZmlsZSIsICJiYXNlIiwgImZzIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIiwgInBhdGgiXQp9Cg==
