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
      <v-select
          v-model="target"
          :items="workers"
          item-text="attributes.username"
          label="Сотрудник"
          :rules="[target.length !== 0 || 'Выберите сотрудника']"
          return-object
      ></v-select>
      <v-select
          v-model="criterion"
          :items="criteria"
          item-text="attributes.name"
          label="Критерий"
          :rules="[criterion.length !== 0 || 'Выберите критерий']"
          return-object
      ></v-select>
      <v-text-field
          v-model="description"
          placeholder="Описание"
          :rules="[v => !!v || 'Напишите описание']"
      ></v-text-field>
      <v-text-field
          v-model="proof"
          placeholder="Доказательство"
          :rules="[v => !!v || 'Напишите доказательство']"
      ></v-text-field>
      <span>Инцидент: </span>
      <v-radio-group v-model="FPositive" :mandatory="false">
        <v-radio label="Позитивный" value="true"></v-radio>
        <v-radio label="Негативный" value="false"></v-radio>
      </v-radio-group>
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
      valid: true,
      description: '',
      target: [],
      criterion: [],
      proof: '',
      FPositive: 'true',
      alertError: false,
      alertSuccess: false
    }),
    computed:mapGetters(['criteria', 'workers']),
    methods: {
      ...mapActions(['retrieveCriteria', 'retrieveWorkers']),
      addIncident(){
        if (this.$refs.form.validate()){
          this.$store.dispatch('addIncident',{
            description: this.description,
            target: this.target.id,
            proof: this.proof,
            FPositive: (this.FPositive === 'true'),
            criterion: this.criterion.id,
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
      this.retrieveWorkers();
      this.retrieveCriteria();
    }
  }
</script>

<style scoped>

</style>