<template>
  <v-container>
    <v-alert v-model="alertSuccess" dense outlined type="success">
      Инцидент добавлен
    </v-alert>
    <v-alert v-model="alertError" dense outlined type="error">
      Не все поля заполнены!
    </v-alert>
    <v-col cols="12" sm="6">
      <v-select :items="users" item-text="attributes.username" v-model="target" return-object label="Сотрудник"></v-select>
    </v-col>
    <v-col cols="12" sm="6">
      <v-select :items="criteria" item-text="attributes.name" v-model="criterion" return-object label="Критерий"></v-select>
    </v-col>
    <v-col cols="12" sm="6">
      <v-text-field v-model="description" placeholder="Описание"></v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      <v-text-field v-model="proof" placeholder="Доказательство"></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <span>Инцидент: </span>
      <v-radio-group v-model="FPositive" :mandatory="false">
        <v-radio label="Позитивный" value="true"></v-radio>
        <v-radio label="Негативный" value="false"></v-radio>
      </v-radio-group>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="addIncident">Добавить</v-btn>
      </v-card-actions>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    name: "Create",
    data: () => ({
      users: [],
      criteria: [],
      description: '',
      target: [],
      criterion: [],
      proof: '',
      FPositive: 'true',
      alertError: false,
      alertSuccess: false
    }),
    methods: {
      addIncident(){
        if ((this.target.length === 0) || (this.criterion.length === 0) || (this.description === '') || (this.proof === '')) {
          this.alertError = true;
        } else {
          this.$store.dispatch('addIncident',{
            description: this.description,
            target: this.target.id,
            proof: this.proof,
            FPositive: (this.FPositive === 'true'),
            criterion: this.criterion.id,
            updateAt: null,
          })
            .then(() => {
              this.alertSuccess = true;
            })
            .catch(error => {
                this.alertError = true;
                console.log(error);
            })
        }

      }
    },
    created() {
      this.$store.dispatch('retrieveUsers')
        .then(response =>{
          this.users = response;
        })
      this.$store.dispatch('retrieveCriteria')
        .then(response =>{
          this.criteria = response;
        })
    }
  }
</script>

<style scoped>

</style>