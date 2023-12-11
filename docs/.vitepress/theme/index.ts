// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import { type Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import './custom.css';
import DocumentLayout from '../../components/DocumentLayout.vue';

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DocumentLayout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp({ app, router, siteData }) {
        // ...
    },
} satisfies Theme;
