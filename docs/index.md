---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: "Home"
hero:
  name: "Articles"
  image:
    # src: /favicon.ico
    alt: sharpchen
features:
  - title: Articles
    details: Regular articles
    icon: 📰
    linkText: Let's go
    link: /articles
---

<VPHero name="Documents"/>
<VPFeatures :features="features"/>

<script lang="ts" setup>
  import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue';
  import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
  import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
  import { data } from './data/Features.data';
  import Enumerable from 'linq';

  const features: Feature[] = Enumerable.from(data).orderBy(_x => Math.random()).toArray();

</script>
