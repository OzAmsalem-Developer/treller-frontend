<template>
  <section v-if="tasks" class="task-list">
    <h1>Task-List</h1>
    <task-preview v-for="task in tasks" :task="task" :key="task._id"></task-preview>
  </section>
</template>

<script>
import taskPreview from "./task-preview.vue";
export default {
  components: {
    taskPreview
  }
};
</script>