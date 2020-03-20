<template>
  <section class="label-preview">
    <div class="label-card" 
    v-for="label in labels" :key="label"
    :style="{'background-color': boardLabelsMap[label].color}">
        {{boardLabelsMap[label].txt}}
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      boardLabelsMap: this.$store.getters.labels
    };
  },
  methods: {},
  props: {
    labels: Array
  },
  created() {
      console.log(this.labels);
      
  }
};
</script>

<style>
</style>