<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Авторизоваться</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-alert
          v-model="alert"
          dismissible
          dense
          outlined
          type="error"
      >
        Неверный логин или пароль
      </v-alert>

      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
      >
        <v-text-field
            v-on:keyup.enter="login"
            v-model="email"
            :rules="emailRules"
            label="Почта"
            prepend-icon="mdi-account"
            type="text"
        ></v-text-field>
        <v-text-field
            v-on:keyup.enter="login"
            v-model="password"
            :rules="[v => !!v || 'Введите пароль']"
            label="Пароль"
            prepend-icon="mdi-lock"
            type="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          width="150"
          color="primary"
          :loading="loading"
          @click="login"
          :disabled="!valid || alert"
      >Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    name: "Login",
    data: () => ({
      alert: false,
      loading: false,
      valid: true,
      email: "",
      emailRules: [
        v => !!v || 'Введите логин',
      ],
      password: "",
    }),
    methods: {
      ...mapActions(['retrieveToken']),

      login() {
        if (this.$refs.form.validate()){
          this.loading = true;
          this.retrieveToken({
            email: this.email,
            password: this.password
          })
            .then(() => {
              this.loading = false;
              this.alert = false;
              this.$router.push({name: 'create-incident'});
            })
            .catch(() => {
              this.alert = true;
              this.loading = false;
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>