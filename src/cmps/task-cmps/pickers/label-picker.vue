<template>
  <section class="label-picker">
    <div
      class="label"
      v-for="label in boardLabels"
      :key="label.id"
      :style="{'background-color': label.color}"
      @click.stop="editLabels(label)"
    >{{label.txt}}</div>
  </section>
</template>

<script>
export default {
data() {
    return {
       editedLabels : this.taskLabels 
    }
},
methods: {
    editLabels(clickedLabel) {
        const labelIdx = this.taskLabels.findIndex(label => label.id === clickedLabel.id)
        if (labelIdx !== -1) {
            this.editedLabels.splice(labelIdx, 1)
        }else {
            this.editedLabels.push(clickedLabel)
        }
        this.$emit('set-labels', this.editedLabels)
    }
},
props: {
    boardLabels: Object,
    taskLabels: Array
}
}
</script>

<style>
</style>