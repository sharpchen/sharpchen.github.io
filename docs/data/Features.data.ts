import matter from 'gray-matter';
import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
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
    link: /document/Articles/docs/Start your first npm package - Build, CI and Publish.md
---`;
const featuresItems: Feature[] = matter(featuresLiteral).data.features;
const articleFeature: Feature[] = matter(articleLiteral).data.features;
const loader = {
    load: (): FeatureCompose => ({ features: featuresItems, articleFeature: articleFeature }),
};

export default loader;
type FeatureCompose = {
    features: Feature[];
    articleFeature: Feature[];
};

export declare const data: FeatureCompose;
