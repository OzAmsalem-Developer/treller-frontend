<template>
  <section v-if="taskList" class="task-list">
    <header>
      <input @change="saveListName" class="list-name" type="text" v-model="listCopy.name" />
      <button @click="isMenuOpen = !isMenuOpen" class="menu-btn">...</button>
      <list-menu
        @add-task="getEmptyTask(); isMenuOpen = false"
        :listId="taskList.id"
        v-if="isMenuOpen"
      />
    </header>
    <main class="tasks" ref="tasks">
      <task-preview v-for="task in tasks" :task="task" :key="task.id"></task-preview>
    </main>
    <button v-if="!newTask" @click="getEmptyTask" class="add-task">+ Add Task</button>
    <form class="add-task" @submit.prevent="addTask" v-else>
      <textarea
        ref="taskInput"
        @keyup.enter="addTask"
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
import taskPreview from "./task-preview.vue";
import { boardService } from "@/services/board.service";
import listMenu from "@/cmps/list-cmps/list-menu";
import { eventBus, EV_saveFailed } from "@/services/eventBus.service";

export default {
  data() {
    return {
      newTask: null,
      isMenuOpen: false,
      listCopy: null
    };
  },
  methods: {
    getEmptyTask() {
      this.newTask = boardService.getEmptyTask();
      setTimeout(() => {
        this.$refs.taskInput.focus();
      }, 2);
    },
    addTask() {
      this.listCopy.tasks.push(this.newTask);
      this.saveList()
      this.newTask = null;
      this.getEmptyTask();
      setTimeout(() => {
        this.$refs.tasks.scrollTo(0, this.$refs.tasks.scrollHeight);
        this.$refs.tasks.scrollIntoView({ block: "start" });
      }, 2);
      this.$refs.taskInput.focus();
    },
    saveList() {
      this.$emit("save-list", this.listCopy);
    },
    saveListName(ev) {
      this.saveList()
      ev.target.blur()
    }
  },
  created() {
    this.listCopy = JSON.parse(JSON.stringify(this.taskList));
    eventBus.$on(EV_saveFailed, () => {
      // When save changes is failed, update the copy to the right one
      // (which is my prop that coming from the store)
      this.listCopy = JSON.parse(JSON.stringify(this.taskList));
    });
  },
  components: {
    taskPreview,
    listMenu
  },
  computed: {
    tasks() {
      return this.taskList.tasks;
    }
  },
  props: {
    taskList: Object
  }
};
</script>