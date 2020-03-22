<template>
  <section
    v-if="taskList"
    class="task-list"
    @dragover.prevent="onDragOver"
    @drop="$emit('list-dropped', listIdx)"
  >
    <header
      ref="listHeader"
      :draggable="!isEditName"
      @dragstart="startDrag"
    >
      <input
        v-if="isEditName"
        @mouseup="focus"
        @change="saveListName"
        @blur="isEditName = false"
        class="list-input"
        type="text"
        v-model="listCopy.name"
        ref="listNameInput"
      />
      <h5 class="list-name" v-else @click="editListName">{{taskList.name}}</h5>
      <button @click="isMenuOpen = !isMenuOpen" class="menu-btn">...</button>
      <list-menu
        @add-task="getEmptyTask(); isMenuOpen = false"
        @list-moved="moveList"
        :listId="taskList.id"
        v-if="isMenuOpen"
      />
    </header>
    <main class="tasks" ref="tasks">
      <task-preview
        v-for="task in tasks"
        :task="task"
        :listId="taskList.id"
        :key="task.id"
        @remove-task="removeTask"
        @update-task="saveTask"
      />
    </main>
    <button v-if="!newTask" @click="getEmptyTask" class="add-task-btn">+ Add Task</button>
    <form class="add-task" @submit.prevent="addTask" @keydown.enter.prevent v-else>
      <textarea
        ref="taskInput"
        @keyup.enter.prevent="addTask"
        v-model="newTask.name"
        cols="30"
        rows="2"
        placeholder="Task name"
      ></textarea>
      <button>Add</button>
      <button @click.prevent="newTask = null">X</button>
    </form>
  </section>
</template>

<script>
import taskPreview from "@/cmps/task-cmps/task-preview.vue";
import { boardService } from "@/services/board.service";
import listMenu from "@/cmps/list-cmps/list-menu";

export default {
  data() {
    return {
      newTask: null,
      isMenuOpen: false,
      listCopy: null,
      isEditName: false,
    };
  },
  methods: {
    getEmptyTask() {
      this.newTask = boardService.getEmptyTask();
      setTimeout(() => {
        this.$refs.taskInput.focus();
      }, 2);
    },
    editListName() {
      this.isEditName = true;
      setTimeout(() => {
        this.$refs.listNameInput.focus();
      }, 0);
    },
    addTask(ev) {
      // allow break line on shift+enter
      if (ev.shiftKey) {
        this.newTask.name += "\n";
        return;
      }

      if (!this.newTask.name.length) {
        this.newTask = null; // (Close add-task)
        return;
      }
      this.listCopy.tasks.push(this.newTask);
      this.saveList();
      this.newTask = null;
      this.getEmptyTask();
      setTimeout(() => {
        this.$refs.tasks.scrollTo(0, this.$refs.tasks.scrollHeight);
      }, 2);
      this.$refs.taskInput.focus();
    },
    async saveList() {
      await this.emit("save-list", this.listCopy);
      try {
        this.listCopy = JSON.parse(JSON.stringify(this.taskList));
      } catch {
        this.listCopy = JSON.parse(JSON.stringify(this.taskList));
      }
    },
    async saveTask(task) {
      const idx = this.listCopy.tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        this.listCopy.tasks.splice(idx, 1, task);
        this.saveList();
      }
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
    moveList(toIdx) {
      this.$emit("list-moved", { listIdx: this.listIdx, toIdx: toIdx - 1 });
      this.isMenuOpen = false;
    },
    saveListName(ev) {
      this.saveList();
      ev.target.blur();
    },
    startDrag(ev) {
      this.$emit("listdrag-start", this.listIdx);
    },
    onDragOver(ev) {},
    focus(ev) {
      ev.target.focus();
    },
    removeTask(taskId) {
      const idx = this.listCopy.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) this.listCopy.tasks.splice(idx, 1);
      this.saveList();
    }
  },
  created() {
    this.listCopy = JSON.parse(JSON.stringify(this.taskList));
  },
  computed: {
    tasks() {
      return this.taskList.tasks;
    }
  },
  props: {
    taskList: Object,
    listIdx: Number
  },
  components: {
    taskPreview,
    listMenu
  }
};
</script>