<template>
  <section class="label-picker-container">
    <h4 class="label-header">Labels</h4>
    <div class="label-container">
      <label-card
        v-for="(label,key) in boardLabels"
        :label="label"
        :key="label.txt"
        @update-board-label="updateBoardLabels(key, label)"
        @update-task-label="editTaskLabels(key)"
      />
    </div>

    <button class="close-btn" @click="closePicker">
      <i class="fas fa-times"></i>
    </button>
  </section>
</template>

<script>
import labelCard from "./label-card";
import { eventBus, EV_updateBoardLabels } from "@/services/eventBus.service";

export default {
  data() {
    return {
      editedTaskLabels: null,
      isOnEditMode: {},
      editedBoardLabels: null
    };
  },
  methods: {
    async editTaskLabels(boardLabelKey) {
      if (this.isLoad) return;
      const labelIdx = this.taskLabels.findIndex(
        label => label === boardLabelKey
      );
      if (labelIdx !== -1) {
        this.editedTaskLabels.splice(labelIdx, 1);
      } else {
        this.editedTaskLabels.push(boardLabelKey);
      }
      // This await is finish to early if I click super fast. can improve with eventBus.
      await this.emit("set-labels", this.editedTaskLabels);
      this.editedTaskLabels = JSON.parse(JSON.stringify(this.taskLabels));
    },
    updateBoardLabels(key, label) {
      console.log(key, label);
      
      this.editedBoardLabels[key] = label;
      eventBus.$emit(EV_updateBoardLabels, this.editedBoardLabels);
      this.editedBoardLabels = JSON.parse(JSON.stringify(this.boardLabels));
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
    checkLabel(boardLabelKey) {
      const labelIdx = this.taskLabels.findIndex(
        label => label === boardLabelKey
      );
      return labelIdx !== -1;
    },
    closePicker() {
      this.$emit("close-picker");
    },
    updateLabel(key) {
      this.isOnEditMode[key] = false;
    },
    setEditMode(labelKeys) {
      for (let i = 0; i < labelKeys.length; i++) {
        this.isOnEditMode[labelKeys[i]] = false;
      }
    }
  },
  created() {
    this.editedTaskLabels = JSON.parse(JSON.stringify(this.taskLabels));
    this.editedBoardLabels = JSON.parse(JSON.stringify(this.boardLabels));
    const labelKeys = Object.keys(this.boardLabels);
    this.setEditMode(labelKeys);
  },
  props: {
    boardLabels: Object,
    taskLabels: Array
  },
  components: {
    labelCard
  }
};
</script>

<style>
</style>