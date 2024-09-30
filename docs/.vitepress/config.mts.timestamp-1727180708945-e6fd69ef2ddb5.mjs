// docs/.vitepress/config.mts
import { transformerTwoslash } from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/@shikijs+vitepress-twoslash@1.9.0_typescript@5.4.5/node_modules/@shikijs/vitepress-twoslash/dist/index.mjs";
import { defineConfig } from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/vitepress@1.3.3_@algolia+client-search@4.23.3_@types+node@20.14.5_axios@1.7.2_postcss@8.4.41__3cemrvjez3bftcoqiyprwe4uxe/node_modules/vitepress/dist/node/index.js";
import { withMermaid } from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/vitepress-plugin-mermaid@2.0.16_mermaid@10.9.1_vitepress@1.3.3_@algolia+client-search@4.23.3__vjkurtaeowojifhgrgml3l3xu4/node_modules/vitepress-plugin-mermaid/dist/vitepress-plugin-mermaid.es.mjs";

// docs/services/DocumentService.ts
import fg from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js";
import Enumerable from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/linq@4.0.3/node_modules/linq/linq.js";

// docs/shared/FileSystem.ts
import * as fs from "fs";
import * as path from "path";
var __vite_injected_original_dirname = "/home/sharpchen/desktop/repo/sharpchen.github.io/docs/shared";
var FileSystemInfo = class {
  path;
  constructor(path3) {
    this.path = path3;
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
    if (count < 0) throw new Error("count must be greater than or equal to 0");
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
  static GetFileNameWithoutExtension(path3) {
    const fileName = new FileInfo(path3).name;
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
var documentMap = {
  "Csharp Design Patterns": { icon: "\u{1F47E}", description: "Design Patterns in C#" },
  "Modern CSharp": { icon: "\u{1F996}", description: "Modernized C# since 2015?" },
  Articles: { icon: "\u{1F4F0}", description: "Regular articles" },
  Avalonia: { icon: "\u{1F631}", description: "AvaloniaUI" },
  Docker: { icon: "\u{1F433}", description: "Ultimate Docker" },
  Git: { icon: "\u{1F638}", description: "Git mastery" },
  JavaScript: { icon: "\u{1F605}", description: "JavaScript for C# developer" },
  SQL: { icon: "\u{1F9AD}", description: "SQL syntax for beginners" },
  TypeScript: { icon: "\u{1F92F}", description: "TypeScript for C# developer" },
  // VBA: { icon: '💩', description: 'VBA for excel' },
  Vue3: { icon: "\u26A1", description: "Vue3 for .NET blazor developer" },
  "Unsafe CSharp": { icon: "\u{1F60E}", description: "Entering the danger zone..." },
  "NeoVim ColorScheme Development": {
    icon: "\u{1F3A8}",
    description: "Make your own nvim color scheme using lua."
  },
  Bash: { icon: "\u{1F422}", description: "Shebang!" },
  "Regular Expression": { icon: "\u{1F42B}", description: "Memory lossss for every 6 months" },
  Nix: { icon: "\u2744", description: "Reproduce freedom" },
  "Entity Framework Core": { icon: "\u{1F5FF}", description: "" }
};
var DocumentService = class {
  isEmptyDocument(name) {
    try {
      const entry = this.getMarkdownEntryFolder(name);
      return fg.globSync("**/*.md", { cwd: entry.fullName }).length === 0;
    } catch (error) {
      return true;
    }
  }
  documentInfo = documentMap;
  getDocumentEntryFolder(name) {
    const ret = this.registeredDocumentFolders().find((x) => x.name === name);
    if (!ret) throw new Error(`Document entry of "${name}" not found.`);
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
    if (!ret) throw new Error(`Markdown entry of "${name}" not found.`);
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
    if (this.isEmptyDocument(name)) return "/";
    const solveSharpSign2 = (link2) => {
      if (link2.includes("Csharp")) return link2.replace("#", "Csharp");
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
      linkContext += `${file?.directory.up(i)?.name}/`;
    }
    const link = `${linkContext}${firstFolder?.name}/${Path.GetFileNameWithoutExtension(
      file?.name
    )}`;
    return shouldSolveSharpSign(name) ? solveSharpSign2(link) : link;
  }
  get documentSrc() {
    const ret = projectRoot().getDirectories().find((x) => x.name === "document");
    if (!ret) throw new Error("Document source not found.");
    return ret;
  }
  tryGetFirstChapterFolderOfDocument(name) {
    const markdownEntry = this.getMarkdownEntryFolder(name);
    return getFirst(markdownEntry);
    function getFirst(current, depth = 1) {
      const nextLevelsSorted = Enumerable.from(
        current.getDirectories().filter((x) => x.getFiles().length > 0 || x.getDirectories().length > 0)
      ).orderBy((x) => x.name);
      if (!nextLevelsSorted.count()) return { firstFolder: current, depth };
      return getFirst(nextLevelsSorted.first(), depth + 1);
    }
  }
  tryGetFormulaNameOfDocument(name) {
    if (name.includes("Csharp")) return name.replace("Csharp", "C#");
    if (name.includes("Sharp")) return name.replace("Sharp", "#");
    return name;
  }
};
var documentService = new DocumentService();

// docs/services/SidebarService.ts
import { execSync } from "node:child_process";
import path2 from "node:path";
var solveSharpSign = (text) => {
  if (text.includes("sharp")) return text.replace("sharp", "#");
  if (text.includes("Sharp")) return text.replace("Sharp", "#");
  return text;
};
var SidebarService = class {
  base = `/${documentRoot().name}`;
  documentService = documentService;
  getMultipleSidebar() {
    const sidebar = {};
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
        items: name === "Articles" ? this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`).sort(
          (a, b) => compareTrackedDate(a, b)
        ) : this.transformFolderToSidebarItem(markdownEntry, `${this.base}/${name}`)
      }
    ];
    function compareTrackedDate(a, b) {
      return gitTrackedDate(a.link) - gitTrackedDate(b.link);
    }
    function gitTrackedDate(file) {
      const dateStr = execSync(
        `git log --diff-filter=A --format="%cI" -- '${path2.join(documentRoot().fullName, file)}.md'`
      ).toString().trim();
      console.log(
        `current command: ${`git log --diff-filter=A --format="%cI" -- "${path2.join(documentRoot().fullName, file)}.md"`}`
      );
      console.log(`current timestamp: ${dateStr}`);
      const foo = new Date(dateStr);
      console.log(`current date converted: ${foo}`);
      return foo;
    }
  }
  transformFolderToSidebarItem(folder, base) {
    const subs = folder.getDirectories();
    const items = folder.getFiles().length ? filesToSidebarItems(folder.getFiles(), `${base}/${folder.name}`) : [];
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
import axios from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/axios@1.7.2/node_modules/axios/index.js";
import * as shiki from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/shiki@1.7.0/node_modules/shiki/dist/index.mjs";

// docs/services/GithubService.ts
import { Octokit } from "file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/octokit@4.0.2/node_modules/octokit/dist-bundle/index.js";
var octokit;
var GithubRepositoryEndPointMethods = class {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
  }
  async fetchStructureByPath(path3) {
    return (await octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: path3
    })).data;
  }
  async getTree(options) {
    const branch = options.branch ?? "main";
    let sha;
    try {
      sha = options.branchSHA ?? (await octokit.rest.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branch}`
      })).data.object.sha;
    } catch (error) {
      console.log(
        `Error fetching ref of ${JSON.stringify({
          repo: `${this.owner}/${this.repo}`,
          branch
        })}`,
        error
      );
      throw error;
    }
    try {
      return (await octokit.rest.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: sha,
        recursive: "true"
      })).data.tree;
    } catch (error) {
      console.log(
        `Error fetching tree of ${JSON.stringify({
          repo: `${this.owner}/${this.repo}`,
          branch
        })}`,
        error
      );
      throw error;
    }
  }
  async getFiles(dir, searchOption) {
    const current = await this.fetchStructureByPath(dir);
    switch (searchOption) {
      case "top":
        return current.filter((x) => x.type === "file");
      case "deep":
        return [
          ...current.filter((x) => x.type === "file"),
          ...await dive(
            current.filter((x) => x.type === "dir"),
            this
          )
        ];
    }
    async function dive(dirs, self) {
      const tasks = dirs.map(async (x) => {
        const nexts = await self.fetchStructureByPath(x.path);
        const currentFiles = nexts.filter((x2) => x2.type === "file");
        const currentDirs = nexts.filter((x2) => x2.type === "dir");
        const restFiles = currentDirs.length ? await dive(currentDirs, self) : [];
        return [...currentFiles, ...restFiles];
      });
      return (await Promise.all(tasks)).flat();
    }
  }
  async getFileInfo(path3) {
    const repo = `${this.owner}/${this.repo}`;
    if (/^[\w.]+\/\b[-\w]+\b$/.test(repo)) {
      const split = repo.split("/");
      const owner = split[0];
      const _repo = split[1];
      return (await octokit.rest.repos.getContent({
        owner,
        repo: _repo,
        path: path3
      })).data;
    }
    throw new Error();
  }
};
var GithubService = class {
  constructor(token) {
    octokit = new Octokit({
      auth: token
    });
  }
  fromRepository(repo) {
    if (typeof repo === "string" && /^[\w.]+\/\b[-\w]+\b$/.test(repo)) {
      const split = repo.split("/");
      return new GithubRepositoryEndPointMethods(split[0], split[1]);
    }
    if (repo instanceof Object) {
      return new GithubRepositoryEndPointMethods(repo.owner, repo.repo);
    }
    throw new Error("pattern invalid");
  }
};
var githubService = new GithubService(process.env.GITHUB_TOKEN);

