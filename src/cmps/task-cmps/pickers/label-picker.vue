<template>
  <section class="label-picker-container">
    <h4 class="label-header">Labels</h4>
    <div class="label-container">
      <label-card
        v-for="label in boardLabels"
        :label="label"
        :key="label.id"
        :isCheck="checkLabel(label)"
        @update-board-label="updateBoardLabels"
        @update-task-label="editTaskLabels"
      />
    </div>

    <button class="close-btn" @click="closePicker">
      <i class="fas fa-times"></i>
    </button>
  </section>
</template>

<script>
import labelCard from "./label-card";
import { eventBus, EV_updateBoardLabels, EV_boardLabelsSaved } from "@/services/eventBus.service";

export default {
  data() {
    return {
      editedTaskLabels: null,
      isOnEditMode: {},
      editedBoardLabels: null
    };
  },
  methods: {
    async editTaskLabels(label) {
      const labelIdx = this.taskLabels.findIndex(tl => tl.id === label.id);
      if (labelIdx !== -1) {
        this.editedTaskLabels.splice(labelIdx, 1);
      } else {
        this.editedTaskLabels.push(label);
      }
      await this.emit("set-labels", this.editedTaskLabels);
      this.editedTaskLabels = JSON.parse(JSON.stringify(this.taskLabels));
    },
    async updateBoardLabels(label) {
      const idx = this.editedBoardLabels.findIndex(l => l.id === label.id)
      if (idx === -1) return
      this.editedBoardLabels.splice(idx, 1, label)
      eventBus.$emit(EV_updateBoardLabels, this.editedBoardLabels);

    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      })
    },
    busEmit(eventName, value) {
      return new Promise((resolve, reject) => {
        eventBus.$emit(eventName, value);
        eventBus.$nextTick(resolve);
      });
    },
    checkLabel(label) {
      const found = this.taskLabels.find(l => l.id === label.id);
      return !!found;
    },
    closePicker() {
      this.$emit("close-picker");
    },
    updateCopy(boardLabels) {
      this.editedBoardLabels = JSON.parse(JSON.stringify(boardLabels));
      this.editedTaskLabels = JSON.parse(JSON.stringify(this.taskLabels));
      this.$emit("set-labels", this.editedTaskLabels);
    }
  },
  computed: {
    boardLabels() {
      return this.$store.getters.labels
    }
  },
  created() {
    this.editedTaskLabels = JSON.parse(JSON.stringify(this.taskLabels));
    this.editedBoardLabels = JSON.parse(JSON.stringify(this.boardLabels));

    eventBus.$on(EV_boardLabelsSaved, this.updateCopy)
  },
  destroyed() {
    eventBus.$off(EV_boardLabelsSaved, this.updateCopy)
  },
  props: {
    taskLabels: Array
  },
  components: {
    labelCard
  }
};
</script>

<style>
</style>