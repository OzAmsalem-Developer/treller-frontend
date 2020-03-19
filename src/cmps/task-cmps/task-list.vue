<template>
  <section v-if="taskList" class="task-list">
    <h1>Task-List</h1>
    <task-preview v-for="task in tasks" :task="task" :key="task.id"></task-preview>
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
      return this.taskList.tasks
    }
  },
  props: {
    taskList: Object
  }
};
</script>