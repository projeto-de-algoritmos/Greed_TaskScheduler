<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Task</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="submit" @reset="resetData" class="q-gutter-md">
          <q-input
            v-model="name"
            label="Nome"
            :error="!name && !!fieldsErrors.name"
          >
            <template v-slot:error>{{ fieldsErrors.name }}</template>
          </q-input>

          <q-input
            v-model="duration"
            label="Duração"
            mask="fulltime"
            placeholder="HH:MM:SS"
            :error="!!fieldsErrors.duration"
          >
            <template v-slot:error>{{ fieldsErrors.duration }}</template>
          </q-input>

          <q-input
            v-model="priority"
            label="Prioridade"
            type="number"
            :error="!!fieldsErrors.priority"
          >
            <template v-slot:error>{{ fieldsErrors.priority }}</template>
          </q-input>

          <q-input
            v-model="deadline"
            label="Deadline"
            :error="!!fieldsErrors.deadline"
          >
            <template v-slot:error>{{ fieldsErrors.deadline }}</template>

            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="deadline" mask="DD/MM/YYYY HH:mm">
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
                  <q-time v-model="deadline" mask="DD/MM/YYYY HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-select
            counter
            multiple
            hint="Contador"
            label="Depedências"
            v-model="dependencies"
            :options="getDependencies()"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" @click="close" />

        <q-btn flat label="Salvar" color="primary" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style></style>

<script>
import { v4 as uuidv4 } from 'uuid';
import { mapGetters, mapActions } from 'vuex';

import { validateStrDate } from '../utils/date';

export default {
  name: 'TaskFormModal',
  props: {
    task: {
      type: Object,
      default: null,
    },
  },
  computed: mapGetters({
    tasks: 'app/tasks',
  }),
  data() {
    return {
      edit: false,
      opened: false,
      id: null,
      name: '',
      priority: '',
      deadline: '',
      duration: '',
      dependencies: [],
      fieldsErrors: {},
    };
  },
  methods: {
    ...mapActions({
      addTask: 'app/addTask',
      editTask: 'app/editTask',
    }),
    open(task = null) {
      this.edit = !!task;
      this.opened = true;

      if (this.edit) {
        const { id, name, duration, deadline, priority, dependencies } = task;

        this.id = id;
        this.name = name;
        this.duration = duration;
        this.priority = priority;
        this.deadline = deadline;
        this.dependencies = dependencies;
      }
    },
    close() {
      this.resetData();

      this.opened = false;
    },
    getDependencies() {
      const dependencies = [];

      this.tasks.forEach((task) => {
        if (task.id !== this.id) dependencies.push(task.name);
      });

      return dependencies;
    },
    validateDate(str) {
      return validateStrDate(str);
    },
    validateFields() {
      const newErrors = {};

      if (!this.name) newErrors.name = 'O nome é obrigatório';

      if (!this.duration) newErrors.duration = 'A duração é obrigatória';
      else if (this.duration.length !== 8)
        newErrors.duration = 'O tempo inserido na duração é inválido';

      if (
        this.priority.toString().includes('.') ||
        this.priority.toString().includes(',')
      ) {
        newErrors.priority =
          'A prioridade é inválida, é esperado um número inteiro';
      }

      if (!this.deadline) newErrors.deadline = 'O deadline é obrigatório';
      else if (!validateStrDate(this.deadline))
        newErrors.deadline = 'A data inserida no deadline é inválida';

      this.fieldsErrors = { ...newErrors };

      return Object.keys(newErrors).length === 0;
    },
    submit() {
      if (!this.validateFields()) return;

      const newTask = {
        name: this.name,
        deadline: this.deadline,
        duration: this.duration,
        dependencies: this.dependencies,
        priority: !this.priority ? 1 : parseInt(this.priority, 10),
      };

      if (this.edit) {
        this.editTask({ taskId: this.id, data: newTask });
      } else {
        this.addTask({ ...newTask, id: uuidv4() });
      }

      this.close();
    },
    resetData() {
      this.edit = false;
      this.id = null;
      this.name = '';
      this.duration = '';
      this.deadline = '';
      this.priority = '';
      this.dependencies = [];
      this.fieldsErrors = {};
    },
  },
};
</script>
