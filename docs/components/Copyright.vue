<template>
    <div class="site-footer">
        MIT Licensed | Copyright © 2023-present
        <a class="bold" href="https://github.com/sharpchen/sharpchen.github.io" target="_blank">@{{ webTitle }}</a>
        <br />
        Powered by
        <a class="bold" target="_blank" href="//vitepress.vuejs.org/">VitePress - 1.0.0-rc.25</a>
        <!-- <br />
        Markdown Themed by
        <a class="bold" target="_blank" href="https://github.com/fisheva/Eva-Theme">Eva-Theme@fisheva</a> -->
    </div>
</template>

<script setup lang="ts">
    import { useData } from 'vitepress';

    const { site, theme } = useData();
    const webTitle = site.value.titleTemplate;
</script>

<style scoped>
    .site-footer {
        color: #888;
        text-align: center;
        font-size: 0.75rem;
        width: 100%;
        padding: 15px 0;
        overflow: auto;
    }
    .bold {
        color: var(--vp-c-text-1);
        font-weight: 700;
    }
</style>
