<template>
  <v-app id="sandbox">
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>WorkControl</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{this.$store.state.nameCurrentUser}}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :clipped=true app overflow>
      <v-list-item @click.stop="listIncidents">
        <v-list-item-action>
          <v-icon>mdi-format-list-bulleted-square</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Список инцидентов</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click.stop="createIncident">
        <v-list-item-action>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Добавить инцидент</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <Logout/>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <v-row align="stretch" justify="center">
          <v-col cols="10">
            <v-card>
              <v-card-text>
                <router-view/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer  app>
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import Logout from "../components/Logout";

  export default {
    name: "MainLayout",
    components:{
      Logout
    },
    data: () => ({
      drawer: null,
    }),
    methods: {
      listIncidents() {
        this.$router.push('/');
      },
      createIncident() {
        this.$router.push('/create-incident');
      }
    }
  }
</script>

<style scoped>

</style>