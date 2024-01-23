// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import { type Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import './custom.css';
import DocumentLayout from '../../components/DocumentLayout.vue';
import { EnhanceAppContext } from 'vitepress';
import TwoslashFloatingVue from 'vitepress-plugin-twoslash/client';
import 'vitepress-plugin-twoslash/style.css';
export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DocumentLayout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp({ app, router, siteData }: EnhanceAppContext) {
        // @ts-ignore
        app.use(TwoslashFloatingVue);
    },
} satisfies Theme;
