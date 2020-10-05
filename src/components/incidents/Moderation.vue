<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            Модерация инцидентов
            <v-row>
              <v-col>
                <v-select
                    v-model="valueEpic"
                    :items="filter"
                    label="Важность"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                    v-model="valueModer"
                    :items="filterModer"
                    label="Модерация"
                ></v-select>
              </v-col>
              <v-col>
                <v-autocomplete
                    v-model="valueAuthor"
                    :items="allUsers"
                    item-text="attributes.username"
                    label="Отправитель"
                    return-object
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete
                    v-model="valueTarget"
                    :items="workers"
                    item-text="attributes.username"
                    label="Получатель"
                    return-object
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete
                    v-model="valueCriterion"
                    :items="criteria"
                    item-text="attributes.name"
                    label="Критерий"
                    return-object
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-select
                    v-model="valueType"
                    :items="filterType"
                    label="Тип"
                ></v-select>
              </v-col>
              <v-col>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="dates"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dates"
                        label="Дата"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="dates"
                      no-title
                      range
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Отмена
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(dates = [])">
                      Отчистить
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(dates)">
                      Ок
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="allIncidents"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          :loading="loading"
          hide-default-footer
          class="elevation-1"
          @page-count="pageCount = $event"
      >
        <template v-slot:item.attributes.FEpic="{ item }">
          <div v-if="item.attributes.FEpic">
            <v-icon color="error">mdi-alert-octagon</v-icon>
          </div>
          <div v-else>
            <v-icon>mdi-alert-octagon</v-icon>
          </div>
        </template>

        <template v-slot:item.attributes.FModer="{ item }">
          <v-btn icon color="green" v-show="item.attributes.FModer === null || item.attributes.FDelete" @click.once="moderateIncident(item)">
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <v-btn icon color="red" v-show="item.attributes.FModer === null || item.attributes.FDelete" @click.once="noModerateIncident(item)">
            <v-icon>mdi-thumb-down</v-icon>
          </v-btn>
          <div v-show="item.attributes.FModer !== null || item.attributes.FDelete">
            <div v-if="item.attributes.FModer">Есть</div>
            <div v-else>Отклонено</div>
          </div>
        </template>

        <template v-slot:item.relationships.author.data.id="{ item }">
          {{allUsers.find(author => author.id === item.relationships.author.data.id).attributes.username}}
        </template>

        <template v-slot:item.relationships.target.data.id="{ item }">
          {{workers.find(target => target.id === item.relationships.target.data.id).attributes.username}}
        </template>

        <template v-slot:item.relationships.criterion.data.id="{ item }">
          {{criteria.find(criterion => criterion.id === item.relationships.criterion.data.id).attributes.smallName}}
        </template>

        <template v-slot:item.attributes.description="{ item }">
          <div v-if="item.attributes.description.length < 20">
            {{item.attributes.description}}
          </div>
          <div v-else>
            <v-btn icon color="indigo" @click="openUpdateDescription(item)">
              <v-icon>mdi-table-of-contents</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:item.attributes.proof="{ item }">
          <v-btn icon color="primary" @click="clickUrl(item.attributes.proof)">
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.attributes.FPositive="{ item }">
          <div v-if="item.attributes.FPositive">Позитивный</div>
          <div v-else>Негативный</div>
        </template>

        <template v-slot:item.attributes.createdAt="{ item }">
          {{item.attributes.createdAt | moment("HH:mm DD.MM.YYYY")}}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon color="primary" :disabled="item.attributes.FModer !== null || item.attributes.FDelete" @click="openUpdateDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="teal accent-3" @click="openLogsDialog(item)">
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </template>

      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
        <v-text-field
            class="text-right mx-4"
            style="max-width: 150px"
            :value="itemsPerPage"
            label="Элементов на странице"
            type="number"
            min="-1"
            max="15"
            @input="itemsPerPage = parseInt($event, 10)"
        ></v-text-field>
      </div>
    </v-card>
    <logs-incident
        ref="refDialogLogs"
        :dialog="dialogLogs"
        @closeDialog="closeDialog">
    </logs-incident>
    <description-incident
        ref="refDialogDescription"
        :dialog="dialogDescription"
        @closeDialog="closeDialog">
    </description-incident>
    <update-incident
        ref="refDialogUpdate"
        :dialog="dialogUpdate"
        @closeDialog="closeDialog">
    </update-incident>
  </v-container>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import updateIncident from "./dialog/Update";
  import descriptionIncident from "./dialog/Description";
  import logsIncident from "./dialog/Logs";
  import moment from "moment";

  export default {
    name: "List",
    components: {
      updateIncident,
      descriptionIncident,
      logsIncident
    },
    data: () =>({
      dates: [],
      menu: false,
      modal: false,
      dialogLogs: false,
      dialogDelete: false,
      dialogDescription: false,
      dialogUpdate: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      valueEpic: 'все',
      filter: ['да', 'нет', 'все'],
      filterModer: ['есть', 'нет', 'отклонено', 'все'],
      valueModer: 'все',
      filterType: ['позитивный', 'негативный', 'все'],
      valueType: 'все',
      valueAuthor: '',
      valueTarget: '',
      valueCriterion: '',
    }),
    computed: {
      ...mapGetters(['allIncidents', 'allUsers', 'logs', 'targetsIncidentsSent', 'criteria', 'workers']),
      loading() {
        if (this.allIncidents === undefined) {
          return true
        } else {
          return false
        }
      },
      headers () {
        return [
          { text: 'Важность',
            value: 'attributes.FEpic',
            filter: value => {
              if (this.valueEpic === 'все') return true
              if (this.valueEpic === 'да') return value === true
              if (this.valueEpic === 'нет') return value === false
            },
            align: 'center'
          },
          { text: 'Модерация',
            value: 'attributes.FModer',
            filter: value => {
              if (this.valueModer === 'все') return true
              if (this.valueModer === 'есть') return value === true
              if (this.valueModer === 'нет') return value === null
              if (this.valueModer === 'отклонено') return value === false
            },
            align: 'center'
          },
          { text: 'Отправитель',
            value: 'relationships.author.data.id',
            filter: value => {
              if (!this.valueAuthor) return true
              return value === this.valueAuthor.id
            },
            align: 'center'
          },
          { text: 'Получатель',
            value: 'relationships.target.data.id',
            filter: value => {
              if (!this.valueTarget) return true
              return value === this.valueTarget.id
            },
            align: 'center'
          },
          { text: 'Критерий',
            value: 'relationships.criterion.data.id',
            filter: value => {
              if (!this.valueCriterion) return true
              return value === this.valueCriterion.id
            },
            align: 'center'
          },
          { text: 'Описание', value: 'attributes.description', align: 'center', sortable: false },
          { text: 'Доказательство', value: 'attributes.proof', align: 'center', sortable: false },
          { text: 'Тип',
            value: 'attributes.FPositive',
            filter: value => {
              if (this.valueType === 'все') return true
              if (this.valueType === 'позитивный') return value === true
              if (this.valueType === 'негативный') return value === false
            },
            align: 'center' },
          { text: 'Создан',
            value: 'attributes.createdAt',
            filter: value => {
              if (this.dates.length === 0) return true
              if (this.dates.length === 1) return moment(value).format('YYYY-MM-DD') === this.dates[0]
              if (this.dates.length === 2) {
                this.dates.sort()
                return moment(value).format('YYYY-MM-DD') >= this.dates[0] && moment(value).format('YYYY-MM-DD') <= this.dates[1]
              }
            },
            align: 'center' },
          { text: 'Действия', value: 'actions', align: 'center', sortable: false },
        ]
      },
    },
    methods: {
      ...mapActions([ 'retrieveCriteria', 'retrieveWorkers', 'retrieveIncidents', 'retrieveAllUsers', 'retrieveLogs']),
      noModerateIncident(incident){
        this.$store.dispatch('noModerateIncident', incident)
          .then(() => {
          })
          .catch(error => {
            console.log(error);
          })
      },
      moderateIncident(incident){
        this.$store.dispatch('moderateIncident', incident)
          .then(() => {
          })
          .catch(error => {
            console.log(error);
          })
      },
      openLogsDialog(incident) {
        this.dialogLogs = true;
        this.$refs.refDialogLogs.createDialog(incident);
      },
      openUpdateDescription(incident){
        this.dialogDescription = true;
        this.$refs.refDialogDescription.createDialog(incident);
      },
      openUpdateDialog(incident){
        this.dialogUpdate = true;
        this.$refs.refDialogUpdate.createDialog(incident);
      },
      closeDialog() {
        this.dialogLogs = false;
        this.dialogDescription = false;
        this.dialogDelete = false;
        this.dialogUpdate = false;
      },
      clickUrl(url) {
        window.open(url);
      }
    },
    created() {
      this.retrieveIncidents();
      this.retrieveAllUsers();
      this.retrieveCriteria();
      this.retrieveWorkers();
    }
  }
</script>

<style scoped>

</style>