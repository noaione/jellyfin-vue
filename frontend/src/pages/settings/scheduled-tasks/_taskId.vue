<template>
  <SettingsPage
    page-title="settingsSections.scheduledTasks.name"
    columns-content>
    <template #actions>
      <VBtn
        variant="elevated"
        href="https://jellyfin.org/docs/general/server/tasks/"
        rel="noreferrer noopener"
        target="_blank">
        {{ t('settings.help') }}
      </VBtn>
    </template>
    <template #content>
      <VFadeTransition
        v-if="scheduledTask"
        group>
        <h2
          :key="`scheduled-task-title`"
          class="text-h6 mb-2">
          {{ scheduledTask.Name }}
        </h2>
        <p>{{ scheduledTask.Description }}</p>
      </VFadeTransition>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getScheduledTasksApi } from '@jellyfin/sdk/lib/utils/api/scheduled-tasks-api';
import { TaskInfo } from '@jellyfin/sdk/lib/generated-client';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { useDateFns, useRemote } from '@/composables';

const { t } = useI18n();
const route = useRoute();
const remote = useRemote();

const { taskId } = route.params as { taskId: string };

const scheduledTask = ref<TaskInfo>();

const stopTaskWatch = watch(
  () => remote.socket.message,
  () => {
    if (!remote.socket.message) {
      return;
    }

    const { MessageType, Data } = remote.socket.message;

    if (!Data || !Array.isArray(Data)) {
      return;
    }

    if (MessageType === 'ScheduledTasksInfo' && Data.length > 0) {
      const task = Data.find((task: TaskInfo) => task.Id === taskId) as TaskInfo;

      if (task) {
        scheduledTask.value = task;
      }
    }
  }
);

onMounted(async () => {
  scheduledTask.value = (await remote.sdk.newUserApi(getScheduledTasksApi).getTask({
    taskId
  })).data;

  // eslint-disable-next-line no-secrets/no-secrets
  remote.socket.sendToSocket('ScheduledTasksInfoStart', '1000,1000');
});

onBeforeUnmount(() => {
  // eslint-disable-next-line no-secrets/no-secrets
  remote.socket.sendToSocket('ScheduledTasksInfoStop');
  stopTaskWatch();
});
</script>
