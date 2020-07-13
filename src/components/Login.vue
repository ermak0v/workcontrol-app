<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Авторизоваться</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-alert v-model="alertError" dense outlined type="error">
        Неверная почта или пароль
      </v-alert>
      <v-form>
        <v-text-field
            v-model="email"
            label="Почта"
            prepend-icon="mdi-account"
            type="text"
        ></v-text-field>
        <v-text-field
            v-model="password"
            label="Пароль"
            prepend-icon="mdi-lock"
            type="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login">Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "Login",

    data: () => ({
      email: "",
      password: "",
      alertError: false,
    }),

    methods: {
      login() {
        this.$store.dispatch('retrieveToken', {
          email: this.email,
          password: this.password
        })
          .then(() => {
            this.alertError = false;
            this.$router.push('/');
          })
          .catch(error => {
            this.alertError = true;
            console.log(error);
          })
      }
    }
  }
</script>

<style scoped>

</style>