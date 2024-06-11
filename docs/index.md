---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: "Home"
markdownStyles: false
hero:
  name: "Articles"
  image:
    # src: /favicon.ico
    alt: sharpchen
---

<VPFeatures :features="articleFeature"/>
<VPHero name="Documents"/>
<VPFeatures :features="features"/>

<script lang="ts" setup>
  import Enumerable from 'linq';
import VPFeatures, { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue';
import { ref } from 'vue';
import { data } from './data/Features.data';
  const features: Feature[] = data.features;
  const articleFeature = ref(data.articleFeature);
</script>
