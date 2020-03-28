<template>
  <section class="move-picker">
    <button @click="$emit('close-picker')" class="close">
      <i class="fas fa-times"></i>
    </button>
    <form @submit.prevent="emitListId">
      <span class="title">Move Task</span>
      <span class="dest">Select destination</span>

      <v-select 
      class="move-selector"
      :options="optionalLists" label="name" 
      @input="setSelected" 
      placeholder="Select List"
      />
      <!-- <select v-model="pickedListId" placeholder="Select list">
        <option v-for="list in optionalLists" :key="list.id" :value="list.id">{{list.name}}</option>
      </select> -->
      <br />
      <button class="move-task-btn">Move</button>
    </form>
  </section>
</template>

<script>
import vSelect from 'vue-select'

export default {
  data() {
    return {
      pickedListId: this.value
    };
  },
  methods: {
    emitListId() {
      if (!this.pickedListId) return;
      this.$emit("input", this.pickedListId);
    },
    moveTask() {
      this.$emit('move-task')
    },
    setSelected(selectedList) {
      this.pickedListId = (selectedList)? selectedList.id : null  
    }
  },
  components: {
    vSelect
  },
  props: {
    value: String,
    optionalLists: Array
  }
};
</script>