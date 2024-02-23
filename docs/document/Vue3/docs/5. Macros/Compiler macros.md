# Compiler macros

## `defineProps`

```vue
<!-- Rectangle.vue -->
<template>
  <div class="rec" :style="{ width: `${props.width}px`,height: `${props.height}px` }" />
</template>

<script lang="ts" setup>
  const props = defineProps<{ width: number; height: number }>();
</script>

<!-- App.vue -->
<template>
  <Rectangle :width="200" :height="200" />
</template>

<script lang="ts" setup>
  import Rectangle from './components/Rectangle.vue';
</script>
```

## `withDefaults`

```vue
<template>
    <div />
</template>

<script lang="ts" setup>
  const props = withDefaults(defineProps<{ url: string }>(), { url: 'default' });
</script>
```
