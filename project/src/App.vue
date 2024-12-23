<script setup>
// import { ref } from 'vue';

// const metaInfo = ref({
//   title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
//       titleTemplate: title => {
//         return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
//       }
// })
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>

</style>
