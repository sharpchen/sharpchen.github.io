<template>
  <div class="site-footer">
    MIT Licensed | Copyright © 2023-
    <a class="vitepress" :href="website">{{ webTitle }}</a
    ><br />
    Powered by
    <a class="vitepress" target="_blank" href="//vitepress.vuejs.org/"
      >VitePress - 1.0.0-rc.25</a
    >
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";

const { site, theme } = useData();
const website = theme.value.website;
const webTitle = site.value.title;
</script>
