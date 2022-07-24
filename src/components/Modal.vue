<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Job</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="submit" @reset="resetData" class="q-gutter-md">
          <q-input v-model="name" label="Nome" :error="!name && !!fieldsErrors">
            <template v-slot:error>{{ fieldsErrors.name }}</template>
          </q-input>

          <q-input
            v-model="duration"
            label="Duração"
            :error="!duration && !!fieldsErrors"
          >
            <template v-slot:error>{{ fieldsErrors.duration }}</template>
          </q-input>

          <q-input
            v-model="priority"
            label="Prioridade"
            :error="!priority && !!fieldsErrors"
          >
            <template v-slot:error>{{ fieldsErrors.priority }}</template>
          </q-input>

          <q-input
            v-model="deadline"
            label="Deadline"
            :error="!validateStrDate(deadline) && !!fieldsErrors"
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
import { parse } from 'date-fns';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'JobFormModal',
  props: {
    job: {
      type: Object,
      default: null,
    },
  },
  computed: mapGetters({
    jobs: 'app/jobs',
  }),
  data() {
    return {
      edit: false,
      opened: false,
      id: '',
      name: '',
      deadline: '',
      duration: null,
      priority: null,
      dependencies: [],
      fieldsErrors: null,
    };
  },
  methods: {
    ...mapActions({
      addJob: 'app/addJob',
      editJob: 'app/editJob',
    }),
    open(job = null) {
      this.edit = !!job;
      this.opened = true;

      if (this.edit) {
        const { id, name, duration, deadline, priority, dependencies } = job;

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
    parseStrDate(str) {
      return parse(str, 'dd/MM/yyyy HH:mm', new Date());
    },
    validateStrDate(str) {
      try {
        return !Number.isNaN(this.parseStrDate(str).getTime());
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        return false;
      }
    },
    validateFields() {
      const newErrors = {};

      if (!this.name) newErrors.name = 'O nome é obrigatório';
      if (!this.duration) newErrors.duration = 'A duração é obrigatória';
      if (!this.priority) newErrors.priority = 'A prioridade é obrigatória';

      if (!this.deadline) {
        newErrors.deadline = 'O deadline é obrigatório';
      } else if (!this.validateStrDate(this.deadline)) {
        newErrors.deadline = 'A data inserida no deadline é inválida';
      }

      this.fieldsErrors = { ...newErrors };

      return Object.keys(newErrors).length === 0;
    },
    submit() {
      if (!this.validateFields()) return;

      const newJob = {
        name: this.name,
        duration: this.duration,
        priority: this.priority,
        deadline: this.deadline,
        dependencies: this.dependencies,
      };

      if (this.edit) {
        this.editJob({ jobId: this.id, data: newJob });
      } else {
        this.addJob({ ...newJob, id: uuidv4() });
      }

      this.close();
    },
    resetData() {
      this.edit = false;
      this.id = '';
      this.name = '';
      this.duration = null;
      this.deadline = '';
      this.priority = null;
      this.dependencies = [];
      this.fieldsErrors = null;
    },
  },
};
</script>
