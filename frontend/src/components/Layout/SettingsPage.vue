<template>
  <VContainer>
    <VRow v-if="pageTitle">
      <VCol>
        <VRow class="mx-0 mt-4 mb-2 justify-space-between">
          <h2 class="text-h4">
            {{ $t(pageTitle) }}
          </h2>
          <div>
            <slot name="actions" />
          </div>
        </VRow>
      </VCol>
    </VRow>
    <VRow v-if="!columnsContent">
      <slot name="content" />
    </VRow>
    <VCol v-else>
      <slot name="content" />
    </VCol>
  </VContainer>
</template>

<script setup lang="ts">
defineProps<{ pageTitle?: string, columnsContent?: boolean }>();
</script>
