<template>
  <v-container>
    <v-expansion-panels v-if="sentIncidents !== null">
      <v-expansion-panel v-for="(incident, i) in sentIncidents" :key="i">
        <v-expansion-panel-header>
          {{targetsIncidentsSent.find(target => target.id === incident.relationships.target.data.id).attributes.username}}
          <v-spacer></v-spacer>
          {{incident.attributes.createdAt | moment("HH:mm DD.MM.YYYY")}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Критерий:<br>
            {{criteria.find(criterion => criterion.id === incident.relationships.criterion.data.id).attributes.name}}
          </p>
          <p>
            Описание:<br>
            {{incident.attributes.description}}
          </p>
          <p>
            Доказательство:<br>
            {{incident.attributes.proof}}
          </p>
          <p  v-show="incident.attributes.FPositive">
            Инцидент: позитивный
          </p>
          <p  v-show="!incident.attributes.FPositive">
            Инцидент: негативный
          </p>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" :disabled="incident.attributes.FModer" @click="deleteIncident(incident)">Удалить</v-btn>
            <v-btn text color="primary" :disabled="incident.attributes.FModer" @click="updateIncident(incident)">Изменить</v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey darken-2">
          Изменить инцидент
        </v-card-title>
          <v-alert v-model="alertError" dense outlined type="error">
            Инцидент не добавлен
          </v-alert>
          <v-form ref="form">
            <v-row class="mx-2">
            <v-col cols="12">
              <v-select
                  v-model="target"
                  :items="workers"
                  item-text="attributes.username"
                  label="Сотрудник"
                  :rules="[target.length !== 0 || 'Выберите сотрудника']"
                  return-object
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="criterion"
                  :items="criteria"
                  item-text="attributes.name"
                  label="Критерий"
                  :rules="[criterion.length !== 0 || 'Выберите критерий']"
                  return-object
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="description"
                  placeholder="Описание"
                  :rules="[v => !!v || 'Напишите описание']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="proof"
                  placeholder="Доказательство"
                  :rules="[v => !!v || 'Напишите доказательство']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <span>Инцидент: </span>
              <v-radio-group v-model="FPositive" :mandatory="false">
                <v-radio label="Позитивный" value="true"></v-radio>
                <v-radio label="Негативный" value="false"></v-radio>
              </v-radio-group>
            </v-col>
            </v-row>
          </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="dialog = false"
          >Отмена</v-btn>
          <v-btn
              text
              @click="saveIncident()"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "List",
    data: () =>({
      idIncident: '',
      _idIncident: '',
      dialog: false,
      description: '',
      target: [],
      criterion: [],
      proof: '',
      FPositive: 'true',
      alertError: false,
    }),
    computed: mapGetters(['sentIncidents', 'targetsIncidentsSent', 'criteria', 'workers']),
    methods: {
      ...mapActions(['retrieveSentIncidents', 'retrieveCriteria', 'retrieveWorkers']),
      deleteIncident(incident){
        this.$store.dispatch('deleteIncident', incident)
          .then(() => {
          })
          .catch(error => {
            console.log(error);
          })
      },
      updateIncident(incident){
        this.dialog = true;
        this.description = incident.attributes.description;
        this.proof = incident.attributes.proof;
        if (incident.attributes.FPositive){
          this.FPositive = 'true'
        } else {
          this.FPositive = 'false'
        }
        this.target = this.targetsIncidentsSent.find(target => target.id === incident.relationships.target.data.id)
        this.criterion = this.criteria.find(criterion => criterion.id === incident.relationships.criterion.data.id)
        this.idIncident = incident.id;
        this._idIncident = incident.attributes._id;
      },
      saveIncident(){
        if (this.$refs.form.validate()){
          this.$store.dispatch('updateIncident',{
            id: this.idIncident,
            _id: this._idIncident,
            description: this.description,
            target: this.target.id,
            proof: this.proof,
            FPositive: (this.FPositive === 'true'),
            criterion: this.criterion.id,
          })
            .then(() => {
              this.alertError = false;
              this.dialog = false;
            })
            .catch(error => {
              this.alertError = true;
              console.log(error);
            })
        }
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