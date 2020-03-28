<template>
  <section class="move-picker">
    <form @submit.prevent="emitListId">
      <span class="title">Move Task</span>
      <span class="dest">Select destination</span>
      <v-select 
      class="move-selector"
      :options="optionalLists" label="name" 
      @input="setSelected" 
      placeholder="Select List"
      />
      <br/>
      <button class="move-task-btn">Move</button>
    </form>
    <button @click="$emit('close-picker')" class="close">
      <i class="fas fa-times"></i>
    </button>
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