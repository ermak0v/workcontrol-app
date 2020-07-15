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
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
      >
        <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Почта"
            prepend-icon="mdi-account"
            type="text"
        ></v-text-field>
        <v-text-field
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
          color="primary"
          @click="login"
          :disabled="!valid"
      >Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    name: "Login",
    data: () => ({
      valid: true,
      email: "",
      emailRules: [
        v => !!v || 'Введите почту',
        v => /.+@.+\..+/.test(v) || 'Почта должна быть действительная',
      ],
      password: "",
      alertError: false,
    }),
    methods: {
      ...mapActions(['retrieveToken']),

      login() {
        if (this.$refs.form.validate()){
          this.retrieveToken({
            email: this.email,
            password: this.password
          })
            .then(() => {
              this.alertError = false;
              this.$router.push('/');
            })
            .catch(() => {
              this.alertError = true;
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>