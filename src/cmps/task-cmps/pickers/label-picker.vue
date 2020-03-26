<template>
  <section class="label-picker">
    <h4 class="label-header">Labels</h4>
    <div class="label-container">
      <div
        class="label"
        v-for="(label, key) in boardLabels"
        :key="label.id" 
      >
        <div class="label-card" 
        :style="{'background-color': label.color}"
        @click.stop="editLabels(key)"
        >
          <span v-if="isOnEditMode[key]" class="label-input">
            <input type="text">
          </span>
          <div class="default-card" v-else>
          <span class="label-txt">{{label.txt}}</span>
          <span class="label-status" v-if="checkLabel(key)">
            <i class="fas fa-check"></i>
          </span>

          </div>
        </div>

        <button v-if="isOnEditMode[key]" class="label-save-btn" @click.stop="saveLabel(key)">
          Save
        </button>
        <button v-else class="label-edit-btn" @click.stop="isOnEditMode[key]=true">
          <i class="fas fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <button class="close-btn" @click="closePicker">
      <i class="fas fa-times"></i>  
    </button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      editedLabels: null,
      isOnEditMode: {}
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
    },
    closePicker() {
      this.$emit("close-picker");
    },
    saveLabel(key){
      this.isOnEditMode[key] = false
    },
    setEditMode(labelKeys){
      for (let i=0 ; i<labelKeys.length; i++){
        this.isOnEditMode[labelKeys[i]] = false
      }
    }
  },
  created() {
    this.editedLabels = JSON.parse(JSON.stringify(this.taskLabels));
    const labelKeys = Object.keys(this.boardLabels)
    this.setEditMode(labelKeys)
    
  },
  props: {
    boardLabels: Object,
    taskLabels: Array
  }
};
</script>

<style>
</style>