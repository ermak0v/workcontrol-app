<template>
  <v-container>
    <template>
      <v-card>
        <v-card-title>
          Инциденты
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Поиск"
              single-line
              hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="allIncidents"
            :search="search"
            item-key="name"
            class="elevation-1"
        >
          <template v-slot:item.moderate = {item}>
            <v-btn icon color="green" :disabled="item.attributes.FModer || item.attributes.FDelete" @click.stop="moderateIncident(item)">
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.modere = {item}>
            <v-simple-checkbox v-model="item.attributes.FModer" disabled></v-simple-checkbox>
          </template>
          <template v-slot:item.target = {item}>
            {{allUsers.find(target => target.id === item.relationships.target.data.id).attributes.username}}
          </template>
          <template v-slot:item.positive = {item}>
            <div v-show="item.attributes.FPositive">Позитивный</div>
            <div v-show="!item.attributes.FPositive">Негативный</div>
          </template>
          <template v-slot:item.create = {item}>

            {{item.attributes.createdAt | moment("HH:mm DD.MM.YYYY")}}
          </template>
          <template v-slot:item.actions = {item}>
            <v-btn outlined small color="primary" @click.stop = "additionalInfo(item)">Просмотр</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </template>
    <v-dialog v-model="dialog" width="1000">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Информация по инциденту
        </v-card-title>

        <v-container fluid>
          <v-row justify="center" >
            <v-col cols="12">
              <v-card>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">Текущие состоянние</div>
                    <v-list-item-title>
                      <div v-if="create !== ''">
                        Создан: {{create | moment("HH:mm DD.MM.YYYY")}}
                      </div>
                      <v-spacer></v-spacer>
                      Отправитель: {{author}}
                      <v-spacer></v-spacer>
                      Получатель: {{target}}
                      <v-spacer></v-spacer>
                      <p>Критерий: {{criterion}}</p>
                      <p>Описание: {{description}}</p>
                      <p>Доказательство: {{proof}}</p>
                      Удалялся: {{this.delete}} Одобрен: {{moder}} Обновлялся: {{update}}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>

          <v-row justify="center" v-for="(log, i) in logs" :key="i">
            <v-col cols="12">
              <v-card>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4" v-if="log.attributes.action === 'update'">Обновлено {{allUsers.find(creator => creator.id === log.relationships.creator.data.id).attributes.username}}</div>
                    <div class="overline mb-4" v-if="log.attributes.action === 'delete'">Удалено {{allUsers.find(creator => creator.id === log.relationships.creator.data.id).attributes.username}}</div>
                    <div class="overline mb-4" v-if="log.attributes.action === 'moderate'">Одобрено {{allUsers.find(creator => creator.id === log.relationships.creator.data.id).attributes.username}}</div>
                    <div class="overline mb-4" v-if="log.attributes.action === 'create'">Создано {{allUsers.find(creator => creator.id === log.relationships.creator.data.id).attributes.username}}</div>
                    <v-list-item-title>
                      <div>Время: {{log.attributes.createdAt | moment("HH:mm DD.MM.YYYY")}}</div>
                      <v-spacer></v-spacer>
                      Получатель: {{allUsers.find(target => target.id === log.relationships.target.data.id).attributes.username}}
                      <v-spacer></v-spacer>
                      <p>Критерий: {{criteria.find(criterion => criterion.id === log.relationships.criterion.data.id).attributes.name}}</p>
                      <p>Описание: {{log.attributes.description}}</p>
                      <p>Доказательство: {{log.attributes.proof}}</p>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>

        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Moderation",
    data () {
      return {
        dialog: false,
        search: '',
        author: [],
        target: [],
        criterion: [],
        description: '',
        proof: '',
        FPositive: 'true',
        create: '',
        delete: '',
        moder: '',
        update: '',
        headers: [
          { text: 'Одобрить', value: 'moderate', sortable: false},
          { text: 'Одобрено', value: 'modere' },
          { text: 'Получатель', value: 'target' },
          { text: 'Описание', align: 'start', sortable: false, value: 'attributes.description' },
          { text: 'Оценка', value: 'positive' },
          { text: 'Создан', value: 'create' },
          { text: 'Доп. инф.', value: 'actions', sortable: false },
        ],
      }
    },
    computed: mapGetters(['allIncidents', 'allUsers', 'criteria', 'logs']),
    methods: {
      ...mapActions(['retrieveIncidents', 'retrieveCriteria', 'retrieveAllUsers', 'retrieveLogs']),
      moderateIncident(incident){
        this.$store.dispatch('moderateIncident', incident)
          .then(() => {
          })
          .catch(error => {
            console.log(error);
          })
      },
      additionalInfo(incident) {
        this.author = this.allUsers.find(author => author.id === incident.relationships.author.data.id).attributes.username;
        this.target = this.allUsers.find(target => target.id === incident.relationships.target.data.id).attributes.username;
        this.criterion = this.criteria.find(criterion => criterion.id === incident.relationships.criterion.data.id).attributes.name;
        this.create = incident.attributes.createdAt;
        this.description = incident.attributes.description;
        this.proof = incident.attributes.proof;
        this.dialog = true;
        if (incident.attributes.FDelete){
          this.delete = 'да'
        } else {
          this.delete = 'нет'
        }
        if (incident.attributes.FModer){
          this.moder= 'да'
        } else {
          this.moder = 'нет'
        }
        if (incident.attributes.updateAt === null){
          this.update= 'да'
        } else {
          this.update = 'нет'
        }
        this.retrieveLogs(incident.id);
      }
    },
    created() {
      this.retrieveIncidents();
      this.retrieveAllUsers();
      this.retrieveCriteria();
    }
  }
</script>

<style scoped>

</style>