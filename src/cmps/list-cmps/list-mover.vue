<template>
  <section class="list-mover">
    <form @submit.prevent="moveList">
      <select v-model="moveTo">
        <option v-for="listIdx in options" :key="listIdx" :value="listIdx"
        >Position {{listIdx}}</option>
      </select>
      <button>Save</button>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      moveTo: this.value
    };
  },
  methods: {
    moveList() {
      if (!this.moveTo) return
      this.$emit('input', this.moveTo)
    }
  },
  props: {
    value: Number,
    options: Array
  }
};
</script>

<style>
</style>