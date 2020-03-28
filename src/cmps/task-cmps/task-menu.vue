<template>
  <section>
    <div class="div-screen" @click.stop="$emit('clicked', taskCopy); updateCopy();"></div>

    <section v-if="task" class="task-menu" ref="taskMenu">
      <div class="card-container">
        <div class="card-details">
          <label-preview :labels="task.labels" />
          <textarea
            @input="expand"
            class="menu-task-name"
            type="text"
            v-model="taskCopy.name"
            ref="editTaskName"
          ></textarea>
          <data-indication-preview :task="task" />
        </div>
        <button class="save-name-btn" @click.stop="setName">Save</button>
      </div>
      <menu class="editor-buttons" :class="btnsClass">
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

        <div ref="pickersContainer" class="pickers-container">
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
        ></el-date-picker>
      </div>
        </div>

      </menu>

    </section>
  </section>
</template>

<script>
import movePicker from "./pickers/move-picker.vue";
import labelPicker from "./pickers/label-picker.vue";
import dataIndicationPreview from "./previews/data-indication-preview.vue";
import labelPreview from "./previews/label-preview.vue";
import { utilService } from "@/services/util.service";

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
    async moveTask() {
      await eventBus.$emit(EV_moveTask, {
        toListId: this.moveToList,
        taskId: this.task.id
      });
      this.updateCopy();
    },
    async setLabels(taskLabels) {
      this.taskCopy.labels = taskLabels;
      await this.emit("set-labels", this.taskCopy);
      this.updateCopy();
    },
    async setName() {
      await this.emit("set-name", this.taskCopy);
      this.updateCopy();
      this.$emit("closed");
    },
    async setDueDate() {
      await this.emit("set-due-date", this.taskCopy);
      this.updateCopy();
    },
    openDueDate() {
      this.isMenuOpen.dueDate = !this.isMenuOpen.dueDate;
      setTimeout(() => {
        this.$refs.calendar.focus();
      }, 0);
    },
    expand() {
      utilService.expandTextArea(this.$refs.editTaskName);
    },
    updateCopy() {
      this.taskCopy = JSON.parse(JSON.stringify(this.task));
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    }
  },
  computed: {
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId);
    },
    boardLabels() {
      return this.$store.getters.labels;
    },
    btnsClass() {
      return (this.menu.getBoundingClientRect().x - 190 > document.body.clientWidth / 2) ?
      'left' : ''
    }
  },
  mounted() {
    this.$refs.taskMenu.style.top = this.menu.getBoundingClientRect().y - 3 + "px";
    let taskWidth = this.isScroll ?  210 : 215
    this.$refs.taskMenu.style.left = this.menu.getBoundingClientRect().x - taskWidth + "px";

    if (this.menu.getBoundingClientRect().y > 400) {
      this.$refs.pickersContainer.style.top = -200 + 'px'
    }
    this.$refs.editTaskName.select();
    this.expand();
  },
  created() {
    this.updateCopy();
  },
  components: {
    movePicker,
    labelPicker,
    dataIndicationPreview,
    labelPreview
  },
  props: {
    task: Object,
    isScroll: Boolean,
    menu: HTMLButtonElement
  }
};
</script>

<style>
</style>