<template>
  <section class="label-preview">
    <div class="label-card" 
    v-for="label in labels" 
    :style="{'background-color': boardLabelsMap[label].color}">
        {{boardLabelsMap[label].txt}}
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      boardLabelsMap: this.$store.getters.labels,
    };
  },
  props: {
    labels: Array
  }
};
</script>

<style>
</style>