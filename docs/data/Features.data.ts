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
    link: /sql
  - title: Docker
    details: Ultimate Docker
    icon: 🐋
    link: /docker
    linkText: Get started
  - title: CSharp Design Patterns
    details: Design Patterns in C#
    icon: 👾
    link: /csharpdesignpatterns
    linkText: Get started
  - title: JavaScript
    details: JavaScript for C# developer
    icon: 🦖
    link: /javascript
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
    link: /
    linkText: Get started
  - title: Vue3
    details: Vue3 for .NET blazor developer
    icon: ⚡
    link: /vue3
    linkText: Get started
  - title: CesiumJS
    details: CesiumJS with vue3+vite
    icon: 🌏
    link: /cesiumjs
    linkText: Get started
---
`;
const articleLiteral = `---
features:
  - title: Articles
    details: Regular articles
    icon: 📰
    linkText: Let's go
    #link: /document/Articles/docs/Start your first npm package - Build, CI and Publish.md
---`;
const getIndexLink = (title: string): string | undefined => {
    const docs = documentRoot()
        .getDirectories()
        .find(x => x.name.toLowerCase() === title.toLowerCase())
        ?.getDirectories()
        .find(x => x.name === 'docs');
    if (!docs) return;
    if (docs.getDirectories().length > 0) {
        const folder = Enumerable.from(docs.getDirectories())
            .where(x => x.getFiles().length > 0)
            .orderBy(x => x.name)
            .firstOrDefault();
        const file = folder?.getFiles()[0];
        return `${documentRoot().name}/${title}/docs/${folder?.name}/${Path.GetFileNameWithoutExtension(file?.name!)}`;
    }
    if (docs.getFiles().length > 0) {
        const file = Enumerable.from(docs.getFiles())
            .orderBy(x => x.name)
            .firstOrDefault();
        return `${documentRoot().name}/${title}/docs/${Path.GetFileNameWithoutExtension(file?.name!)}`;
    }
};
function addLinkToFeature(features: Feature[]): Feature[] {
    const names = documentRoot()
        .getDirectories()
        .map(x => x.name);
    for (const key in features) {
        if (Object.prototype.hasOwnProperty.call(features, key)) {
            const feature = features[key];
            const match = names.find(x => x.toLowerCase() === feature.title.toLowerCase());
            if (match) {
                const link = getIndexLink(
                    // cs design pattern has conflict that I just leave it with a simple solution.
                    feature.title.includes('CSharp') ? feature.title.replace('CSharp', 'Csharp') : feature.title
                );
                feature.link = link ? link : '/';
            }
        }
    }
    return features;
}
const featuresItems: Feature[] = addLinkToFeature(matter(featuresLiteral).data.features);
const articleFeature: Feature[] = addLinkToFeature(matter(articleLiteral).data.features);
const loader = {
    load: (): FeatureCompose => ({ features: featuresItems, articleFeature: articleFeature }),
};

export default loader;
type FeatureCompose = {
    features: Feature[];
    articleFeature: Feature[];
};

export declare const data: FeatureCompose;
