<template>
    <Layout ref="layout"></Layout>
    <!-- <Content /> -->
    <Copyright />
</template>

<script lang="ts" setup>
    import Copyright from '../components/Copyright.vue';
    import { ref } from 'vue';
    import Layout from 'vitepress/dist/client/theme-default/Layout.vue';
    import { useSidebar } from 'vitepress/theme';
    const layout = ref<typeof Layout | null>(null);
    const { toggle, isOpen , close} = useSidebar()
    if (isOpen.value) {
       close() 
    }
</script>
