<template>
    <div class="site-footer">
        Copyright © 2023-present
        <a class="bold" href="https://github.com/sharpchen/sharpchen.github.io" target="_blank">@{{ webTitle }}</a>
        <br />
        Powered by
        <a class="bold" target="_blank" href="//vitepress.vuejs.org/">VitePress - {{ vitepressVersion }}</a>
        <!-- <br />
        Markdown Themed by
        <a class="bold" target="_blank" href="https://github.com/fisheva/Eva-Theme">Eva-Theme@fisheva</a> -->
    </div>
</template>

<script setup lang="ts">
    import { useData } from 'vitepress';
    import { onBeforeMount, ref } from 'vue';
    import { data as globalData } from '../data/global.data';
    const { site, theme } = useData();
    const webTitle = site.value.titleTemplate;
    const vitepressVersion = ref<string | null>(null);
    onBeforeMount(async () => {
        vitepressVersion.value = globalData.vitepressVersion;
    });
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
        color: var(--vp-code-color);
        font-weight: 700;
    }
</style>
