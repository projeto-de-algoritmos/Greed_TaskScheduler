<template>
  <q-page>
    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Jobs"
        :data="schedule"
        row-key="name"
        :columns="columns"
        :pagination.sync="pagination"
        no-data-label="Nenhum job cadastrado"
      >
        <template v-slot:no-data="{ icon, message }">
          <div
            class="full-width row flex-center q-gutter-sm"
            style="color: #ff00ff"
          >
            <q-icon size="2em" name="sentiment_dissatisfied" />

            <span> {{ message }} </span>

            <q-icon size="2em" :name="icon" />
          </div>
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

import { formatDate, parseStrDate } from '../utils/date';

const sortingCompare = (itemA, itemB) => {
  if (itemA.priority > itemB.priority) return -1;
  if (itemA.priority < itemB.priority) return 1;
  if (itemA.deadline < itemB.deadline) return -1;
  if (itemA.deadline > itemB.deadline) return 1;

  return -1;
};

export default {
  name: 'SchedulePage',
  created() {
    this.defineSchedule(this.jobs);
  },
  computed: mapGetters({
    jobs: 'app/jobs',
  }),
  data() {
    return {
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
          name: 'priority',
          label: 'Prioridade',
          align: 'left',
          required: true,
          field: 'priority',
        },
        {
          name: 'dependencies',
          label: 'Dependências',
          align: 'left',
          required: true,
          field: 'dependencies',
          format: (val) => val.join(', '),
        },
      ],
    };
  },
  methods: {
    formatDateToStr(date) {
      return formatDate(date);
    },
    // We have to test and think about this
    defineSchedule(jobs) {
      if (jobs.length === 0) return;

      let newSelectedJobs = [];
      const notSelected = [];
      const newSelected = { ...this.selected };

      jobs.forEach((job) => {
        const deadline =
          job.deadline instanceof Date
            ? job.deadline
            : parseStrDate(job.deadline);

        if (
          job.dependencies.length === 0 ||
          job.dependencies.every((item) => !!newSelected[item])
        ) {
          newSelectedJobs.push({ ...job, deadline });
        } else {
          notSelected.push({ ...job, deadline });
        }
      });

      newSelectedJobs = newSelectedJobs.sort(sortingCompare);

      this.schedule = [...this.schedule, ...newSelectedJobs];

      newSelectedJobs.forEach((job) => {
        newSelected[job.name] = true;
      });

      this.selected = newSelected;

      this.defineSchedule(notSelected);
    },
  },
};
</script>
