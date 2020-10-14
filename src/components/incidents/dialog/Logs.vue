<template>
  <v-dialog v-model="dialog" persistent width="1000px">
    <v-card>
      <v-card-title class="grey darken-2">
        Логи инцидента
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="logs"
          hide-default-footer
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          :loading="loading"
          show-expand
          class="elevation-1"
      >

        <template v-slot:item.relationships.creator.data.id="{ item }">
          {{allUsers.find(author => author.id === item.relationships.creator.data.id).attributes.username}}
        </template>

        <template v-slot:item.attributes.action="{ item }">
          <div v-if="item.attributes.action === 'update'">Обновление</div>
          <div v-else-if="item.attributes.action === 'create'">Создание</div>
          <div v-else-if="item.attributes.action === 'delete'">Удаление</div>
          <div v-else>Модерация</div>
        </template>

        <template v-slot:item.attributes.createdAt="{ item }">
          {{item.attributes.createdAt | moment("HH:mm DD.MM.YYYY")}}
        </template>

        <template v-slot:expanded-item="{ headers, item}">
          <td :colspan="headers.length">
            <div v-if="item.attributes.FEpic">
              Важно <v-icon small color="error">mdi-alert-octagon</v-icon>
            </div>
            Получатель: {{allUsers.find(author => author.id === item.relationships.target.data.id).attributes.username}}<br/>
            Критерий: {{criteria.find(criterion => criterion.id === item.relationships.criterion.data.id).attributes.name}}<br/>
            Описание: {{item.attributes.description}}<br/>
            Доказательство:
            <v-btn icon small color="primary" @click="clickUrl(item.attributes.proof)">
              <v-icon>mdi-link-variant</v-icon>
            </v-btn>
            <div v-if="item.attributes.FPositive">Тип: Позитивный</div>
            <div v-else>Тип: Негативный</div>
          </td>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            text
            color="primary"
            @click="cancelDialog"
        >Ок</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Logs",
    props: [
      'dialog'
    ],
    data: () =>({
      expanded: [],
      singleExpand: false,
    }),
    computed: {
      ...mapGetters(['allIncidents', 'allUsers', 'criteria', 'logs']),
      loading() {
        if (this.logs === undefined) {
          return true
        } else {
          return false
        }
      },
      headers () {
        return [
          { text: 'Сотрудник', value: 'relationships.creator.data.id'},
          { text: 'Действие', value: 'attributes.action'},
          { text: 'Дата', value: 'attributes.createdAt'},
          { text: '', value: 'data-table-expand' },
        ]
      },
    },
    methods: {
      ...mapActions(['retrieveLogs']),
      createDialog(incident) {
        this.retrieveLogs(incident.id);
      },
      cancelDialog() {
        this.$emit("closeDialog")
      },
      clickUrl(url) {
        window.open(url);
      }
    }
  }
</script>

<style scoped>

</style>