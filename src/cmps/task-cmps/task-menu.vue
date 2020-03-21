<template>
  <transition name="fade">
    <menu class="task-menu">
      <button class="move-btn" @click.stop="isMenuOpen.move = !isMenuOpen.move">Move</button>
      <move-picker
        class="move-picker"
        v-if="isMenuOpen.move"
        :optionalLists="optionalLists"
        v-model="moveToList"
        @click.native.stop
        @input="moveTask"
      />
      <button class="label-btn" @click.stop="isMenuOpen.label = !isMenuOpen.label">Labels</button>
      <labelPicker
        class="label-picker"
        v-if="isMenuOpen.label"
        :boardLabels="boardLabels"
        :taskLabels="this.task.labels"
        @click.native.stop
        @set-labels="setLabels"
      />
      <button class="remove-btn" @click.stop="$emit('remove-task')">Remove</button>
    </menu>
  </transition>
</template>

<script>
import movePicker from "./pickers/move-picker.vue";
import labelPicker from "./pickers/label-picker.vue";
import {
  eventBus,
  EV_moveTask,
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      isMenuOpen: {
        move: false,
        label: false
      },
      moveToList: null,
    };
  },
  methods: {
    moveTask() {
      eventBus.$emit(EV_moveTask, {
        from: this.listId,
        to: this.moveToList,
        taskId: this.task.id
      });
    },
    setLabels(taskLabels) {
      this.$emit('set-labels', taskLabels);
    }
  },
  computed: {
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId);
    },
    boardLabels() {
      return this.$store.getters.labels;
    }
  },
  components: {
    movePicker,
    labelPicker
  },
  props: {
    task: Object,
    listId: String
  }
};
</script>

<style>
</style>