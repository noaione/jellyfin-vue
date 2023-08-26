<!-- eslint-disable vue/no-v-html HTML is sanitized -->
<template>
  <div
    class="text-overview"
    v-html="parsedHTML" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { renderMarkdown } from '@/utils/render-markdown';

const props = defineProps<{ content: string, noMarkdown?: boolean }>();

const parsedHTML = ref(props.content);

onMounted(async () => {
  try {
    parsedHTML.value = await renderMarkdown(props.content, Boolean(props.noMarkdown));
  } catch {
    parsedHTML.value = props.content;
  }
});
</script>

<style lang="scss" scoped>
.text-overview {
  $spaceBetween: 0.4rem;

  > * {
    margin-top: $spaceBetween;
    margin-bottom: $spaceBetween;
  }
}
</style>
