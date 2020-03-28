<template>
  <section class="list-mover">
    <form @submit.prevent="moveList">
      <div class="list-mover-header">
        <span class="title">Move List</span>
        <button @click="$emit('close-picker')" class="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <span class="dest">Select destination</span>
      <v-select
        class="move-list-selector"
        :options="options"
        @input="setSelected"
        placeholder="Select Destination"
      />
      <button class="move-list-btn">Save</button>
    </form>
  </section>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      moveTo: this.value
    };
  },
  methods: {
    moveList() {
      if (!this.moveTo) return;
      this.$emit("input", this.moveTo);
    },
    setSelected(listIdx) {
      this.moveTo = listIdx;
    }
  },
  components: {
    vSelect
  },
  props: {
    value: Number,
    options: Array
  }
};
</script>

<style>
</style>