<template>
  <section class="task-list">
    <h1>Task-List</h1>
    <task-preview></task-preview>
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