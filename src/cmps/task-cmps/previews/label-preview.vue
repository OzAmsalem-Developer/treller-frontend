<template>
  <section class="label-preview">
    <div @click.stop="toggleMini" class="label-card" :class="labelClass"
    v-for="label in labels" 
    :style="{'background-color': boardLabelsMap[label].color}">
        {{ labelText(boardLabelsMap[label])}}
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
  methods: {
    toggleMini() {
      this.$store.commit({type: 'toggleMiniLabals'})
    },
    labelText(label) {
      return this.isMini ? '' : label.txt
    }
  },
  computed: {
    isMini() {
      return this.$store.getters.isLabelsMini
    },
    labelClass() {
      return (this.isMini) ? 'mini-label' : ''
    }
  },
  created() {
    console.log('boardLabelsMap', this.boardLabelsMap, 'labels',this.labels);
    console.log(this.$store.getters.currBoard);
    
  },
  props: {
    labels: Array
  }
};
</script>

<style>
</style>