<template>
  <section class="move-picker">
    <form>
      <p>List</p>
      <select v-model="pickedListId">
        <option v-for="(list, idx) in taskLists" :key="idx" :value="list.id">{{list.name}}</option>
      </select>
      <button>Save</button>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      pickedListId: null
    };
  },
  computed: {
    taskLists() {
      return this.$store.getters.taskLists;
    }
  },
  // methods: {
  //     moveTask(){

  //     }
  // },
  props: {
    taskId: String,
    listId: String
  }
};
</script>

<style>
</style>