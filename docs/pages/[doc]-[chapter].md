# {{ $params.doc  }}

## {{h2}}

<script setup lang="ts">
import { data } from '../dataLoaders/Document.data.ts';
import { ref, onMounted } from 'vue';
const h2 = ref('g567');
onMounted(() => {
  console.log(data);
});
</script>
