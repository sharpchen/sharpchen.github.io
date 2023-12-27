import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import matter from 'gray-matter';
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
---
`;

const featuresItems: Feature[] = matter(featuresLiteral).data.features;
const loader = {
    load: (): Feature[] => featuresItems,
};

export default loader;
export declare const data: Feature[];
