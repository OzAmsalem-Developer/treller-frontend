<template>
  <section class="label-picker">
    <div
      class="label"
      v-for="(label, key) in boardLabels"
      :key="label.id"
      :style="{'background-color': label.color}"
      @click.stop="editLabels(key)"
    >
      <span>{{label.txt}}</span>
      <span v-if="checkLabel(key)">✔️</span>
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
      const labelIdx = this.taskLabels.findIndex(
        label => label === boardLabelKey
      );
      if (labelIdx !== -1) {
        this.editedLabels.splice(labelIdx, 1);
      } else {
        this.editedLabels.push(boardLabelKey);
      }
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
      return (labelIdx !== -1)? true : false 
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