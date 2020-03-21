<template>
  <transition name="fade">
    <section class="task-menu">
      <button class="move-btn" @click.stop="isOpenMap.move = !isOpenMap.move">Move</button>
      <move-picker class="move-picker" 
      v-if="isOpenMap.move" :taskId="taskId" :listId="listId"
      @click.native="stopPropagation"
      />
    </section>
  </transition>
</template>

<script>
import movePicker from "./pickers/move-picker.vue"
export default {
  data() {
    return {
      isOpenMap: {
        move: false,
        label: false
      }
    };
  },
  components: {
      movePicker
  },
  methods: {
      stopPropagation(ev){
          ev.stopPropagation()
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