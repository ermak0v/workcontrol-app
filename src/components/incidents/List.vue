<template>
  <v-container>
    <v-card>
      <v-card-title>
        <tr>
          Инциденты
          <td>
            <v-select
                v-model="valueEpic"
                :items="filter"
                label="Важность"
            ></v-select>
          </td>
          <td>
            <v-select
                v-model="valueModer"
                :items="filter"
                label="Модерация"
            ></v-select>
          </td>
          <td>
            <v-autocomplete
                v-model="valueTarget"
                :items="workers"
                item-text="attributes.username"
                label="Сотрудник"
                return-object
            ></v-autocomplete>
          </td>
          <td>
            <v-autocomplete
                v-model="valueCriterion"
                :items="criteria"
                item-text="attributes.name"
                label="Критерий"
                return-object
            ></v-autocomplete>
          </td>
          <td colspan="2"></td>
          <td>
            <v-select
                v-model="valueType"
                :items="filterType"
                label="Тип"
            ></v-select>
          </td>
          <td colspan="2"></td>
        </tr>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="sentIncidents"
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
          <div v-if="item.attributes.FModer">Есть</div>
          <div v-else>Нет</div>
        </template>

        <template v-slot:item.relationships.target.data.id="{ item }">
          {{targetsIncidentsSent.find(target => target.id === item.relationships.target.data.id).attributes.username}}
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
          <v-btn icon color="primary" @click="openUpdateDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="openDeleteDialog(item)">
            <v-icon>mdi-delete</v-icon>
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
    <description-incident
        ref="refDialogDescription"
        :dialog="dialogDescription"
        @closeDialog="closeDialog">
    </description-incident>
    <delete-incident
        ref="refDialogDelete"
        :dialog="dialogDelete"
        @closeDialog="closeDialog">
    </delete-incident>
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
  import deleteIncident from "./dialog/Delete";
  import descriptionIncident from "./dialog/Description";

  export default {
    name: "List",
    components: {
      updateIncident,
      deleteIncident,
      descriptionIncident
    },
    data: () =>({
      loading: false,
      dialogDelete: false,
      dialogDescription: false,
      dialogUpdate: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      valueEpic: 'все',
      filter: ['да', 'нет', 'все'],
      valueModer: 'все',
      filterType: ['позитивный', 'негативный', 'все'],
      valueType: 'все',
      valueTarget: '',
      valueCriterion: '',
    }),
    computed: {
      ...mapGetters(['sentIncidents', 'targetsIncidentsSent', 'criteria', 'workers']),
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
              if (this.valueModer === 'да') return value === true
              if (this.valueModer === 'нет') return value === false
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
          { text: 'Создан', value: 'attributes.createdAt', align: 'center' },
          { text: 'Действия', value: 'actions', align: 'center', sortable: false },
        ]
      },
    },
    methods: {
      ...mapActions(['retrieveSentIncidents', 'retrieveCriteria', 'retrieveWorkers']),
      openUpdateDescription(incident){
        this.dialogDescription = true;
        this.$refs.refDialogDescription.createDialog(incident);
      },
      openDeleteDialog(incident){
        this.dialogDelete = true;
        this.$refs.refDialogDelete.createDialog(incident);
      },
      openUpdateDialog(incident){
        this.dialogUpdate = true;
        this.$refs.refDialogUpdate.createDialog(incident);
      },
      closeDialog() {
        this.dialogDescription = false;
        this.dialogDelete = false;
        this.dialogUpdate = false;
      },
      clickUrl(url) {
        window.open(url);
      }
    },
    created() {
      this.retrieveSentIncidents();
      this.retrieveCriteria();
      this.retrieveWorkers();
    }
  }
</script>

<style scoped>

</style>