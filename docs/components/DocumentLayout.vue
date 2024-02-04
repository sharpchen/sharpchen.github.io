<template>
    <Layout ref="layout"></Layout>
    <!-- <Content /> -->
    <Copyright />
</template>

<script lang="ts" setup>
    import Copyright from '../components/Copyright.vue';
    import { ref } from 'vue';
    import Layout from 'vitepress/dist/client/theme-default/Layout.vue';
    const layout = ref<typeof Layout | null>(null);
</script>
