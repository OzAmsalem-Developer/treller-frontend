<template>
<section class="label-card-cmp">
  <div class="label-card"  :style="{'background-color': label.color}"  @click.stop="toggleTaskLabel">
    <span v-if="!isEdit">{{label.txt}}</span>
    <form v-else class="edit-label-name" @submit.prevent="editBoardLabel">
      <input @blur="blurEditLabel" 
      class="label-name-input" type="text" 
      v-model="editedLabel.txt" ref="editLabelImput"
       placeholder="Label name">
    </form>
    <span v-if="isCheck" class="check-icon"><i class="fas fa-check"></i></span>
  </div>
    <button @click.stop="toggleEdit" class="label-edit-btn"><i class="fas fa-pencil-alt"></i></button>
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
        this.editedLabel = JSON.parse(JSON.stringify(this.label));
    },
    toggleTaskLabel() {
      if (this.isEdit) return
      this.$emit('update-task-label', this.label)
    },
    blurEditLabel() {
      setTimeout(() => {
        this.editedLabel = JSON.parse(JSON.stringify(this.label));
      }, 5)
    },
    toggleEdit() {
      this.isEdit = !this.isEdit
      if (this.isEdit) {
       setTimeout(() => {
        this.$refs.editLabelImput.select()
       }, 5)
      }
    }
  },
  created() {
    this.editedLabel = JSON.parse(JSON.stringify(this.label));
    
  },
  props: {
    label: Object,
    isCheck: Boolean
  }
};
</script>

<style>
</style>