// docs/services/ThemeService.ts
var highlighter = await shiki.getSingletonHighlighter();
var themeInfos = {
  "Eva Light": { repo: "fisheva/Eva-Theme", path: "themes/Eva-Light.json", branch: "master" },
  "Eva Dark": { repo: "fisheva/Eva-Theme", path: "themes/Eva-Dark.json", branch: "master" }
};
var ThemeService = class {
  innerThemeService = highlighter;
  async register(theme) {
    if (this.isThemeRegistered(theme.name)) return;
    this.innerThemeService.loadTheme(theme);
  }
  async getTheme(name) {
    if (!this.isThemeRegistered(name)) throw new Error(`Theme \`${name}\` not registered.`);
    return this.innerThemeService.getTheme(name);
  }
  isThemeRegistered(name) {
    return this.innerThemeService.getLoadedThemes().includes(name);
  }
  async fetchThemeObject(info) {
    const url = (await githubService.fromRepository(info.repo).getFileInfo(info.path)).download_url;
    try {
      const response = await axios.get(url, { responseType: "text" });
      const theme = (await import("file:///home/sharpchen/desktop/repo/sharpchen.github.io/node_modules/.pnpm/jsonc-parser@3.2.1/node_modules/jsonc-parser/lib/umd/main.js")).parse(response.data);
      return theme;
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      throw error;
    }
  }
  async initializeRegistration() {
    await Promise.all(
      Object.entries(themeInfos).map(async (x) => {
        const theme = await this.fetchThemeObject(x[1]);
        await this.register(theme);
        console.log(`Textmate theme: \`${x[0]}\` has loaded.`);
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
      {
        text: "Documents",
        items: Object.keys(documentService.documentInfo).filter((x) => x !== "Articles").map((key) => ({
          text: `${documentService.documentInfo[key].icon} ${key}`,
          link: documentService.tryGetIndexLinkOfDocument(key)
        }))
      },
      {
        text: "Articles",
        link: documentService.tryGetIndexLinkOfDocument("Articles")
      },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAiZG9jcy9zZXJ2aWNlcy9Eb2N1bWVudFNlcnZpY2UudHMiLCAiZG9jcy9zaGFyZWQvRmlsZVN5c3RlbS50cyIsICJkb2NzL3NlcnZpY2VzL1NpZGViYXJTZXJ2aWNlLnRzIiwgImRvY3Mvc2VydmljZXMvVGhlbWVTZXJ2aWNlLnRzIiwgImRvY3Mvc2VydmljZXMvR2l0aHViU2VydmljZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzLy52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtpbXBvcnQgeyB0cmFuc2Zvcm1lclR3b3NsYXNoIH0gZnJvbSAnQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoJztcbmltcG9ydCB0eXBlIHsgTWVybWFpZENvbmZpZyB9IGZyb20gJ21lcm1haWQnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJztcbmltcG9ydCB7IHdpdGhNZXJtYWlkIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1tZXJtYWlkJztcbmltcG9ydCB7IHR5cGUgRG9jdW1lbnROYW1lLCBkb2N1bWVudFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9Eb2N1bWVudFNlcnZpY2UnO1xuaW1wb3J0IHsgc2lkZWJhclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9TaWRlYmFyU2VydmljZSc7XG5pbXBvcnQgeyB0aGVtZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9UaGVtZVNlcnZpY2UnO1xudHlwZSBWaXRlcHJlc3NUaGVtZVR5cGUgPSBFeGNsdWRlPFxuICBFeGNsdWRlPFBhcmFtZXRlcnM8dHlwZW9mIGRlZmluZUNvbmZpZz5bMF1bJ21hcmtkb3duJ10sIHVuZGVmaW5lZD5bJ3RoZW1lJ10sXG4gIHVuZGVmaW5lZFxuPjtcbnR5cGUgU2hpa2lUaGVtZVR5cGUgPSBFeGNsdWRlPEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2YgdGhlbWVTZXJ2aWNlLmdldFRoZW1lPj4sIG51bGw+O1xudHlwZSBJcyA9IFNoaWtpVGhlbWVUeXBlIGV4dGVuZHMgVml0ZXByZXNzVGhlbWVUeXBlID8gdHJ1ZSA6IGZhbHNlO1xuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuY29uc3Qgdml0ZXByZXNzQ29uZmlnID0gZGVmaW5lQ29uZmlnKHtcbiAgY2xlYW5VcmxzOiB0cnVlLFxuICBtYXJrZG93bjoge1xuICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgIHRoZW1lOiB7XG4gICAgICBsaWdodDogYXdhaXQgdGhlbWVTZXJ2aWNlLmdldFRoZW1lKCdFdmEgTGlnaHQnKSxcbiAgICAgIGRhcms6IGF3YWl0IHRoZW1lU2VydmljZS5nZXRUaGVtZSgnRXZhIERhcmsnKSxcbiAgICB9LFxuICAgIGNvZGVUcmFuc2Zvcm1lcnM6IFt0cmFuc2Zvcm1lclR3b3NsYXNoKCldLFxuICB9LFxuICBsb2NhbGVzOiB7XG4gICAgcm9vdDoge1xuICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcbiAgICAgIGxhbmc6ICdlbicsXG4gICAgfSxcbiAgfSxcbiAgaGVhZDogW1snbGluaycsIHsgcmVsOiAnaWNvbicsIGhyZWY6ICcvZmF2aWNvbi5pY28nIH1dXSxcbiAgdGl0bGU6ICdEb2N1bWVudGVkIE5vdGVzJyxcbiAgdGl0bGVUZW1wbGF0ZTogJ3NoYXJwY2hlbicsXG4gIGRlc2NyaXB0aW9uOiAnUGVyc29uYWwgRG9jdW1lbnRlZCBOb3RlcycsXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xuICAgIG5hdjogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnRG9jdW1lbnRzJyxcbiAgICAgICAgaXRlbXM6IE9iamVjdC5rZXlzKGRvY3VtZW50U2VydmljZS5kb2N1bWVudEluZm8pXG4gICAgICAgICAgLmZpbHRlcigoeCk6IHggaXMgRG9jdW1lbnROYW1lID0+IHggIT09ICdBcnRpY2xlcycpXG4gICAgICAgICAgLm1hcChrZXkgPT4gKHtcbiAgICAgICAgICAgIHRleHQ6IGAke2RvY3VtZW50U2VydmljZS5kb2N1bWVudEluZm9ba2V5XS5pY29ufSAke2tleX1gLFxuICAgICAgICAgICAgbGluazogZG9jdW1lbnRTZXJ2aWNlLnRyeUdldEluZGV4TGlua09mRG9jdW1lbnQoa2V5KSxcbiAgICAgICAgICB9KSksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnQXJ0aWNsZXMnLFxuICAgICAgICBsaW5rOiBkb2N1bWVudFNlcnZpY2UudHJ5R2V0SW5kZXhMaW5rT2ZEb2N1bWVudCgnQXJ0aWNsZXMnKSxcbiAgICAgIH0sXG4gICAgICB7IHRleHQ6ICdIb21lJywgbGluazogJy8nIH0sXG4gICAgICB7IHRleHQ6ICdBYm91dCcsIGxpbms6ICcuLi9hYm91dC5tZCcgfSxcbiAgICAgIHsgdGV4dDogJ0NvbnRhY3QnLCBsaW5rOiAnLi4vY29udGFjdC5tZCcgfSxcbiAgICBdLFxuICAgIGxvZ286ICcvZmF2aWNvbi5pY28nLFxuICAgIHNpZGViYXI6IHNpZGViYXJTZXJ2aWNlLmdldE11bHRpcGxlU2lkZWJhcigpLFxuICAgIG91dGxpbmU6IHtcbiAgICAgIGxldmVsOiAnZGVlcCcsXG4gICAgfSxcbiAgICBzb2NpYWxMaW5rczogW3sgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vc2hhcnBjaGVuJyB9XSxcbiAgICBzaXRlVGl0bGU6ICdzaGFycGNoZW4nLFxuICAgIGV4dGVybmFsTGlua0ljb246IHRydWUsXG4gICAgbGFzdFVwZGF0ZWQ6IHtcbiAgICAgIHRleHQ6ICdMYXN0IHVwZGF0ZWQnLFxuICAgIH0sXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcbiAgICB9LFxuICAgIGVkaXRMaW5rOiB7XG4gICAgICBwYXR0ZXJuOiAoeyBmaWxlUGF0aCB9KSA9PiB7XG4gICAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL3NoYXJwY2hlbi9zaGFycGNoZW4uZ2l0aHViLmlvL2VkaXQvbWFpbi9kb2NzLyR7ZmlsZVBhdGh9YDtcbiAgICAgIH0sXG4gICAgICB0ZXh0OiAnRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViJyxcbiAgICB9LFxuICB9LFxufSk7XG50eXBlIE1lcm1haWRQbHVnaW5Db25maWcgPSB7XG4gIG1lcm1haWQ6IE1lcm1haWRDb25maWc7XG4gIG1lcm1haWRQbHVnaW46IHtcbiAgICBjbGFzczogJyc7XG4gIH07XG59O1xuZXhwb3J0IGRlZmF1bHQgd2l0aE1lcm1haWQoeyAuLi4oe30gYXMgTWVybWFpZFBsdWdpbkNvbmZpZyksIC4uLnZpdGVwcmVzc0NvbmZpZyB9KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvc2hhcnBjaGVuL2Rlc2t0b3AvcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzL3NlcnZpY2VzL0RvY3VtZW50U2VydmljZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zZXJ2aWNlcy9Eb2N1bWVudFNlcnZpY2UudHNcIjsvLyBpbXBvcnQgeyBEb2N1bWVudE5hbWUsIGRvY3VtZW50TWFwIH0gZnJvbSAnLi4vc2VydmljZXMvSURvY3VtZW50U2VydmljZSc7XG5pbXBvcnQgZmcgZnJvbSAnZmFzdC1nbG9iJztcbmltcG9ydCBFbnVtZXJhYmxlIGZyb20gJ2xpbnEnO1xuaW1wb3J0ICogYXMgRmlsZSBmcm9tICcuLi9zaGFyZWQvRmlsZVN5c3RlbSc7XG5pbXBvcnQgdHlwZSB7IElEb2N1bWVudFNlcnZpY2UgfSBmcm9tICcuL0lEb2N1bWVudFNlcnZpY2UnO1xuZXhwb3J0IHR5cGUgRG9jdW1lbnRJbmZvID0gUmVjb3JkPHN0cmluZywgeyBpY29uOiBzdHJpbmc7IGRlc2NyaXB0aW9uOiBzdHJpbmcgfT47XG5leHBvcnQgY29uc3QgZG9jdW1lbnRNYXAgPSB7XG4gICdDc2hhcnAgRGVzaWduIFBhdHRlcm5zJzogeyBpY29uOiAnXHVEODNEXHVEQzdFJywgZGVzY3JpcHRpb246ICdEZXNpZ24gUGF0dGVybnMgaW4gQyMnIH0sXG4gICdNb2Rlcm4gQ1NoYXJwJzogeyBpY29uOiAnXHVEODNFXHVERDk2JywgZGVzY3JpcHRpb246ICdNb2Rlcm5pemVkIEMjIHNpbmNlIDIwMTU/JyB9LFxuICBBcnRpY2xlczogeyBpY29uOiAnXHVEODNEXHVEQ0YwJywgZGVzY3JpcHRpb246ICdSZWd1bGFyIGFydGljbGVzJyB9LFxuICBBdmFsb25pYTogeyBpY29uOiAnXHVEODNEXHVERTMxJywgZGVzY3JpcHRpb246ICdBdmFsb25pYVVJJyB9LFxuICBEb2NrZXI6IHsgaWNvbjogJ1x1RDgzRFx1REMzMycsIGRlc2NyaXB0aW9uOiAnVWx0aW1hdGUgRG9ja2VyJyB9LFxuICBHaXQ6IHsgaWNvbjogJ1x1RDgzRFx1REUzOCcsIGRlc2NyaXB0aW9uOiAnR2l0IG1hc3RlcnknIH0sXG4gIEphdmFTY3JpcHQ6IHsgaWNvbjogJ1x1RDgzRFx1REUwNScsIGRlc2NyaXB0aW9uOiAnSmF2YVNjcmlwdCBmb3IgQyMgZGV2ZWxvcGVyJyB9LFxuICBTUUw6IHsgaWNvbjogJ1x1RDgzRVx1RERBRCcsIGRlc2NyaXB0aW9uOiAnU1FMIHN5bnRheCBmb3IgYmVnaW5uZXJzJyB9LFxuICBUeXBlU2NyaXB0OiB7IGljb246ICdcdUQ4M0VcdUREMkYnLCBkZXNjcmlwdGlvbjogJ1R5cGVTY3JpcHQgZm9yIEMjIGRldmVsb3BlcicgfSxcbiAgLy8gVkJBOiB7IGljb246ICdcdUQ4M0RcdURDQTknLCBkZXNjcmlwdGlvbjogJ1ZCQSBmb3IgZXhjZWwnIH0sXG4gIFZ1ZTM6IHsgaWNvbjogJ1x1MjZBMScsIGRlc2NyaXB0aW9uOiAnVnVlMyBmb3IgLk5FVCBibGF6b3IgZGV2ZWxvcGVyJyB9LFxuICAnVW5zYWZlIENTaGFycCc6IHsgaWNvbjogJ1x1RDgzRFx1REUwRScsIGRlc2NyaXB0aW9uOiAnRW50ZXJpbmcgdGhlIGRhbmdlciB6b25lLi4uJyB9LFxuICAnTmVvVmltIENvbG9yU2NoZW1lIERldmVsb3BtZW50Jzoge1xuICAgIGljb246ICdcdUQ4M0NcdURGQTgnLFxuICAgIGRlc2NyaXB0aW9uOiAnTWFrZSB5b3VyIG93biBudmltIGNvbG9yIHNjaGVtZSB1c2luZyBsdWEuJyxcbiAgfSxcbiAgQmFzaDogeyBpY29uOiAnXHVEODNEXHVEQzIyJywgZGVzY3JpcHRpb246ICdTaGViYW5nIScgfSxcbiAgJ1JlZ3VsYXIgRXhwcmVzc2lvbic6IHsgaWNvbjogJ1x1RDgzRFx1REMyQicsIGRlc2NyaXB0aW9uOiAnTWVtb3J5IGxvc3NzcyBmb3IgZXZlcnkgNiBtb250aHMnIH0sXG4gIE5peDogeyBpY29uOiAnXHUyNzQ0JywgZGVzY3JpcHRpb246ICdSZXByb2R1Y2UgZnJlZWRvbScgfSxcbiAgJ0VudGl0eSBGcmFtZXdvcmsgQ29yZSc6e2ljb246J1x1RDgzRFx1RERGRicsIGRlc2NyaXB0aW9uOicnfSxcbn0gYXMgY29uc3Qgc2F0aXNmaWVzIERvY3VtZW50SW5mbztcbmV4cG9ydCB0eXBlIERvY3VtZW50TmFtZSA9IGtleW9mIHR5cGVvZiBkb2N1bWVudE1hcDtcbmV4cG9ydCB0eXBlIERvY3VtZW50SWNvbiA9ICh0eXBlb2YgZG9jdW1lbnRNYXApW0RvY3VtZW50TmFtZV1bJ2ljb24nXTtcbmV4cG9ydCB0eXBlIERvY3VtZW50RGVzY3JpcHRpb24gPSAodHlwZW9mIGRvY3VtZW50TWFwKVtEb2N1bWVudE5hbWVdWydkZXNjcmlwdGlvbiddO1xuY2xhc3MgRG9jdW1lbnRTZXJ2aWNlIGltcGxlbWVudHMgSURvY3VtZW50U2VydmljZSB7XG4gIGlzRW1wdHlEb2N1bWVudChuYW1lOiBEb2N1bWVudE5hbWUpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZW50cnkgPSB0aGlzLmdldE1hcmtkb3duRW50cnlGb2xkZXIobmFtZSk7XG4gICAgICByZXR1cm4gZmcuZ2xvYlN5bmMoJyoqLyoubWQnLCB7IGN3ZDogZW50cnkuZnVsbE5hbWUgfSkubGVuZ3RoID09PSAwO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmVhZG9ubHkgZG9jdW1lbnRJbmZvOiBEb2N1bWVudEluZm8gPSBkb2N1bWVudE1hcDtcbiAgZ2V0RG9jdW1lbnRFbnRyeUZvbGRlcihuYW1lOiBEb2N1bWVudE5hbWUpOiBGaWxlLkRpcmVjdG9yeUluZm8ge1xuICAgIGNvbnN0IHJldCA9IHRoaXMucmVnaXN0ZXJlZERvY3VtZW50Rm9sZGVycygpLmZpbmQoeCA9PiB4Lm5hbWUgPT09IG5hbWUpO1xuICAgIGlmICghcmV0KSB0aHJvdyBuZXcgRXJyb3IoYERvY3VtZW50IGVudHJ5IG9mIFwiJHtuYW1lfVwiIG5vdCBmb3VuZC5gKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIHJlZ2lzdGVyZWREb2N1bWVudEZvbGRlcnMoKTogRmlsZS5EaXJlY3RvcnlJbmZvW10ge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50U3JjLmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKHggPT4gT2JqZWN0LmtleXMoZG9jdW1lbnRNYXApLmluY2x1ZGVzKHgubmFtZSkpO1xuICB9XG4gIHBoeXNpY2FsRG9jdW1lbnRGb2xkZXJzKCk6IEZpbGUuRGlyZWN0b3J5SW5mb1tdIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFNyYy5nZXREaXJlY3RvcmllcygpO1xuICB9XG4gIGdldE1hcmtkb3duRW50cnlGb2xkZXIobmFtZTogRG9jdW1lbnROYW1lKTogRmlsZS5EaXJlY3RvcnlJbmZvIHtcbiAgICBjb25zdCByZXQgPSB0aGlzLmdldERvY3VtZW50RW50cnlGb2xkZXIobmFtZSlcbiAgICAgIC5nZXREaXJlY3RvcmllcygpXG4gICAgICAuZmluZCh4ID0+IHgubmFtZSA9PT0gJ2RvY3MnKTtcbiAgICBpZiAoIXJldCkgdGhyb3cgbmV3IEVycm9yKGBNYXJrZG93biBlbnRyeSBvZiBcIiR7bmFtZX1cIiBub3QgZm91bmQuYCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuICByZWdpc3RlcmVkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZG9jdW1lbnRNYXApLmxlbmd0aDtcbiAgfVxuICBwaHlzaWNhbENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRTcmMuZ2V0RGlyZWN0b3JpZXMoKS5sZW5ndGg7XG4gIH1cbiAgcGh5c2ljYWxDb3VudEJ5KGY6ICh4OiBGaWxlLkRpcmVjdG9yeUluZm8pID0+IGJvb2xlYW4pOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50U3JjLmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKHggPT4gZih4KSkubGVuZ3RoO1xuICB9XG4gIHRyeUdldEluZGV4TGlua09mRG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5RG9jdW1lbnQobmFtZSkpIHJldHVybiAnLyc7XG4gICAgY29uc3Qgc29sdmVTaGFycFNpZ24gPSAobGluazogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAobGluay5pbmNsdWRlcygnQ3NoYXJwJykpIHJldHVybiBsaW5rLnJlcGxhY2UoJyMnLCAnQ3NoYXJwJyk7XG4gICAgICByZXR1cm4gbGluay5yZXBsYWNlKCcjJywgJ1NoYXJwJyk7XG4gICAgfTtcbiAgICBjb25zdCBzaG91bGRTb2x2ZVNoYXJwU2lnbiA9IChuYW1lOiBEb2N1bWVudE5hbWUpID0+IG5hbWUuaW5jbHVkZXMoJyMnKTtcbiAgICBjb25zdCBtYXJrZG93bkVudHJ5ID0gdGhpcy5nZXRNYXJrZG93bkVudHJ5Rm9sZGVyKG5hbWUpO1xuICAgIGxldCBsaW5rQ29udGV4dCA9IGAke3RoaXMuZG9jdW1lbnRTcmMubmFtZX0vJHtuYW1lfS9gO1xuICAgIGlmIChtYXJrZG93bkVudHJ5LmdldEZpbGVzKCkubGVuZ3RoKSB7XG4gICAgICBjb25zdCBmaWxlID0gRW51bWVyYWJsZS5mcm9tKG1hcmtkb3duRW50cnkuZ2V0RmlsZXMoKSlcbiAgICAgICAgLm9yZGVyQnkoeCA9PiB4Lm5hbWUpXG4gICAgICAgIC5maXJzdCgpO1xuICAgICAgY29uc3QgbGluayA9IGAke2xpbmtDb250ZXh0fS9kb2NzLyR7RmlsZS5QYXRoLkdldEZpbGVOYW1lV2l0aG91dEV4dGVuc2lvbihmaWxlPy5uYW1lISl9YDtcbiAgICAgIHJldHVybiBzaG91bGRTb2x2ZVNoYXJwU2lnbihuYW1lKSA/IHNvbHZlU2hhcnBTaWduKGxpbmspIDogbGluaztcbiAgICB9XG4gICAgY29uc3QgeyBmaXJzdEZvbGRlciwgZGVwdGggfSA9IHRoaXMudHJ5R2V0Rmlyc3RDaGFwdGVyRm9sZGVyT2ZEb2N1bWVudChuYW1lKTtcbiAgICBjb25zdCBmaWxlID0gZmlyc3RGb2xkZXI/LmdldEZpbGVzKClbMF07XG4gICAgZm9yIChsZXQgaSA9IGRlcHRoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgbGlua0NvbnRleHQgKz0gYCR7ZmlsZT8uZGlyZWN0b3J5LnVwKGkpPy5uYW1lfS9gO1xuICAgIH1cbiAgICBjb25zdCBsaW5rID0gYCR7bGlua0NvbnRleHR9JHtmaXJzdEZvbGRlcj8ubmFtZX0vJHtGaWxlLlBhdGguR2V0RmlsZU5hbWVXaXRob3V0RXh0ZW5zaW9uKFxuICAgICAgZmlsZT8ubmFtZSEsXG4gICAgKX1gO1xuICAgIHJldHVybiBzaG91bGRTb2x2ZVNoYXJwU2lnbihuYW1lKSA/IHNvbHZlU2hhcnBTaWduKGxpbmspIDogbGluaztcbiAgfVxuICBnZXQgZG9jdW1lbnRTcmMoKTogRmlsZS5EaXJlY3RvcnlJbmZvIHtcbiAgICBjb25zdCByZXQgPSBGaWxlLnByb2plY3RSb290KClcbiAgICAgIC5nZXREaXJlY3RvcmllcygpXG4gICAgICAuZmluZCh4ID0+IHgubmFtZSA9PT0gJ2RvY3VtZW50Jyk7XG4gICAgaWYgKCFyZXQpIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgc291cmNlIG5vdCBmb3VuZC4nKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIHRyeUdldEZpcnN0Q2hhcHRlckZvbGRlck9mRG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKToge1xuICAgIGZpcnN0Rm9sZGVyOiBGaWxlLkRpcmVjdG9yeUluZm87XG4gICAgZGVwdGg6IG51bWJlcjtcbiAgfSB7XG4gICAgY29uc3QgbWFya2Rvd25FbnRyeSA9IHRoaXMuZ2V0TWFya2Rvd25FbnRyeUZvbGRlcihuYW1lKTtcbiAgICByZXR1cm4gZ2V0Rmlyc3QobWFya2Rvd25FbnRyeSk7XG5cbiAgICBmdW5jdGlvbiBnZXRGaXJzdChcbiAgICAgIGN1cnJlbnQ6IEZpbGUuRGlyZWN0b3J5SW5mbyxcbiAgICAgIGRlcHRoOiBudW1iZXIgPSAxLFxuICAgICk6IHsgZmlyc3RGb2xkZXI6IEZpbGUuRGlyZWN0b3J5SW5mbzsgZGVwdGg6IG51bWJlciB9IHtcbiAgICAgIGNvbnN0IG5leHRMZXZlbHNTb3J0ZWQgPSBFbnVtZXJhYmxlLmZyb20oXG4gICAgICAgIGN1cnJlbnRcbiAgICAgICAgICAuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmdldEZpbGVzKCkubGVuZ3RoID4gMCB8fCB4LmdldERpcmVjdG9yaWVzKCkubGVuZ3RoID4gMCksXG4gICAgICApLm9yZGVyQnkoeCA9PiB4Lm5hbWUpO1xuICAgICAgLy9pZiBubyBmb2xkZXJcbiAgICAgIGlmICghbmV4dExldmVsc1NvcnRlZC5jb3VudCgpKSByZXR1cm4geyBmaXJzdEZvbGRlcjogY3VycmVudCwgZGVwdGg6IGRlcHRoIH07XG4gICAgICAvL2lmIGhhcyBmb2xkZXJzXG4gICAgICByZXR1cm4gZ2V0Rmlyc3QobmV4dExldmVsc1NvcnRlZC5maXJzdCgpLCBkZXB0aCArIDEpO1xuICAgIH1cbiAgfVxuICB0cnlHZXRGb3JtdWxhTmFtZU9mRG9jdW1lbnQobmFtZTogRG9jdW1lbnROYW1lKTogc3RyaW5nIHtcbiAgICBpZiAobmFtZS5pbmNsdWRlcygnQ3NoYXJwJykpIHJldHVybiBuYW1lLnJlcGxhY2UoJ0NzaGFycCcsICdDIycpO1xuICAgIGlmIChuYW1lLmluY2x1ZGVzKCdTaGFycCcpKSByZXR1cm4gbmFtZS5yZXBsYWNlKCdTaGFycCcsICcjJyk7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRvY3VtZW50U2VydmljZTogSURvY3VtZW50U2VydmljZSA9IG5ldyBEb2N1bWVudFNlcnZpY2UoKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvc2hhcnBjaGVuL2Rlc2t0b3AvcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2hhcmVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zaGFyZWQvRmlsZVN5c3RlbS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zaGFyZWQvRmlsZVN5c3RlbS50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmFic3RyYWN0IGNsYXNzIEZpbGVTeXN0ZW1JbmZvIHtcbiAgcHJvdGVjdGVkIHBhdGg6IHN0cmluZztcbiAgYWJzdHJhY3QgZ2V0IG5hbWUoKTogc3RyaW5nO1xuICBhYnN0cmFjdCBnZXQgZnVsbE5hbWUoKTogc3RyaW5nO1xuICBhYnN0cmFjdCBnZXQgZXhpc3RzKCk6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBEaXJlY3RvcnlJbmZvIGV4dGVuZHMgRmlsZVN5c3RlbUluZm8ge1xuICBjb25zdHJ1Y3RvcihkaXJlY3RvcnlQYXRoOiBzdHJpbmcpIHtcbiAgICBzdXBlcihkaXJlY3RvcnlQYXRoKTtcbiAgICB0aGlzLnBhdGggPSBkaXJlY3RvcnlQYXRoO1xuICB9XG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBhdGguYmFzZW5hbWUodGhpcy5wYXRoKTtcbiAgfVxuXG4gIGdldCBmdWxsTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhdGg7XG4gIH1cblxuICBnZXQgZXhpc3RzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKHRoaXMucGF0aCkgJiYgZnMuc3RhdFN5bmModGhpcy5wYXRoKS5pc0RpcmVjdG9yeSgpO1xuICB9XG4gIGdldCBwYXJlbnQoKTogRGlyZWN0b3J5SW5mbyB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudFBhdGggPSBwYXRoLmRpcm5hbWUodGhpcy5wYXRoKTtcbiAgICByZXR1cm4gcGFyZW50UGF0aCAhPT0gdGhpcy5wYXRoID8gbmV3IERpcmVjdG9yeUluZm8ocGFyZW50UGF0aCkgOiBudWxsO1xuICB9XG5cbiAgZ2V0RmlsZXMoKTogRmlsZUluZm9bXSB7XG4gICAgaWYgKCF0aGlzLmV4aXN0cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBmaWxlSW5mb3MgPSBmc1xuICAgICAgLnJlYWRkaXJTeW5jKHRoaXMucGF0aClcbiAgICAgIC5tYXAoZmlsZU5hbWUgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnBhdGgsIGZpbGVOYW1lKTtcbiAgICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKGZpbGVQYXRoKTtcblxuICAgICAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgRmlsZUluZm8oZmlsZVBhdGgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihCb29sZWFuKSBhcyBGaWxlSW5mb1tdO1xuICAgIHJldHVybiBmaWxlSW5mb3M7XG4gIH1cblxuICBnZXREaXJlY3RvcmllcygpOiBEaXJlY3RvcnlJbmZvW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkaXJlY3RvcnlOYW1lcyA9IGZzXG4gICAgICAgIC5yZWFkZGlyU3luYyh0aGlzLnBhdGgpXG4gICAgICAgIC5maWx0ZXIoaXRlbSA9PiBmcy5zdGF0U3luYyhwYXRoLmpvaW4odGhpcy5wYXRoLCBpdGVtKSkuaXNEaXJlY3RvcnkoKSk7XG4gICAgICByZXR1cm4gZGlyZWN0b3J5TmFtZXMubWFwKGRpcmVjdG9yeSA9PiBuZXcgRGlyZWN0b3J5SW5mbyhwYXRoLmpvaW4odGhpcy5wYXRoLCBkaXJlY3RvcnkpKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHJlYWRpbmcgZGlyZWN0b3JpZXMgaW4gJHt0aGlzLnBhdGh9OiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9XG4gIHVwKGNvdW50OiBudW1iZXIpOiBEaXJlY3RvcnlJbmZvIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoY291bnQgPCAwKSB0aHJvdyBuZXcgRXJyb3IoJ2NvdW50IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAnKTtcbiAgICBsZXQgY3VycmVudDogRGlyZWN0b3J5SW5mbyB8IG51bGwgfCB1bmRlZmluZWQgPSB0aGlzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQ/LnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnQgfHwgdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlSW5mbyBleHRlbmRzIEZpbGVTeXN0ZW1JbmZvIHtcbiAgY29uc3RydWN0b3IoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHN1cGVyKGZpbGVQYXRoKTtcbiAgICB0aGlzLnBhdGggPSBmaWxlUGF0aDtcbiAgfVxuXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBhdGguYmFzZW5hbWUodGhpcy5wYXRoKTtcbiAgfVxuXG4gIGdldCBmdWxsTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhdGg7XG4gIH1cblxuICBnZXQgZXhpc3RzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKHRoaXMucGF0aCkgJiYgZnMuc3RhdFN5bmModGhpcy5wYXRoKS5pc0ZpbGUoKTtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuZXhpc3RzKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZzLnN0YXRTeW5jKHRoaXMucGF0aCkuc2l6ZTtcbiAgfVxuICBnZXQgZGlyZWN0b3J5KCk6IERpcmVjdG9yeUluZm8ge1xuICAgIGNvbnN0IGRpcmVjdG9yeVBhdGggPSBwYXRoLmRpcm5hbWUodGhpcy5wYXRoKTtcbiAgICByZXR1cm4gbmV3IERpcmVjdG9yeUluZm8oZGlyZWN0b3J5UGF0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhdGgge1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgc3RhdGljIEdldFJlbGF0aXZlUGF0aChyZWxhdGl2ZVRvOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHJlbGF0aXZlVG8sIHRvKTtcbiAgfVxuICBzdGF0aWMgR2V0QmFzZU5hbWUoZnVsbE5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKGZ1bGxOYW1lKTtcbiAgfVxuICBzdGF0aWMgR2V0RmlsZU5hbWVXaXRob3V0RXh0ZW5zaW9uKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZmlsZU5hbWU6IHN0cmluZyA9IG5ldyBGaWxlSW5mbyhwYXRoKS5uYW1lO1xuICAgIGNvbnN0IGxhc3RQZXJpb2Q6IG51bWJlciA9IGZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgcmV0dXJuIGxhc3RQZXJpb2QgPCAwXG4gICAgICA/IGZpbGVOYW1lIC8vIE5vIGV4dGVuc2lvbiB3YXMgZm91bmRcbiAgICAgIDogZmlsZU5hbWUuc2xpY2UoMCwgbGFzdFBlcmlvZCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3RSb290KCk6IERpcmVjdG9yeUluZm8ge1xuICByZXR1cm4gbmV3IERpcmVjdG9yeUluZm8oX19kaXJuYW1lKS5wYXJlbnQhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9jdW1lbnRSb290KCk6IERpcmVjdG9yeUluZm8ge1xuICByZXR1cm4gcHJvamVjdFJvb3QoKVxuICAgIC5nZXREaXJlY3RvcmllcygpXG4gICAgLmZpbHRlcih4ID0+IHgubmFtZSA9PT0gJ2RvY3VtZW50JylbMF07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zZXJ2aWNlcy9TaWRlYmFyU2VydmljZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zZXJ2aWNlcy9TaWRlYmFyU2VydmljZS50c1wiO2ltcG9ydCB7IGV4ZWMsIGV4ZWNTeW5jLCBzcGF3blN5bmMgfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHR5cGUgeyBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xuaW1wb3J0IHtcbiAgdHlwZSBEaXJlY3RvcnlJbmZvLFxuICB0eXBlIEZpbGVJbmZvLFxuICBQYXRoLFxuICBkb2N1bWVudFJvb3QsXG4gIHByb2plY3RSb290LFxufSBmcm9tICcuLi9zaGFyZWQvRmlsZVN5c3RlbSc7XG5pbXBvcnQgeyB0eXBlIERvY3VtZW50TmFtZSwgZG9jdW1lbnRNYXAsIGRvY3VtZW50U2VydmljZSB9IGZyb20gJy4vRG9jdW1lbnRTZXJ2aWNlJztcbmltcG9ydCB0eXBlIHsgSURvY3VtZW50U2VydmljZSB9IGZyb20gJy4vSURvY3VtZW50U2VydmljZSc7XG5pbXBvcnQgdHlwZSB7IElTaWRlYmFyU2VydmljZSB9IGZyb20gJy4vSVNpZGViYXJTZXJ2aWNlJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnZmFzdC1nbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5jb25zdCBzb2x2ZVNoYXJwU2lnbiA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgaWYgKHRleHQuaW5jbHVkZXMoJ3NoYXJwJykpIHJldHVybiB0ZXh0LnJlcGxhY2UoJ3NoYXJwJywgJyMnKTtcbiAgaWYgKHRleHQuaW5jbHVkZXMoJ1NoYXJwJykpIHJldHVybiB0ZXh0LnJlcGxhY2UoJ1NoYXJwJywgJyMnKTtcbiAgcmV0dXJuIHRleHQ7XG59O1xuY2xhc3MgU2lkZWJhclNlcnZpY2UgaW1wbGVtZW50cyBJU2lkZWJhclNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGJhc2U6IHN0cmluZyA9IGAvJHtkb2N1bWVudFJvb3QoKS5uYW1lfWA7XG4gIHJlYWRvbmx5IGRvY3VtZW50U2VydmljZTogSURvY3VtZW50U2VydmljZSA9IGRvY3VtZW50U2VydmljZTtcbiAgZ2V0TXVsdGlwbGVTaWRlYmFyKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFyTXVsdGkge1xuICAgIGNvbnN0IHNpZGViYXI6IERlZmF1bHRUaGVtZS5TaWRlYmFyTXVsdGkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXMoZG9jdW1lbnRNYXApKSB7XG4gICAgICBzaWRlYmFyW2Ake3RoaXMuYmFzZX0vJHtuYW1lfS9kb2NzL2BdID0gdGhpcy5nZXRTaWRlYmFyT2ZEb2N1bWVudChuYW1lIGFzIERvY3VtZW50TmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBzaWRlYmFyO1xuICB9XG4gIGdldFNpZGViYXJPZkRvY3VtZW50KG5hbWU6IERvY3VtZW50TmFtZSk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgICBjb25zdCBtYXJrZG93bkVudHJ5ID0gdGhpcy5kb2N1bWVudFNlcnZpY2UuZ2V0TWFya2Rvd25FbnRyeUZvbGRlcihuYW1lIGFzIERvY3VtZW50TmFtZSk7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogc29sdmVTaGFycFNpZ24obmFtZSksXG4gICAgICAgIGl0ZW1zOlxuICAgICAgICAgIG5hbWUgPT09ICdBcnRpY2xlcydcbiAgICAgICAgICAgID8gdGhpcy50cmFuc2Zvcm1Gb2xkZXJUb1NpZGViYXJJdGVtKG1hcmtkb3duRW50cnksIGAke3RoaXMuYmFzZX0vJHtuYW1lfWApLnNvcnQoXG4gICAgICAgICAgICAgICAgKGEsIGIpID0+IGNvbXBhcmVUcmFja2VkRGF0ZShhLCBiKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiB0aGlzLnRyYW5zZm9ybUZvbGRlclRvU2lkZWJhckl0ZW0obWFya2Rvd25FbnRyeSwgYCR7dGhpcy5iYXNlfS8ke25hbWV9YCksXG4gICAgICB9LFxuICAgIF07XG4gICAgZnVuY3Rpb24gY29tcGFyZVRyYWNrZWREYXRlKGE6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbSwgYjogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtKSB7XG4gICAgICByZXR1cm4gZ2l0VHJhY2tlZERhdGUoYS5saW5rKSAtIGdpdFRyYWNrZWREYXRlKGIubGluayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdpdFRyYWNrZWREYXRlKGZpbGU6IHN0cmluZyk6IERhdGUge1xuICAgICAgY29uc3QgZGF0ZVN0ciA9IGV4ZWNTeW5jKFxuICAgICAgICBgZ2l0IGxvZyAtLWRpZmYtZmlsdGVyPUEgLS1mb3JtYXQ9XCIlY0lcIiAtLSAnJHtwYXRoLmpvaW4oZG9jdW1lbnRSb290KCkuZnVsbE5hbWUsIGZpbGUpfS5tZCdgLFxuICAgICAgKVxuICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAudHJpbSgpO1xuXG4gICAgICAvKiBzcGF3blN5bmMoJ2dpdCcsIFtcbiAgICAgICAgJ2xvZycsXG4gICAgICAgICctLWRpZmYtZmlsdGVyPUEnLFxuICAgICAgICAnLS1mb3JtYXQ9XCIlY0lcIicsXG4gICAgICAgICctLScsXG4gICAgICAgIGAnJHtwYXRoLmpvaW4oZG9jdW1lbnRSb290KCkuZnVsbE5hbWUsIGZpbGUpfS5tZCdgLFxuICAgICAgXSkuc3Rkb3V0LnRvU3RyaW5nKCk7ICovXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYGN1cnJlbnQgY29tbWFuZDogJHtgZ2l0IGxvZyAtLWRpZmYtZmlsdGVyPUEgLS1mb3JtYXQ9XCIlY0lcIiAtLSBcIiR7cGF0aC5qb2luKGRvY3VtZW50Um9vdCgpLmZ1bGxOYW1lLCBmaWxlKX0ubWRcImB9YCxcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhgY3VycmVudCB0aW1lc3RhbXA6ICR7ZGF0ZVN0cn1gKTtcbiAgICAgIGNvbnN0IGZvbyA9IG5ldyBEYXRlKGRhdGVTdHIpO1xuICAgICAgY29uc29sZS5sb2coYGN1cnJlbnQgZGF0ZSBjb252ZXJ0ZWQ6ICR7Zm9vfWApO1xuICAgICAgcmV0dXJuIGZvbztcbiAgICB9XG4gIH1cbiAgdHJhbnNmb3JtRm9sZGVyVG9TaWRlYmFySXRlbShmb2xkZXI6IERpcmVjdG9yeUluZm8sIGJhc2U6IHN0cmluZyk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgICBjb25zdCBzdWJzID0gZm9sZGVyLmdldERpcmVjdG9yaWVzKCk7XG4gICAgLy8gbG9hZCBmaWxlcyBpbiB0aGlzIGZvbGRlclxuICAgIGNvbnN0IGl0ZW1zOiBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSA9IGZvbGRlci5nZXRGaWxlcygpLmxlbmd0aFxuICAgICAgPyBmaWxlc1RvU2lkZWJhckl0ZW1zKGZvbGRlci5nZXRGaWxlcygpLCBgJHtiYXNlfS8ke2ZvbGRlci5uYW1lfWApXG4gICAgICA6IFtdO1xuICAgIGZvciAoY29uc3QgaW5kZXggaW4gc3Vicykge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdWJzLCBpbmRleCkpIHtcbiAgICAgICAgY29uc3Qgc3ViID0gc3Vic1tpbmRleF07XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTaWRlYmFySXRlbTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtID0ge1xuICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgdGV4dDogc29sdmVTaGFycFNpZ24oc3ViLm5hbWUucmVwbGFjZSgvXlxcZCtcXC5cXHMqLywgJycpKSwgLy8gcmVtb3ZlIGxlYWRpbmcgaW5kZXhcbiAgICAgICAgICBpdGVtczogdGhpcy50cmFuc2Zvcm1Gb2xkZXJUb1NpZGViYXJJdGVtKHN1YiwgYCR7YmFzZX0vJHtmb2xkZXIubmFtZX1gKSxcbiAgICAgICAgfTtcbiAgICAgICAgaXRlbXMucHVzaChjdXJyZW50U2lkZWJhckl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlbXM7XG4gICAgZnVuY3Rpb24gZmlsZXNUb1NpZGViYXJJdGVtcyhmaWxlczogRmlsZUluZm9bXSwgYmFzZTogc3RyaW5nKTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10ge1xuICAgICAgcmV0dXJuIGZpbGVzXG4gICAgICAgIC5tYXAoZmlsZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGluayA9IGAke2Jhc2V9LyR7ZmlsZS5uYW1lfWA7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHQ6IHNvbHZlU2hhcnBTaWduKFBhdGguR2V0RmlsZU5hbWVXaXRob3V0RXh0ZW5zaW9uKGZpbGUubmFtZSkpLFxuICAgICAgICAgICAgbGluazogbGluay5zdWJzdHJpbmcoMCwgbGluay5sYXN0SW5kZXhPZignLicpKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgICAgICAuc29ydCgoeCwgeSkgPT4ge1xuICAgICAgICAgIC8vICAgaWYgKCEvXlxcZCtcXC5cXHMqLy50ZXN0KHgudGV4dCkgfHwgIS9eXFxkK1xcLlxccyovLnRlc3QoeS50ZXh0KSlcbiAgICAgICAgICAvLyAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIC8vICAgICAgIGBGaWxlczpcXG4ke0VudW1lcmFibGUuZnJvbShmaWxlcylcbiAgICAgICAgICAvLyAgICAgICAgIC5zZWxlY3QoZiA9PiBmLmZ1bGxOYW1lKVxuICAgICAgICAgIC8vICAgICAgICAgLmFnZ3JlZ2F0ZShcbiAgICAgICAgICAvLyAgICAgICAgICAgKHByZXYsIGN1cnJlbnQpID0+IGAke3ByZXZ9LFxcbiR7Y3VycmVudH1cXG5gXG4gICAgICAgICAgLy8gICAgICAgICApfSBkb24ndCBoYXZlIGNvbnNpc3RlbnQgbGVhZGluZyBpbmRpY2VzLmBcbiAgICAgICAgICAvLyAgICAgKTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcGFyc2VJbnQoeC50ZXh0Lm1hdGNoKC9eXFxkK1xcLlxccyovKT8uWzBdISkgLSBwYXJzZUludCh5LnRleHQubWF0Y2goL15cXGQrXFwuXFxzKi8pPy5bMF0hKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2lkZWJhclNlcnZpY2U6IElTaWRlYmFyU2VydmljZSA9IG5ldyBTaWRlYmFyU2VydmljZSgpO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zaGFycGNoZW4vZGVza3RvcC9yZXBvL3NoYXJwY2hlbi5naXRodWIuaW8vZG9jcy9zZXJ2aWNlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvc2hhcnBjaGVuL2Rlc2t0b3AvcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXMvVGhlbWVTZXJ2aWNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzL3NlcnZpY2VzL1RoZW1lU2VydmljZS50c1wiO2ltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgKiBhcyBzaGlraSBmcm9tICdzaGlraSc7XG5pbXBvcnQgeyBnaXRodWJTZXJ2aWNlIH0gZnJvbSAnLi9HaXRodWJTZXJ2aWNlJztcbmltcG9ydCB0eXBlIHsgSVRoZW1lU2VydmljZSB9IGZyb20gJy4vSVRoZW1lU2VydmljZSc7XG5jb25zdCBoaWdobGlnaHRlciA9IGF3YWl0IHNoaWtpLmdldFNpbmdsZXRvbkhpZ2hsaWdodGVyKCk7XG5cbnR5cGUgVGV4dG1hdGVSdWxlID0ge1xuICBuYW1lPzogc3RyaW5nO1xuICBzY29wZTogc3RyaW5nO1xuICBzZXR0aW5nczogeyBmb250U3R5bGU/OiBzdHJpbmc7IGZvcmVncm91bmQ/OiBzdHJpbmcgfTtcbn07XG5leHBvcnQgdHlwZSBUZXh0bWF0ZVRoZW1lID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHRva2VuQ29sb3JzOiBUZXh0bWF0ZVJ1bGVbXTtcbn07XG5leHBvcnQgdHlwZSBSZW1vdGVUaGVtZUluZm8gPSB7XG4gIHJlcG86IHN0cmluZztcbiAgcGF0aDogc3RyaW5nO1xuICBicmFuY2g6IHN0cmluZztcbn07XG5cbmNvbnN0IHRoZW1lSW5mb3MgPSB7XG4gICdFdmEgTGlnaHQnOiB7IHJlcG86ICdmaXNoZXZhL0V2YS1UaGVtZScsIHBhdGg6ICd0aGVtZXMvRXZhLUxpZ2h0Lmpzb24nLCBicmFuY2g6ICdtYXN0ZXInIH0sXG4gICdFdmEgRGFyayc6IHsgcmVwbzogJ2Zpc2hldmEvRXZhLVRoZW1lJywgcGF0aDogJ3RoZW1lcy9FdmEtRGFyay5qc29uJywgYnJhbmNoOiAnbWFzdGVyJyB9LFxufSBzYXRpc2ZpZXMgUmVjb3JkPHN0cmluZywgUmVtb3RlVGhlbWVJbmZvPjtcbmV4cG9ydCB0eXBlIFRoZW1lTmFtZSA9IGtleW9mIHR5cGVvZiB0aGVtZUluZm9zO1xuY2xhc3MgVGhlbWVTZXJ2aWNlIGltcGxlbWVudHMgSVRoZW1lU2VydmljZSB7XG4gIHJlYWRvbmx5IGlubmVyVGhlbWVTZXJ2aWNlOiBBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIHNoaWtpLmdldFNpbmdsZXRvbkhpZ2hsaWdodGVyPj4gPVxuICAgIGhpZ2hsaWdodGVyO1xuICBhc3luYyByZWdpc3Rlcih0aGVtZTogVGV4dG1hdGVUaGVtZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmlzVGhlbWVSZWdpc3RlcmVkKHRoZW1lLm5hbWUgYXMgVGhlbWVOYW1lKSkgcmV0dXJuO1xuICAgIHRoaXMuaW5uZXJUaGVtZVNlcnZpY2UubG9hZFRoZW1lKHRoZW1lKTtcbiAgfVxuICBhc3luYyBnZXRUaGVtZShuYW1lOiBUaGVtZU5hbWUpOiBQcm9taXNlPHNoaWtpLlRoZW1lUmVnaXN0cmF0aW9uPiB7XG4gICAgaWYgKCF0aGlzLmlzVGhlbWVSZWdpc3RlcmVkKG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYFRoZW1lIFxcYCR7bmFtZX1cXGAgbm90IHJlZ2lzdGVyZWQuYCk7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJUaGVtZVNlcnZpY2UuZ2V0VGhlbWUobmFtZSk7XG4gIH1cbiAgaXNUaGVtZVJlZ2lzdGVyZWQobmFtZTogVGhlbWVOYW1lKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJUaGVtZVNlcnZpY2UuZ2V0TG9hZGVkVGhlbWVzKCkuaW5jbHVkZXMobmFtZSk7XG4gIH1cbiAgYXN5bmMgZmV0Y2hUaGVtZU9iamVjdChpbmZvOiBSZW1vdGVUaGVtZUluZm8pOiBQcm9taXNlPFRleHRtYXRlVGhlbWU+IHtcbiAgICBjb25zdCB1cmwgPSAoYXdhaXQgZ2l0aHViU2VydmljZS5mcm9tUmVwb3NpdG9yeShpbmZvLnJlcG8pLmdldEZpbGVJbmZvKGluZm8ucGF0aCkpXG4gICAgICAuZG93bmxvYWRfdXJsITtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQ8c3RyaW5nPih1cmwsIHsgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSk7XG4gICAgICBjb25zdCB0aGVtZSA9IChhd2FpdCBpbXBvcnQoJ2pzb25jLXBhcnNlcicpKS5wYXJzZShyZXNwb25zZS5kYXRhKSBhcyBUZXh0bWF0ZVRoZW1lO1xuICAgICAgcmV0dXJuIHRoZW1lO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBKU09OIGRhdGE6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIGFzeW5jIGluaXRpYWxpemVSZWdpc3RyYXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAoT2JqZWN0LmVudHJpZXModGhlbWVJbmZvcykgYXMgW1RoZW1lTmFtZSwgUmVtb3RlVGhlbWVJbmZvXVtdKS5tYXAoYXN5bmMgeCA9PiB7XG4gICAgICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgdGhpcy5mZXRjaFRoZW1lT2JqZWN0KHhbMV0pO1xuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyKHRoZW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coYFRleHRtYXRlIHRoZW1lOiBcXGAke3hbMF19XFxgIGhhcyBsb2FkZWQuYCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG59XG5leHBvcnQgY29uc3QgdGhlbWVTZXJ2aWNlOiBJVGhlbWVTZXJ2aWNlID0gbmV3IFRoZW1lU2VydmljZSgpO1xuYXdhaXQgdGhlbWVTZXJ2aWNlLmluaXRpYWxpemVSZWdpc3RyYXRpb24oKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvc2hhcnBjaGVuL2Rlc2t0b3AvcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NoYXJwY2hlbi9kZXNrdG9wL3JlcG8vc2hhcnBjaGVuLmdpdGh1Yi5pby9kb2NzL3NlcnZpY2VzL0dpdGh1YlNlcnZpY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvc2hhcnBjaGVuL2Rlc2t0b3AvcmVwby9zaGFycGNoZW4uZ2l0aHViLmlvL2RvY3Mvc2VydmljZXMvR2l0aHViU2VydmljZS50c1wiO2ltcG9ydCB7IE9jdG9raXQgfSBmcm9tICdvY3Rva2l0JztcblxubGV0IG9jdG9raXQ6IE9jdG9raXQ7XG50eXBlIFJlcG9GaWxlUmVzcG9uc2UgPSBFeHRyYWN0PFxuICBFeGNsdWRlPEF3YWl0ZWQ8UmV0dXJuVHlwZTxPY3Rva2l0WydyZXN0J11bJ3JlcG9zJ11bJ2dldENvbnRlbnQnXT4+LCAyMDA+WydkYXRhJ10sXG4gIHsgZG93bmxvYWRfdXJsOiBzdHJpbmcgfCBudWxsOyB0eXBlOiAnZGlyJyB8ICdmaWxlJyB8ICdzdWJtb2R1bGUnIHwgJ3N5bWxpbmsnIH1bXVxuPjtcbnR5cGUgUmVwb1RyZWVSZXNwb25zZSA9IEF3YWl0ZWQ8UmV0dXJuVHlwZTxPY3Rva2l0WydyZXN0J11bJ2dpdCddWydnZXRUcmVlJ10+PlsnZGF0YSddWyd0cmVlJ107XG50eXBlIEVsZW1lbnRUeXBlPFQ+ID0gVCBleHRlbmRzIChpbmZlciBVKVtdID8gVSA6IG5ldmVyO1xudHlwZSBSZXBvRmlsZVN5c3RlbUluZm8gPSBFbGVtZW50VHlwZTxSZXBvRmlsZVJlc3BvbnNlPjtcbmNsYXNzIEdpdGh1YlJlcG9zaXRvcnlFbmRQb2ludE1ldGhvZHMge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG93bmVyOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZXBvOiBzdHJpbmcsXG4gICkge31cbiAgcHJpdmF0ZSBhc3luYyBmZXRjaFN0cnVjdHVyZUJ5UGF0aChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFJlcG9GaWxlUmVzcG9uc2U+IHtcbiAgICByZXR1cm4gKFxuICAgICAgYXdhaXQgb2N0b2tpdC5yZXN0LnJlcG9zLmdldENvbnRlbnQoe1xuICAgICAgICBvd25lcjogdGhpcy5vd25lcixcbiAgICAgICAgcmVwbzogdGhpcy5yZXBvLFxuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgfSlcbiAgICApLmRhdGEgYXMgUmVwb0ZpbGVSZXNwb25zZTtcbiAgfVxuICBhc3luYyBnZXRUcmVlKG9wdGlvbnM6IHsgYnJhbmNoU0hBPzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmcgfSk6IFByb21pc2U8UmVwb1RyZWVSZXNwb25zZT4ge1xuICAgIGNvbnN0IGJyYW5jaDogc3RyaW5nID0gb3B0aW9ucy5icmFuY2ggPz8gJ21haW4nO1xuICAgIGxldCBzaGE6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgc2hhID1cbiAgICAgICAgb3B0aW9ucy5icmFuY2hTSEEgPz9cbiAgICAgICAgKFxuICAgICAgICAgIGF3YWl0IG9jdG9raXQucmVzdC5naXQuZ2V0UmVmKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLm93bmVyLFxuICAgICAgICAgICAgcmVwbzogdGhpcy5yZXBvLFxuICAgICAgICAgICAgcmVmOiBgaGVhZHMvJHticmFuY2h9YCxcbiAgICAgICAgICB9KVxuICAgICAgICApLmRhdGEub2JqZWN0LnNoYTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBFcnJvciBmZXRjaGluZyByZWYgb2YgJHtKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgcmVwbzogYCR7dGhpcy5vd25lcn0vJHt0aGlzLnJlcG99YCxcbiAgICAgICAgICBicmFuY2g6IGJyYW5jaCxcbiAgICAgICAgfSl9YCxcbiAgICAgICAgZXJyb3IsXG4gICAgICApO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBhd2FpdCBvY3Rva2l0LnJlc3QuZ2l0LmdldFRyZWUoe1xuICAgICAgICAgIG93bmVyOiB0aGlzLm93bmVyLFxuICAgICAgICAgIHJlcG86IHRoaXMucmVwbyxcbiAgICAgICAgICB0cmVlX3NoYTogc2hhLFxuICAgICAgICAgIHJlY3Vyc2l2ZTogJ3RydWUnLFxuICAgICAgICB9KVxuICAgICAgKS5kYXRhLnRyZWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgRXJyb3IgZmV0Y2hpbmcgdHJlZSBvZiAke0pTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICByZXBvOiBgJHt0aGlzLm93bmVyfS8ke3RoaXMucmVwb31gLFxuICAgICAgICAgIGJyYW5jaDogYnJhbmNoLFxuICAgICAgICB9KX1gLFxuICAgICAgICBlcnJvcixcbiAgICAgICk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgYXN5bmMgZ2V0RmlsZXMoZGlyOiBzdHJpbmcsIHNlYXJjaE9wdGlvbjogJ3RvcCcgfCAnZGVlcCcpOiBQcm9taXNlPFJlcG9GaWxlUmVzcG9uc2U+IHtcbiAgICBjb25zdCBjdXJyZW50ID0gYXdhaXQgdGhpcy5mZXRjaFN0cnVjdHVyZUJ5UGF0aChkaXIpO1xuICAgIHN3aXRjaCAoc2VhcmNoT3B0aW9uKSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICByZXR1cm4gY3VycmVudC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdmaWxlJyk7XG4gICAgICBjYXNlICdkZWVwJzpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAuLi5jdXJyZW50LmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ2ZpbGUnKSxcbiAgICAgICAgICAuLi4oYXdhaXQgZGl2ZShcbiAgICAgICAgICAgIGN1cnJlbnQuZmlsdGVyKHggPT4geC50eXBlID09PSAnZGlyJyksXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICkpLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBkaXZlKFxuICAgICAgZGlyczogUmVwb0ZpbGVSZXNwb25zZSxcbiAgICAgIHNlbGY6IEdpdGh1YlJlcG9zaXRvcnlFbmRQb2ludE1ldGhvZHMsXG4gICAgKTogUHJvbWlzZTxSZXBvRmlsZVJlc3BvbnNlPiB7XG4gICAgICBjb25zdCB0YXNrcyA9IGRpcnMubWFwKGFzeW5jIHggPT4ge1xuICAgICAgICBjb25zdCBuZXh0cyA9IGF3YWl0IHNlbGYuZmV0Y2hTdHJ1Y3R1cmVCeVBhdGgoeC5wYXRoKTtcbiAgICAgICAgY29uc3QgY3VycmVudEZpbGVzID0gbmV4dHMuZmlsdGVyKHggPT4geC50eXBlID09PSAnZmlsZScpO1xuICAgICAgICBjb25zdCBjdXJyZW50RGlycyA9IG5leHRzLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ2RpcicpO1xuICAgICAgICBjb25zdCByZXN0RmlsZXMgPSBjdXJyZW50RGlycy5sZW5ndGggPyBhd2FpdCBkaXZlKGN1cnJlbnREaXJzLCBzZWxmKSA6IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmN1cnJlbnRGaWxlcywgLi4ucmVzdEZpbGVzXTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbCh0YXNrcykpLmZsYXQoKTtcbiAgICB9XG4gIH1cbiAgYXN5bmMgZ2V0RmlsZUluZm8ocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVwbyA9IGAke3RoaXMub3duZXJ9LyR7dGhpcy5yZXBvfWA7XG4gICAgaWYgKC9eW1xcdy5dK1xcL1xcYlstXFx3XStcXGIkLy50ZXN0KHJlcG8pKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IHJlcG8uc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IG93bmVyID0gc3BsaXRbMF07XG4gICAgICBjb25zdCBfcmVwbyA9IHNwbGl0WzFdO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgYXdhaXQgb2N0b2tpdC5yZXN0LnJlcG9zLmdldENvbnRlbnQoe1xuICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICByZXBvOiBfcmVwbyxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICB9KVxuICAgICAgKS5kYXRhIGFzIFJlcG9GaWxlU3lzdGVtSW5mbztcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBHaXRodWJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgIG9jdG9raXQgPSBuZXcgT2N0b2tpdCh7XG4gICAgICBhdXRoOiB0b2tlbixcbiAgICB9KTtcbiAgfVxuICBmcm9tUmVwb3NpdG9yeShyZXBvOiB7IG93bmVyOiBzdHJpbmc7IHJlcG86IHN0cmluZyB9IHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiByZXBvID09PSAnc3RyaW5nJyAmJiAvXltcXHcuXStcXC9cXGJbLVxcd10rXFxiJC8udGVzdChyZXBvKSkge1xuICAgICAgY29uc3Qgc3BsaXQgPSByZXBvLnNwbGl0KCcvJyk7XG4gICAgICByZXR1cm4gbmV3IEdpdGh1YlJlcG9zaXRvcnlFbmRQb2ludE1ldGhvZHMoc3BsaXRbMF0sIHNwbGl0WzFdKTtcbiAgICB9XG4gICAgaWYgKHJlcG8gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgR2l0aHViUmVwb3NpdG9yeUVuZFBvaW50TWV0aG9kcyhyZXBvLm93bmVyLCByZXBvLnJlcG8pO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhdHRlcm4gaW52YWxpZCcpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnaXRodWJTZXJ2aWNlID0gbmV3IEdpdGh1YlNlcnZpY2UocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFcsU0FBUywyQkFBMkI7QUFFOVksU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxtQkFBbUI7OztBQ0Y1QixPQUFPLFFBQVE7QUFDZixPQUFPLGdCQUFnQjs7O0FDRjZVLFlBQVksUUFBUTtBQUN4WCxZQUFZLFVBQVU7QUFEdEIsSUFBTSxtQ0FBbUM7QUFHekMsSUFBZSxpQkFBZixNQUE4QjtBQUFBLEVBQ2xCO0FBQUEsRUFJVixZQUFZQSxPQUFjO0FBQ3hCLFNBQUssT0FBT0E7QUFBQSxFQUNk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O0FBQUEsUUFDTixNQUFNLGdCQUFnQiwwQkFBMEIsVUFBVTtBQUFBLE1BQzVEO0FBQUEsTUFDQSxFQUFFLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFBQSxNQUMxQixFQUFFLE1BQU0sU0FBUyxNQUFNLGNBQWM7QUFBQSxNQUNyQyxFQUFFLE1BQU0sV0FBVyxNQUFNLGdCQUFnQjtBQUFBLElBQzNDO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixTQUFTLGVBQWUsbUJBQW1CO0FBQUEsSUFDM0MsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLGFBQWEsQ0FBQyxFQUFFLE1BQU0sVUFBVSxNQUFNLCtCQUErQixDQUFDO0FBQUEsSUFDdEUsV0FBVztBQUFBLElBQ1gsa0JBQWtCO0FBQUEsSUFDbEIsYUFBYTtBQUFBLE1BQ1gsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDUixTQUFTLENBQUMsRUFBRSxTQUFTLE1BQU07QUFDekIsZUFBTyxtRUFBbUUsUUFBUTtBQUFBLE1BQ3BGO0FBQUEsTUFDQSxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBT0QsSUFBTyxpQkFBUSxZQUFZLEVBQUUsR0FBSSxDQUFDLEdBQTJCLEdBQUcsZ0JBQWdCLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAic29sdmVTaGFycFNpZ24iLCAibGluayIsICJuYW1lIiwgImZpbGUiLCAicGF0aCIsICJwYXRoIiwgImJhc2UiLCAicGF0aCIsICJ4Il0KfQo=
