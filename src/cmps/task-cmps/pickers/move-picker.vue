<template>
  <section class="move-picker">
    <form @submit.prevent="moveTask">
      <p>List</p>
      <select v-model="pickedListId">
        <option v-for="list in optionalLists" :key="list.id" :value="list.id"
        >{{list.name}}</option>
      </select>
      <button>Save</button>
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
    moveTask() {
      if (!this.pickedListId) return
      this.$emit('input', this.pickedListId)
    }
  },
  props: {
    value: String,
    optionalLists: Array
  }
};
</script>

<style>
</style>