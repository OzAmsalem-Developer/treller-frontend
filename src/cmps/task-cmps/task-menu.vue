<template>
  <section class="task-menu">
    <div class="card-container">
      <div class="card-details">
        <label-preview :labels="taskCopy.labels" />
        <textarea class="task-name" type="text" v-model="taskCopy.name"></textarea>
        <data-indication-preview :task="task" />
      </div>
      <button class="save-name-btn" @click.stop="setName">Save</button>
    </div>
    <menu class="editor-buttons">
      <button class="menu-btn" @click.stop="isMenuOpen.label = !isMenuOpen.label">
        <i class="fas fa-tag"></i>
        <span class="menu-btn-txt">Labels</span> 
      </button>
      <button class="menu-btn" @click.stop="isMenuOpen.move = !isMenuOpen.move">
        <i class="fas fa-long-arrow-alt-right"></i>
        <span class="menu-btn-txt">Move</span>
        </button>
      <button class="menu-btn" @click.stop="isMenuOpen.move = !isMenuOpen.move">
        <i class="far fa-clock"></i>
        <span class="menu-btn-txt">Change Due Date</span>
        </button>

      <button class="menu-btn" @click.stop="$emit('remove-task')">
        <i class="far fa-trash-alt"></i>
        <span class="menu-btn-txt">Remove</span> 
      </button>
    </menu>

    <move-picker
      class="move-picker"
      v-if="isMenuOpen.move"
      :optionalLists="optionalLists"
      v-model="moveToList"
      @input="moveTask"
    />
    <labelPicker
      class="label-picker"
      v-if="isMenuOpen.label"
      :boardLabels="boardLabels"
      :taskLabels="task.labels"
      @set-labels="setLabels"
    />
  </section>
</template>

<script>
import movePicker from "./pickers/move-picker.vue";
import labelPicker from "./pickers/label-picker.vue";
import dataIndicationPreview from "./previews/data-indication-preview.vue";
import labelPreview from "./previews/label-preview.vue";

import { eventBus, EV_moveTask } from "@/services/eventBus.service";

export default {
  data() {
    return {
      isMenuOpen: {
        move: false,
        label: false
      },
      moveToList: null,
      taskCopy: null
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
      this.taskCopy.labels = taskLabels;
      this.$emit("set-labels", this.taskCopy);
    },
    setName() {
      this.$emit("set-name", this.taskCopy);
    }
    // toggleMenu(){
    //   this.$emit('toggle-menu')
    // },
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
  created() {
    this.taskCopy = JSON.parse(JSON.stringify(this.task));
  },
  components: {
    movePicker,
    labelPicker,
    dataIndicationPreview,
    labelPreview
  },
  props: {
    task: Object,
    listId: String
  }
};
</script>

<style>
</style>