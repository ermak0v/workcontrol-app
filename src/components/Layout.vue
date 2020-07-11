<template>
  <v-app id="sandbox">
    <v-navigation-drawer
        v-model="barModel"
        :clipped=true
        app
        overflow
    >
      <Logout/>
    </v-navigation-drawer>
    <v-app-bar
        :clipped-left=true
        app
    >
      <v-app-bar-nav-icon
          @click.stop="barModel = !barModel"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>WorkControl</v-toolbar-title>
    </v-app-bar>
    <v-main>

    </v-main>
    <v-footer  app>
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import Logout from "./Logout";

  export default {
    components:{
      Logout
    },
    data: () => ({
      barModel: null,
    }),
  }
</script>
