<template>
<section class="label-card-cmp">
  <div class="label-card"  :style="{'background-color': label.color}"  @click.stop="$emit('update-task-label')">
    <span v-if="!isEdit">{{label.txt}}</span>
    <form v-else class="edit-label-name" @submit.prevent="editBoardLabel">
      <input type="text" v-model="editedLabel.txt" placeholder="Label name">
    </form>
    <button @click.stop="isEdit = true" class="label-edit-btn"><i class="fas fa-pencil-alt"></i></button>
  </div>
</section>

</template>

<script>
export default {
  data() {
    return {
      editedLabel: null,
      isEdit: false
    };
  },
  methods: {
    saveLabel() {
      this.$emit("update-label", this.editedLabel);
    },
    editBoardLabel() {
        this.$emit('update-board-label', this.editedLabel);
        this.isEdit = false
    }
  },
  created() {
    this.editedLabel = JSON.parse(JSON.stringify(this.label));
  },
  props: {
    label: Object
  }
};
</script>

<style>
</style>