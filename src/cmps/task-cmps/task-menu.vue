<template>
  <transition name="fade">
    <menu class="task-menu">
      <button class="move-btn" @click.stop="isMenuOpen.move = !isMenuOpen.move">Move</button>
      <move-picker
        class="move-picker"
        v-if="isMenuOpen.move"
        v-model="moveToList"
        @click.native.stop=""
        @input="moveTask"
      />
      <button class="remove-btn" @click.stop="$emit('remove-task')">Remove</button>
    </menu>
  </transition>
</template>

<script>
import movePicker from "./pickers/move-picker.vue";
import {eventBus, EV_moveTask} from '@/services/eventBus.service'

export default {
  data() {
    return {
      isMenuOpen: {
        move: false,
        label: false
      },
      moveToList: null
    };
  },
  components: {
    movePicker
  },
  methods: {
    moveTask() {
      eventBus.$emit(EV_moveTask, {
        from: this.listId,
        to: this.moveToList,
        taskId: this.taskId
      })
    }
  },
  computed: {
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId);
    }
  },
  props: {
    taskId: String,
    listId: String
  }
};
</script>

<style>
</style>