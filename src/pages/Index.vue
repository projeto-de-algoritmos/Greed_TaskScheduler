<template>
  <q-page>
    <FormModal ref="formModal" />

    <div class="page-container flex column q-mt-xl q-mx-auto">
      <q-table
        title="Tasks"
        :data="tasks"
        row-key="name"
        :columns="columns"
        :pagination.sync="pagination"
        no-data-label="Nenhuma task cadastrada"
      >
        <template v-slot:top-right>
          <q-btn
            no-caps
            color="positive"
            class="q-mr-md"
            icon-right="schedule"
            @click="() => $router.push({ name: 'Lateness' })"
          >
            <q-tooltip>Montar agendamento</q-tooltip>
          </q-btn>

          <q-btn
            color="negative"
            icon-right="delete_forever"
            no-caps
            @click="deleteAll"
          >
            <q-tooltip>Apagar todas as tasks</q-tooltip>
          </q-btn>

          <q-btn
            color="primary"
            icon-right="add"
            no-caps
            class="q-ml-md"
            @click="() => openModal()"
          >
            <q-tooltip>Adicionar nova task</q-tooltip>
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
              <q-tooltip>Editar esta task</q-tooltip>
            </q-btn>

            <q-btn
              color="negative"
              icon-right="delete"
              no-caps
              flat
              dense
              @click="deleteTask(props.row.id)"
            >
              <q-tooltip>Remover esta task</q-tooltip>
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
  },
  computed: mapGetters({
    tasks: 'app/tasks',
  }),
  data() {
    return {
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
      addTask: 'app/addTask',
      editTask: 'app/editTask',
      removeTask: 'app/removeTask',
      deleteAll: 'app/deleteAll',
    }),
    openModal(task = null) {
      this.$refs.formModal.open(task);
    },
    deleteTask(taskId) {
      this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Você tem certeza que deseja apagar esta task?',
          cancel: {
            flat: true,
            color: 'negative',
            label: 'Cancelar',
          },
          persistent: true,
        })
        .onOk(() => {
          this.removeTask(taskId);
        });
    },
  },
};
</script>
