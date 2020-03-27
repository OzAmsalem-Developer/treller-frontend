<template>
<section class="label-card-cmp">
  <div class="label-card"  :style="{'background-color': label.color}"  @click.stop="toggleTaskLabel">
    <span v-if="!isEdit">{{label.txt}}</span>
    <form v-else class="edit-label-name" @submit.prevent="editBoardLabel">
      <input type="text" v-model="editedLabel.txt" placeholder="Label name">
    </form>
    <span v-if="isCheck" class="check-icon"><i class="fas fa-check"></i></span>
  </div>
    <button @click.stop="isEdit = !isEdit" class="label-edit-btn"><i class="fas fa-pencil-alt"></i></button>
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
    editBoardLabel() {
        this.$emit('update-board-label', this.editedLabel);
        this.isEdit = false
    },
    toggleTaskLabel() {
      if (this.isEdit) return
      this.$emit('update-task-label', this.label)
    }
  },
  created() {
    this.editedLabel = JSON.parse(JSON.stringify(this.label));
    console.log(this.isCheck);
    
  },
  props: {
    label: Object,
    isCheck: Boolean
  }
};
</script>

<style>
</style>