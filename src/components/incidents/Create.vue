<template>
  <v-container>
    <v-alert v-model="alertSuccess" dense outlined type="success">
      Инцидент добавлен
    </v-alert>
    <v-alert v-model="alertError" dense outlined type="error">
      Инцидент не добавлен
    </v-alert>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-autocomplete
        v-model="target"
        :items="workers"
        item-text="attributes.username"
        label="Сотрудник"
        :rules="[target.length !== 0 || 'Выберите сотрудника']"
        return-object
      ></v-autocomplete>

      <div v-show="lastTargets">
        Последние сотрудники кому отправляли инциденты:
        <v-slide-group show-arrows>
          <v-slide-item
              v-for="item in lastTargets"
              :key="item.id"
          >
            <v-btn
                class="mx-2"
                small
                @click="slideLastTargets(item)"
            >
              {{item.attributes.username}}
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </div>

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
      <v-text-field
          v-model="description"
          placeholder="Описание"
          :rules="[v => !!v || 'Напишите описание']"
      ></v-text-field>
      <v-text-field
          v-model="proof"
          placeholder="Доказательство"
          :rules="urlRules"
      ></v-text-field>
      <span>Инцидент: </span>
      <v-radio-group v-model="FPositive" :mandatory="false">
        <v-radio label="Позитивный" value="true"></v-radio>
        <v-radio label="Негативный" value="false"></v-radio>
      </v-radio-group>
      <v-checkbox v-model="FEpic" label="Важно"></v-checkbox>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            :disabled="!valid"
            color="primary"
            @click.stop="addIncident"
        >Добавить</v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "Create",
    data: () => ({
      urlRules: [
        v => !!v || 'Дайте ссылку на доказательство',
        v => /^(https?:\/\/).[a-z0-9~_\-.]+\.[a-z]{1,9}(\/|:|\?[!-~]*)?.+/.test(v) || 'Ссылка должна быть действительная',
      ],
      valid: true,
      description: '',
      target: [],
      criterion: {
        id: "/api/criteria/2",
        type: "Criterion",
        attributes: {
          _id: 2,
          name: "Выполнение планов, разовых поручений, соблюдение сроков."
        }
      },
      proof: '',
      FPositive: 'true',
      FEpic: false,
      alertError: false,
      alertSuccess: false
    }),
    computed:mapGetters(['lastTargets', 'criteria', 'workers', 'roleCurrentUser', 'departmentCurrentUser']),
    methods: {
      ...mapActions(['retrieveSentIncidents', 'retrieveCriteria', 'retrieveWorkers']),
      slideLastTargets(item){
        this.target = item
      },
      slideCriteria(item){
        this.criterion = item
      },
      addIncident(){
        if (this.$refs.form.validate()){
          let FModer;
          if ((this.roleCurrentUser === 'ROLE_ADMIN') || (this.target.relationships.department.data.id === '/api/departments/' + this.departmentCurrentUser && this.roleCurrentUser === 'ROLE_HEAD')){
            FModer = true;
          }
          this.$store.dispatch('addIncident',{
            description: this.description,
            target: this.target.id,
            proof: this.proof,
            FPositive: (this.FPositive === 'true'),
            FEpic: this.FEpic,
            criterion: this.criterion.id,
            FModer: FModer,
          })
            .then(() => {
              this.alertError = false;
              this.alertSuccess = true;
            })
            .catch(error => {
              this.alertSuccess = false;
              this.alertError = true;
              console.log(error);
            })
        }
      }
    },
    created() {
      this.retrieveSentIncidents();
      this.retrieveWorkers();
      this.retrieveCriteria();
    }
  }
</script>

<style scoped>

</style>