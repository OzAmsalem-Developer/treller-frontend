<template>
  <section v-if="taskList" class="task-list">
    <header>
      <h4 class="list-name">{{taskList.name}}</h4>
      <button class="menu-btn">...</button>
    </header>
    <main class="tasks">
      <task-preview v-for="task in tasks" :task="task" :key="task.id"></task-preview>
    </main>
  </section>
</template>

<script>
import taskPreview from "./task-preview.vue";

export default {
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