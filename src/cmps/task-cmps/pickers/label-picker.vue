<template>
  <section class="label-picker">
    <h4 class="label-header">Labels</h4>
    <div class="label-container">
      <div
        class="label"
        v-for="(label, key) in boardLabels"
        :key="label.id"
        @click.stop="editLabels(key)"
      >
        
        <div class="label-card" :style="{'background-color': label.color}" >
          <span class="label-txt">{{label.txt}}</span>
          <span class="label-status" v-if="checkLabel(key)">
            <i class="fas fa-check"></i>
          </span>
        </div>
        <button class="label-edit">
          <i class="fas fa-pencil-alt"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      editedLabels: null
    };
  },
  methods: {
    async editLabels(boardLabelKey) {
      if (this.isLoad) return;
      const labelIdx = this.taskLabels.findIndex(
        label => label === boardLabelKey
      );
      if (labelIdx !== -1) {
        this.editedLabels.splice(labelIdx, 1);
      } else {
        this.editedLabels.push(boardLabelKey);
      }
      // This await is finish to early if I click super fast. can improve with eventBus.
      await this.emit("set-labels", this.editedLabels);
      try {
        this.editedLabels = JSON.parse(JSON.stringify(this.taskLabels));
      } catch {
        this.editedLabels = JSON.parse(JSON.stringify(this.taskLabels));
      }
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
      return labelIdx !== -1 ? true : false;
    }
  },
  created() {
    this.editedLabels = JSON.parse(JSON.stringify(this.taskLabels));
  },
  props: {
    boardLabels: Object,
    taskLabels: Array
  }
};
</script>

<style>
</style>