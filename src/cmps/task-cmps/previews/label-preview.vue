<template>
  <section class="label-preview">
    <div @click.stop="toggleMini" class="label-card" :class="labelClass"
    v-for="label in labels" 
    :style="{'background-color': label.color}">
        {{ labelText(label)}}
    </div>
  </section>
</template>

<script>
export default {
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
  props: {
    labels: Array
  }
};
</script>

<style>
</style>