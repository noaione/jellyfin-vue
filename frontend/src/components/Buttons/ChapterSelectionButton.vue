<template>
  <VBtn
    v-if="playbackManager.currentItem?.Chapters"
    icon
    class="align-self-center">
    <VIcon>
      <IMdiTableOfContents />
    </VIcon>
    <VTooltip
      :text="$t('chapters')"
      location="top" />
    <VMenu
      v-model="menuModel"
      :close-on-content-click="false"
      :persistent="!closeOnClick"
      :transition="'slide-y-transition'"
      :width="listWidth"
      location="top">
      <VCard>
        <VList>
          <VListItem :title="$t('chapters')">
            <template #prepend>
              <VIcon>
                <IMdiTableOfContents />
              </VIcon>
            </template>
            <template #subtitle>
              <span v-if="chapterTick !== -1">
                {{
                  playbackManager.currentItem.Chapters[chapterTick].Name ??
                    `${t('chapter')} ${chapterTick + 1}`
                }}
                {{
                  ` (${chapterTick + 1}/${
                    playbackManager.currentItem.Chapters.length
                  })`
                }}
              </span>
            </template>
          </VListItem>
        </VList>
        <VDivider />
        <VList class="chapters-area">
          <VListItem
            v-for="(chapter, index) in playbackManager.currentItem.Chapters"
            :key="`chapter-${index}`"
            :title="chapter.Name || `Chapter ${index + 1}`"
            :subtitle="
              chapter.StartPositionTicks
                ? formatTicks(chapter.StartPositionTicks)
                : undefined
            "
            :class="{ 'text-primary font-weight-bold': isAtChapter(index) }"
            @click="seekTo(chapter)">
            <template #prepend>
              <VAvatar>
                <VImg
                  v-if="chapter.ImageTag"
                  :src="makeChapterImage(index, chapter.ImageTag)"
                  :alt="`Chapter ${index + 1}`"
                  cover />
                <VIcon v-else>
                  <IMdiTableOfContents />
                </VIcon>
              </VAvatar>
            </template>
          </VListItem>
        </VList>
      </VCard>
    </VMenu>
  </VBtn>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChapterInfo } from '@jellyfin/sdk/lib/generated-client';
import { playbackManagerStore } from '@/store';
import { formatTicks, msToTicks, ticksToMs } from '@/utils/time';
import { useRemote } from '@/composables';

const props = withDefaults(
  defineProps<{
    closeOnClick?: boolean;
    size?: number;
  }>(),
  { closeOnClick: false, size: 40 }
);

const remote = useRemote();
const playbackManager = playbackManagerStore();
const { t } = useI18n();

const menuModel = ref(false);
const chapterTick = ref(-1);
const listWidth = computed(() => `${props.size}vw`);

/**
 * Creates a chapter image url
 */
function makeChapterImage(
  index: number,
  imageTag?: string | null
): string | undefined {
  const serverAddress = remote.sdk.api?.basePath;
  const playbackId = playbackManager.currentItem?.Id;

  if (serverAddress && playbackId && imageTag) {
    return `${serverAddress}/Items/${playbackManager.currentItem?.Id}/Images/Chapter/${index}?maxWidth=400&tag=${imageTag}&quality=90`;
  }

  return undefined;
}

/**
 * Seeks to a chapter
 */
function seekTo(chapter: ChapterInfo): void {
  if (chapter.StartPositionTicks !== undefined) {
    playbackManager.currentTime = ticksToMs(chapter.StartPositionTicks) / 1000;
  }
}

/**
 * Checks if the current time is at a chapter
 */
function isAtChapter(index: number): boolean {
  return chapterTick.value === index;
}

watch(
  () => playbackManager.currentTime,
  (value) => {
    const timeTick = Math.round(msToTicks(value * 1000));
    const chapters = playbackManager.currentItem?.Chapters;

    if (!chapters) {
      return;
    }

    const maxTick = chapters.length - 1;

    for (const [index, chapter] of chapters.entries()) {
      const currentTick = chapter.StartPositionTicks;

      if (currentTick !== undefined) {
        const nextTick = chapters[index + 1]?.StartPositionTicks;
        const prevTick = chapters[index - 1]?.StartPositionTicks;

        if (
          index === 0 &&
          nextTick !== undefined &&
          timeTick >= currentTick &&
          timeTick < nextTick
        ) {
          chapterTick.value = index;
          break;
        } else if (maxTick === index) {
          chapterTick.value = index;
        } else {
          if (
            nextTick !== undefined &&
            prevTick !== undefined &&
            timeTick >= currentTick &&
            timeTick < nextTick &&
            timeTick > prevTick
          ) {
            chapterTick.value = index;
            break;
          }
        }
      }
    }
  }
);
</script>

<style lang="scss" scoped>
.chapters-area {
  min-height: 40vh;
  max-height: 40vh;
}
</style>
