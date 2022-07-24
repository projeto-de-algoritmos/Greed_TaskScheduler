<template>
  <q-page>
    <FormModal ref="formModal" />

    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Jobs"
        :data="jobs"
        :columns="columns"
        row-key="name"
        no-data-label="Nenhum job cadastrado"
      >
        <template v-slot:top-right>
          <q-btn
            color="negative"
            icon-right="delete_forever"
            no-caps
            @click="deleteAll"
          >
            <q-tooltip>Apagar todos os jobs</q-tooltip>
          </q-btn>

          <q-btn
            color="primary"
            icon-right="add"
            no-caps
            class="q-ml-md"
            @click="() => openModal()"
          >
            <q-tooltip>Adicionar novo job</q-tooltip>
          </q-btn>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="primary"
              icon-right="edit"
              no-caps
              flat
              dense
              @click="() => openModal(props.row)"
            >
              <q-tooltip>Editar este job</q-tooltip>
            </q-btn>

            <q-btn
              color="negative"
              icon-right="delete"
              no-caps
              flat
              dense
              @click="deleteJob(props.row.id)"
            >
              <q-tooltip>Remover este job</q-tooltip>
            </q-btn>
          </q-td>
        </template>

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
import { mapGetters, mapActions } from 'vuex';

import FormModal from 'components/Modal.vue';
import { quicksortM3 } from '../utils/quicksortM3';
import { parseStrDate } from '../utils/date';

export default {
  name: 'PageIndex',
  components: {
    FormModal,
  },
  mounted() {
    this.$q.lang.table.recordsPerPage = 'Registros por páginas';

    this.$q.lang.table.pagination = (start, end, total) => {
      return `${start}-${end} de ${total}`;
    };

    const selectedJobs = [];

    console.log(this.jobs);

    this.jobs.forEach((job) => {
      const deadline = parseStrDate(job.deadline);

      if (job.dependencies.length === 0) {
        selectedJobs.push({ ...job, deadline });
      }
    });

    console.log(selectedJobs);

    quicksortM3(selectedJobs);

    console.log(selectedJobs);

    // this.addJob({ id: 'suamae' });

    // this.removeJob('job_1');

    // this.editJob({
    //   jobId: 'suamae',
    //   data: {
    //     name: 'Job 2',
    //     duration: 10,
    //     deadline: new Date('2022-08-23'),
    //     priority: 1,
    //     dependencies: ['job_1', 'job_5', 'job_7'],
    //   },
    // });
  },
  computed: mapGetters({
    jobs: 'app/jobs',
  }),
  data() {
    return {
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
        { name: 'actions', label: 'Ações', align: 'right' },
      ],
    };
  },
  methods: {
    ...mapActions({
      addJob: 'app/addJob',
      editJob: 'app/editJob',
      removeJob: 'app/removeJob',
      deleteAll: 'app/deleteAll',
    }),
    openModal(job = null) {
      this.$refs.formModal.open(job);
    },
    deleteJob(jobId) {
      this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Você tem certeza que deseja apagar este job?',
          cancel: {
            flat: true,
            color: 'negative',
            label: 'Cancelar',
          },
          persistent: true,
        })
        .onOk(() => {
          this.removeJob(jobId);
        });
    },
  },
};
</script>
