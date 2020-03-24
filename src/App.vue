<template>
  <div id="app">
      <main-header />
    <router-view class="view" />
    <div-screen v-if="isScreenOpen"/>
  </div>
</template>

<script>
import mainHeader from "@/cmps/main-cmps/main-header.vue";
import divScreen from "@/cmps/main-cmps/div-screen.vue";
export default {
  components: {
    mainHeader,
    divScreen
  },
  computed: {
    isScreenOpen() {
      return this.$store.getters.isScreenOpen
    }
  }
};
</script>
