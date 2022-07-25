<template>
  <q-page>
    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Tasks"
        :data="schedule"
        row-key="name"
        :columns="columns"
        :pagination.sync="pagination"
        no-data-label="Nenhum task cadastrado"
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
    this.defineSchedule(this.tasks);
  },
  computed: mapGetters({
    tasks: 'app/tasks',
  }),
  data() {
    return {
      iterations: 1,
      selected: {},
      schedule: [],
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: 'iteration',
          label: 'Iteração',
          align: 'left',
          required: true,
          field: 'iteration',
        },
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
    defineSchedule(tasks) {
      if (tasks.length === 0) return;

      let newSelectedTasks = [];
      const notSelected = [];
      const newSelected = { ...this.selected };

      tasks.forEach((task) => {
        const deadline =
          task.deadline instanceof Date
            ? task.deadline
            : parseStrDate(task.deadline);

        if (
          task.dependencies.length === 0 ||
          task.dependencies.every((item) => !!newSelected[item])
        ) {
          newSelectedTasks.push({
            ...task,
            deadline,
            iteration: this.iterations,
          });
        } else {
          notSelected.push({ ...task, deadline });
        }
      });

      newSelectedTasks = newSelectedTasks.sort(sortingCompare);

      this.schedule = [...this.schedule, ...newSelectedTasks];

      newSelectedTasks.forEach((task) => {
        newSelected[task.name] = true;
      });

      this.selected = newSelected;

      this.iterations += 1;

      this.defineSchedule(notSelected);
    },
  },
};
</script>
