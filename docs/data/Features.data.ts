import matter from 'gray-matter';
import Enumerable from 'linq';
import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { Path, documentRoot } from '../shared/FileSystem';

// const matter = require('gray-matter');
const featuresLiteral = `---
features:
  - title: SQL
    details: SQL syntax for beginners with MySQL
    icon: 📝
    linkText: Get started
  - title: Docker
    details: Ultimate Docker
    icon: 🐋
    linkText: Get started
  - title: C# Design Patterns
    details: Design Patterns in C#
    icon: 👾
    linkText: Get started
  - title: JavaScript
    details: JavaScript for C# developer
    icon: 😅
    linkText: Get started
  - title: TypeScript
    details: TypeScript for C# developer
    icon: ⌨
    link: /
    linkText: Get started
  - title: Rust
    details: Rust for C# developer
    icon: 🦀
    link: /
    linkText: Get started
  - title: Python
    details: Python for C# developer
    icon: 🐍
    linkText: Get started
  - title: Vue3
    details: Vue3 for .NET blazor developer
    icon: ⚡
    linkText: Get started
  - title: CesiumJS
    details: CesiumJS with vue3+vite
    icon: 🌏
    linkText: Get started
  - title: Mars3D
    details:
    icon: 🌟
    linkText: Get started
  - title: VBA
    details: VBA for excel
    icon: 💩
    linkText: Get started
  - title: Modern C#
    details: Modernized C# since 2015?
    icon: 🐱‍👤
    linkText: Get started
  - title: Avalonia
    details: AvaloniaUI
    icon: 😱
    linkText: Get started
  - title: Git
    details: Git mastery
    icon: 🐱
    linkText: Get started
---
`;
const articleLiteral = `---
features:
  - title: Articles
    details: Regular articles
    icon: 📰
    linkText: Let's go
---`;
const getIndexLink = (title: string): string | undefined => {
  const docs = documentRoot()
    .getDirectories()
    .find(x => x.name.toLowerCase() === title.toLowerCase())
    ?.getDirectories()
    .find(x => x.name === 'docs');
  if (!docs) return;
  // has multiple chapters
  if (docs.getDirectories().length > 0) {
    const folder = Enumerable.from(docs.getDirectories())
      .where(x => x.getFiles().length > 0)
      .orderBy(x => x.name)
      .firstOrDefault();
    const file = folder?.getFiles()[0];
    return `${documentRoot().name}/${title}/docs/${folder?.name}/${Path.GetFileNameWithoutExtension(
      file?.name!
    )}`;
  }
  // no chapter
  if (docs.getFiles().length > 0) {
    const file = Enumerable.from(docs.getFiles())
      .orderBy(x => x.name)
      .firstOrDefault();
    return `${documentRoot().name}/${title}/docs/${Path.GetFileNameWithoutExtension(file?.name!)}`;
  }
};
function addLinkToFeatures(features: Feature[]): Feature[] {
  /**
   * folder names
   */
  const names = documentRoot()
    .getDirectories()
    .map(x => x.name);
  for (const key in features) {
    if (Object.prototype.hasOwnProperty.call(features, key)) {
      const feature = features[key];
      /**
       * Handel exceptions for C#
       * @param name folder name
       * @returns handled
       */
      const predicate = (name: string) => {
        const replaced = name.toLowerCase().includes('csharp')
          ? name.toLowerCase().replace('csharp', 'C#')
          : name;
        return feature.title.toLowerCase() === replaced.toLowerCase();
      };
      const match = names.find(x => predicate(x));
      if (match) {
        // cs design pattern has conflict that I just leave it with a simple solution.
        const title = feature.title.includes('C#')
          ? feature.title.replace('C#', 'CSharp')
          : feature.title;
        const link = getIndexLink(title);
        feature.link = link ? link : '/';
      }
    }
  }
  return features;
}

const featuresItems: Feature[] = addLinkToFeatures(matter(featuresLiteral).data.features);
const articleFeature: Feature[] = addLinkToFeatures(matter(articleLiteral).data.features);
const loader = {
  load: (): FeatureCompose => ({ features: featuresItems, articleFeature: articleFeature }),
};

export default loader;
type FeatureCompose = {
  features: Feature[];
  articleFeature: Feature[];
};

export declare const data: FeatureCompose;
