<template>
  <v-dialog v-model="dialog" persistent width="270">
    <v-card>
      <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="cancelDialog">Отмена</v-btn>
        <v-btn text color="error" @click="deleteIncident">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "Delete",
    props: [
      'dialog'
    ],
    data: () =>({
      incident: []
    }),
    methods: {
      createDialog(incident) {
        this.incident = incident
      },
      deleteIncident(){
        this.$store.dispatch('deleteIncident', this.incident)
          .then(() => {
            this.$emit("closeDialog")
          })
          .catch(error => {
            console.log(error);
          })
      },
      cancelDialog() {
        this.$emit("closeDialog")
      },
    }
  }
</script>

<style scoped>

</style>