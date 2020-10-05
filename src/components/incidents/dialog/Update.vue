<template>
  <v-dialog v-model="dialog" persistent width="800px">
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
            <v-autocomplete
                v-model="target"
                :items="workers"
                item-text="attributes.username"
                label="Сотрудник"
                :rules="[target.length !== 0 || 'Выберите сотрудника']"
                return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
                v-model="criterion"
                :items="criteria"
                item-text="attributes.name"
                label="Критерий"
                :rules="[criterion.length !== 0 || 'Выберите критерий']"
                return-object
            ></v-autocomplete>
            <v-slide-group show-arrows>
              <v-slide-item
                  v-for="item in criteria"
                  :key="item.id"
              >
                <v-btn
                    class="mx-2"
                    small
                    @click="slideCriteria(item)"
                >
                  {{item.attributes.smallName}}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
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
                :rules="urlRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <span>Инцидент: </span>
            <v-radio-group v-model="FPositive" :mandatory="false">
              <v-radio label="Позитивный" value="true"></v-radio>
              <v-radio label="Негативный" value="false"></v-radio>
            </v-radio-group>
            <v-checkbox v-model="FEpic" label="Важно"></v-checkbox>
          </v-col>
          </v-row>
        </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            text
            color="primary"
            @click="cancelDialog"
        >Отмена</v-btn>
        <v-btn
            text
            @click="saveDialog"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Update",
    props: [
      'dialog'
    ],
    data: () =>({
      urlRules: [
        v => !!v || 'Дайте ссылку на доказательство',
        v => /^(https?:\/\/).[a-z0-9~_\-.]+\.[a-z]{1,9}(\/|:|\?[!-~]*)?.+/.test(v) || 'Ссылка должна быть действительная',
      ],
      idIncident: '',
      _idIncident: '',
      description: '',
      target: [],
      criterion: [],
      proof: '',
      FPositive: 'true',
      alertError: false,
      FEpic: false,
    }),
    computed: mapGetters(['allUsers', 'criteria', 'workers']),
    methods: {
      ...mapActions(['retrieveAllUsers']),
      slideCriteria(item){
        this.criterion = item
      },
      cancelDialog() {
        this.$emit("closeDialog")
      },
      saveDialog() {
        if (this.$refs.form.validate()){
          let FModer;
          if ((this.roleCurrentUser === 'ROLE_ADMIN') || (this.target.relationships.department.data.id === '/api/departments/' + this.departmentCurrentUser && this.roleCurrentUser === 'ROLE_HEAD')){
            FModer = true;
          }
          this.$store.dispatch('updateIncident',{
            id: this.idIncident,
            _id: this._idIncident,
            description: this.description,
            target: this.target.id,
            proof: this.proof,
            FPositive: (this.FPositive === 'true'),
            criterion: this.criterion.id,
            FEpic: this.FEpic,
            FModer: FModer,
          })
            .then(() => {
              this.alertError = false;
              this.$emit("closeDialog")
            })
            .catch(error => {
              this.alertError = true;
              console.log(error);
            })
        }
      },
      createDialog(incident) {
        this.description = incident.attributes.description;
        this.proof = incident.attributes.proof;
        if (incident.attributes.FPositive){
          this.FPositive = 'true'
        } else {
          this.FPositive = 'false'
        }
        this.FEpic = incident.attributes.FEpic
        this.target = this.allUsers.find(target => target.id === incident.relationships.target.data.id)
        this.criterion = this.criteria.find(criterion => criterion.id === incident.relationships.criterion.data.id)
        this.idIncident = incident.id;
        this._idIncident = incident.attributes._id;
      }
    },
  }
</script>

<style scoped>

</style>