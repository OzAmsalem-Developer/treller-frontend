<template>
<section>
    <div class="div-screen" @click.stop="$emit('clicked', taskCopy)"></div>

  <section v-if="task" class="task-menu" ref="taskMenu">
    <div class="card-container">
      <div class="card-details">
        <label-preview :labels="taskCopy.labels" />
        <textarea class="task-name" type="text" v-model="taskCopy.name" ref="editTaskName"></textarea>
        <data-indication-preview :task="task" />
      </div>
    </div>
    <menu class="editor-buttons">
      <button class="task-menu-item" @click.stop="isMenuOpen.label = !isMenuOpen.label">
        <i class="fas fa-tag"></i>
        <span class="menu-btn-txt">Labels</span>
      </button>
      <button class="task-menu-item" @click.stop="isMenuOpen.move = !isMenuOpen.move">
        <i class="fas fa-long-arrow-alt-right"></i>
        <span class="menu-btn-txt">Move</span>
      </button>
      <button class="task-menu-item" @click.stop="openDueDate">
        <i class="far fa-clock"></i>
        <span class="menu-btn-txt">Change Due Date</span>
      </button>

      <button class="task-menu-item" @click.stop="$emit('remove-task')">
        <i class="far fa-trash-alt"></i>
        <span class="menu-btn-txt">Remove</span>
      </button>
    </menu>

    <button class="save-name-btn" @click.stop="setName(); $emit('clicked', taskCopy)">Save</button>

    <labelPicker
      class="label-picker"
      v-if="isMenuOpen.label"
      :boardLabels="boardLabels"
      :taskLabels="task.labels"
      @set-labels="setLabels"
      @close-picker="isMenuOpen.label = false"
    />
    <move-picker
      class="move-picker"
      v-if="isMenuOpen.move"
      :optionalLists="optionalLists"
      v-model="moveToList"
      @close-picker="isMenuOpen.move = false"
      @input="moveTask"
    />
    <div class="block">
      <el-date-picker
        v-show="isMenuOpen.dueDate"
        v-model="taskCopy.dueDate.time"
        @change="setDueDate"
        type="datetime"
        format="MMM dd hh:mm A"
        value-format="timestamp"
        placeholder="Select date and time"
        class="el-date-picker"
        size="mini"
        ref="calendar"
      >
      </el-date-picker>
    </div>
  </section>
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
        label: false,
        dueDate: false
      },
      moveToList: null,
      taskCopy: null
    };
  },
  methods: {
    moveTask() {
      eventBus.$emit(EV_moveTask, {
        toListId: this.moveToList,
        taskId: this.task.id
      });
    },
    setLabels(taskLabels) {
      this.taskCopy.labels = taskLabels;
      this.$emit("set-labels", this.taskCopy);
    },
    setName() {
      this.$emit("set-name", this.taskCopy);
    },
    setDueDate() {
      this.$emit("set-due-date", this.taskCopy);
    },
    openDueDate(){
      this.isMenuOpen.dueDate = !this.isMenuOpen.dueDate
      setTimeout(() => {
        this.$refs.calendar.focus()
      }, 0) 
    }
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
  mounted() {
    this.$refs.taskMenu.style.top =
      this.menu.getBoundingClientRect().y - this.scrollTop / 3 + "px";
    this.$refs.taskMenu.style.left =
      this.menu.getBoundingClientRect().x - 210 + "px";
    this.$refs.editTaskName.select();
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
    scrollTop: Number,
    menu: HTMLButtonElement
  }
};
</script>

<style>
</style>