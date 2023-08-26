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
      <VCol
        v-for="(tasks, category) in scheduledTasksGroup"
        :key="category"
        class="mb-2">
        <VFadeTransition group>
          <h2
            :key="`scheduled-task-${category}-title`"
            class="text-h6 mb-2">
            {{ category }}
          </h2>
          <VList
            :key="`scheduled-task-${category}-list`"
            lines="two"
            class="mb-2">
            <VListItem
              v-for="task in tasks"
              :key="task.Key ?? undefined">
              <template
                #title>
                <RouterLink
                  :to="`/settings/scheduled-tasks/${task.Id ?? ''}`"
                  class="white">
                  {{ task.Name ?? 'Unknown Task' }}
                </RouterLink>
              </template>
              <template
                v-if="task.State === 'Running'"
                #subtitle>
                <div class="mt-2">
                  <VProgressLinear
                    :height="6"
                    :model-value="task.CurrentProgressPercentage ?? 0"
                    :bg-opacity="0.8"
                    stream />
                  <p class="mt-1">
                    {{ (task.CurrentProgressPercentage ?? 0.0).toPrecision(3) + '%' }}
                  </p>
                </div>
              </template>
              <template
                v-else-if="task.State === 'Cancelling'"
                #subtitle>
                <div class="mt-2">
                  <VProgressLinear
                    :height="6"
                    :bg-opacity="0.8"
                    indeterminate
                    stream />
                  <p class="mt-1">
                    {{ $t('settings.scheduledTasks.stopping') }}
                  </p>
                </div>
              </template>
              <template
                v-else
                #subtitle>
                {{ formatTaskSubtitleIdle(task) }}
              </template>
              <template #prepend>
                <VAvatar>
                  <VIcon>
                    <IMdiHistory />
                  </VIcon>
                </VAvatar>
              </template>
              <template #append>
                <VBtn @click="() => startOrStopTask(task)">
                  <VIcon>
                    <IMdiPlay v-if="task.State === 'Idle'" />
                    <IMdiSquare v-else />
                  </VIcon>
                </VBtn>
              </template>
            </VListItem>
          </VList>
        </VFadeTransition>
      </VCol>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { groupBy } from 'lodash-es';
import { getScheduledTasksApi } from '@jellyfin/sdk/lib/utils/api/scheduled-tasks-api';
import { TaskInfo } from '@jellyfin/sdk/lib/generated-client';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import IMdiHistory from 'virtual:icons/mdi/history';
import IMdiPlay from 'virtual:icons/mdi/play';
import IMdiSquare from 'virtual:icons/mdi/square';
import { useRouter } from 'vue-router';
import { useRemote , useDateFns } from '@/composables';

type TaskMap = {
  [category: string]: TaskInfo[];
};

const { t } = useI18n();
const remote = useRemote();
const router = useRouter();

const scheduledTasks = ref<TaskInfo[]>();

/**
 * Groups and sorts tasks by category and name
 */
function groupAndSortTasks(tasks: TaskInfo[]): TaskMap {
  const sortedTasks = tasks.sort((a, b) => {
    const a1 = a.Category + ' ' + a.Name;
    const b1 = b.Category + ' ' + b.Name;

    if (a1 > b1) {
      return 1;
    } else if (a1 < b1) {
      return -1;
    } else {
      return 0;
    }
  });

  return groupBy(sortedTasks, (task) => task.Category);
}

const scheduledTasksGroup = computed<TaskMap>(() => {
  const tasks = scheduledTasks.value?.filter((task) => !task.IsHidden) ?? [];

  return groupAndSortTasks(tasks);
});

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
      scheduledTasks.value = Data;
    }
  }
);

/**
 * Formats the subtitle for idle tasks
 */
function formatTaskSubtitleIdle(task: TaskInfo): string | undefined {
  if (task.State === 'Idle' && task.LastExecutionResult) {
    const executionResults = [];

    if (task.LastExecutionResult.StartTimeUtc) {
      const startTime = new Date(task.LastExecutionResult.StartTimeUtc);

      executionResults.push(t('settings.scheduledTasks.lastRan', [useDateFns(formatDistanceToNow, startTime).value]));

      if (task.LastExecutionResult.EndTimeUtc) {
        const endTime = new Date(task.LastExecutionResult.EndTimeUtc);

        executionResults.push(t('settings.scheduledTasks.duration') + ' ' + useDateFns(formatDistance, startTime, endTime).value);
      }
    }

    return executionResults.join(' | ');
  }
}

/**
 * Starts or stops a task
 */
async function startOrStopTask(task: TaskInfo): Promise<void> {
  if (task.Id) {
    if (task.State === 'Idle') {
      await remote.sdk.newUserApi(getScheduledTasksApi).startTask({
        taskId: task.Id
      });
    } else if (task.State === 'Running') {
      await remote.sdk.newUserApi(getScheduledTasksApi).stopTask({
        taskId: task.Id
      });
    }
  }
}

onMounted(async () => {
  scheduledTasks.value = (await remote.sdk.newUserApi(getScheduledTasksApi).getTasks({
    isHidden: false
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
