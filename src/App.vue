<template>
  <v-app>
    <component :is='layout'>
      <router-view/>
    </component>
  </v-app>
</template>

<script>
  import MainLayout from "./layouts/MainLayout";
  import LoginLayout from "./layouts/LoginLayout";

  export default {
    name: 'App',
    components: {
      MainLayout,
      LoginLayout
    },
    // data: () => ({
    //   //
    // }),
    computed: {
      layout() {
        return (this.$route.meta.layout || 'loginLayout')
      }
    }
  };
</script>
