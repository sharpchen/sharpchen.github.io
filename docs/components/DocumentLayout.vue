<template>
    <Layout />
    <!-- <Content /> -->
    <Copyright />
</template>

<script lang="ts" setup>
    import Copyright from '../components/Copyright.vue';
    import DefaultTheme from 'vitepress/theme';
    import { useSidebar } from 'vitepress/theme';
    import { onMounted } from 'vue';
    import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue';
    import VPSidebarItem from 'vitepress/dist/client/theme-default/components/VPSidebarItem.vue';
    const { sidebarGroups } = useSidebar();
    const { Layout } = DefaultTheme;
</script>
