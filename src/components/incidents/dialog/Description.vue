<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">Описание</v-card-title>
      <v-card-text>
        {{description}}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancelDialog">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "Description",
    props: [
      'dialog'
    ],
    data: () =>({
      description: ''
    }),
    methods:{
      createDialog(incident) {
        this.description = incident.attributes.description;
      },
      cancelDialog() {
        this.$emit("closeDialog")
      },
    }
  }
</script>

<style scoped>

</style>