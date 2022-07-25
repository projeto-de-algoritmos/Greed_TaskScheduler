<template>
  <q-page>
    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Tasks"
        :data="schedule"
        row-key="name"
        :columns="columns"
        :pagination.sync="pagination"
        no-data-label="Insira uma data e pressione no botão acima para gerar o agendamento"
      >
        <template v-slot:top-right>
          <q-input v-model="startDate" label="Data de início" class="q-mr-md">
            <q-tooltip> Data de início da execução das tasks </q-tooltip>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startDate" mask="DD/MM/YYYY HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startDate" mask="DD/MM/YYYY HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            no-caps
            color="positive"
            class="q-ml-md"
            icon-right="schedule"
            @click="defineSchedule"
          >
            <q-tooltip> Montar agendamento </q-tooltip>
          </q-btn>
        </template>

        <template v-slot:no-data="{ icon, message }">
          <div
            class="full-width row flex-center q-gutter-sm"
            style="color: #ff00ff"
          >
            <span> {{ message }} </span>

            <q-icon size="2em" :name="icon" />
          </div>
        </template>

        <template v-slot:bottom>
          <q-chip
            square
            color="primary"
            text-color="white"
            icon-right="more_time"
          >
            {{
              maxLateness.latenessInSeconds > 0
                ? `${maxLateness.name}: ${maxLateness.lateness}`
                : 'Não há nenhum atraso'
            }}

            <q-tooltip>Atraso máximo</q-tooltip>
          </q-chip>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style>
.page-container {
  width: 80%;
}
</style>

<script>
import { mapGetters } from 'vuex';

import {
  formatDate,
  parseStrDate,
  formatDuration,
  durationStrLocale,
  addDurationToDate,
  intervalToDuration,
} from '../utils/date';

const sortingCompare = (itemA, itemB) => {
  if (itemA.deadline < itemB.deadline) return -1;
  if (itemA.deadline > itemB.deadline) return 1;

  return -1;
};

export default {
  name: 'MinimizeLatenessPage',
  computed: mapGetters({
    tasks: 'app/tasks',
  }),
  data() {
    return {
      maxLateness: {},
      startDate: '',
      deadline: '',
      selected: {},
      schedule: [],
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: 'name',
          label: 'Nome',
          align: 'left',
          required: true,
          field: 'name',
        },
        {
          name: 'duration',
          label: 'Duração',
          align: 'left',
          required: true,
          field: 'duration',
        },
        {
          name: 'deadline',
          label: 'Deadline',
          align: 'left',
          required: true,
          field: 'deadline',
          format: (val) => this.formatDateToStr(val),
        },
        {
          name: 'startTime',
          label: 'Início',
          align: 'left',
          required: true,
          field: 'startTime',
          format: (val) => this.formatDateToStr(val),
        },
        {
          name: 'endTime',
          label: 'Fim',
          align: 'left',
          required: true,
          field: 'endTime',
          format: (val) => this.formatDateToStr(val),
        },
        {
          name: 'lateness',
          label: 'Atraso',
          align: 'left',
          required: true,
          field: 'lateness',
        },
      ],
    };
  },
  methods: {
    formatDateToStr(date) {
      return formatDate(date);
    },
    defineSchedule() {
      let newSelectedTasks = [];
      let time = parseStrDate(this.startDate);

      if (Number.isNaN(time.getTime())) return;

      this.tasks.forEach((task) => {
        const deadline = parseStrDate(task.deadline);

        newSelectedTasks.push({ ...task, deadline });
      });

      newSelectedTasks = newSelectedTasks.sort(sortingCompare);

      let maxLateness = { name: '', lateness: 0, latenessInSeconds: 0 };

      this.schedule = newSelectedTasks.map((task) => {
        const startTime = new Date(time);

        time = addDurationToDate(time, task.duration);

        const endTime = new Date(time);
        const late = endTime > task.deadline;
        let lateness = 0;

        if (late) {
          const diffInSeconds = endTime - task.deadline;

          const durationObj = intervalToDuration({
            start: task.deadline,
            end: endTime,
          });

          lateness = formatDuration(durationObj);

          lateness = durationStrLocale(lateness);

          if (diffInSeconds > maxLateness.latenessInSeconds)
            maxLateness = {
              name: task.name,
              latenessInSeconds: diffInSeconds,
              lateness,
            };
        }

        return { ...task, startTime, endTime, lateness };
      });

      this.maxLateness = maxLateness;
    },
  },
};
</script>
