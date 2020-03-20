<template>
  <section v-if="taskList" class="task-list">
    <header>
      <h4 class="list-name">{{taskList.name}}</h4>
      <button class="menu-btn">...</button>
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

export default {
  data() {
    return {
      newTask: null,
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
      this.$emit("task-added", {
        newTask: this.newTask,
        listId: this.taskList.id
      });
      this.newTask = null;
      this.getEmptyTask();
      setTimeout(() => {
        this.$refs.tasks.scrollTo(0, this.$refs.tasks.scrollHeight);
        this.$refs.tasks.scrollIntoView({ block: "start" });
      }, 2);
      this.$refs.taskInput.focus();
    }
  },
  components: {
    taskPreview
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