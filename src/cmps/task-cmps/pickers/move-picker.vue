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
      console.log(this.pickedListId);
      
      this.$emit('input', this.pickedListId)
    }
  },
  computed: {
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId)
    }
  },
  props: {
    value: String
  }
};
</script>

<style>
</style>