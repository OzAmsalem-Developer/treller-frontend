<template>
  <section class="move-picker">
    <button @click="$emit('close-picker')" class="close">
      <i class="fas fa-times"></i>
    </button>
    <form @submit.prevent="emitListId">
      <span class="title">Move Task</span>
      <span class="dest">Select destination</span>

      <select v-model="pickedListId" placeholder="Select list">
        <option v-for="list in optionalLists" :key="list.id" :value="list.id">{{list.name}}</option>
      </select>
      <br />
      <button>Move</button>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      pickedListId: this.value
    };
  },
  methods: {
    emitListId() {
      if (!this.pickedListId) return;
      console.log('Move-Picker emit list id:', this.pickedListId)
      this.$emit("input", this.pickedListId);
    },
    moveTask() {
      this.$emit('move-task')
    }
  },
  props: {
    value: String,
    optionalLists: Array
  }
};
</script>