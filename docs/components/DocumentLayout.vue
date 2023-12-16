<template>
    <Layout ref="layout"></Layout>
    <!-- <Content /> -->
    <Copyright />
</template>

<script lang="ts" setup>
    import Copyright from '../components/Copyright.vue';
    import DefaultTheme, { useSidebar } from 'vitepress/theme';
    import { useData, useRoute, useRouter } from 'vitepress';
    import { useSidebarControl } from 'vitepress/dist/client/theme-default/composables/sidebar';
    import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue';
    import VPSidebarItem from 'vitepress/dist/client/theme-default/components/VPSidebarItem.vue';
    import { ref, onMounted } from 'vue';
    import { type VNode } from '@vue/runtime-core/dist/runtime-core';
    import Layout from 'vitepress/dist/client/theme-default/Layout.vue';
    const layout = ref<typeof Layout | null>(null);
    useRouter().onAfterRouteChanged = () => {
        console.log('route changed');
        console.log(useRoute().data);
    };
</script>
