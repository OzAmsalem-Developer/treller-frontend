<template>
  <div id="app">
      <main-header />
    <router-view class="view" />
  </div>
</template>

<script>
import mainHeader from "@/cmps/main-cmps/main-header.vue";
export default {
  components: {
    mainHeader
  }
};
</script>
