# Init Project

## Create project

```bash
pnpm create vue@latest
```

## Add mars3d dependencies

Install main lib.

```bash
pnpm add mars3d mars3d-cesium @turf/turf  --save 
```

```bash
pnpm add mars3d-space --save
```

Install vite plugin

```bash
pnpm add vite-plugin-mars3d --save-dev
```

## Add plugin

```ts{6,10}
// vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { mars3dPlugin } from 'vite-plugin-mars3d';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(),mars3dPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});

```
