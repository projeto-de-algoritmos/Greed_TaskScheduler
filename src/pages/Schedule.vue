<template>
  <q-page>
    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-list bordered separator>
        <q-item class="text-bold">
          <q-item-section>Nome</q-item-section>
          <q-item-section>Duração</q-item-section>
          <q-item-section>Pioridade</q-item-section>
          <q-item-section>Deadline</q-item-section>
        </q-item>

        <q-item :key="job.id" v-for="job in schedule">
          <q-item-section>{{ job.name }}</q-item-section>
          <q-item-section>{{ job.duration }}</q-item-section>
          <q-item-section>{{ job.priority }}</q-item-section>
          <q-item-section>{{ formatDateToStr(job.deadline) }}</q-item-section>
        </q-item>
      </q-list>
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
  mounted() {
    this.defineSchedule();
  },
  computed: mapGetters({
    jobs: 'app/jobs',
  }),
  data() {
    return {
      schedule: [],
    };
  },
  methods: {
    formatDateToStr(date) {
      return formatDate(date);
    },
    defineSchedule() {
      let newSelectedJobs = [];

      this.jobs.forEach((job) => {
        const deadline = parseStrDate(job.deadline);

        if (job.dependencies.length === 0) {
          newSelectedJobs.push({ ...job, deadline });
        }
      });

      newSelectedJobs = newSelectedJobs.sort(sortingCompare);

      this.schedule = newSelectedJobs;
    },
  },
};
</script>
