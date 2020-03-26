<template>
  <div class="preview-data" v-if="isDataIndication">
    <section class="preview-indications">
      <due-date-preview class="preview-due-date" v-if="task.dueDate.time" :dueDate="task.dueDate" />
      <div class="preview-desc" v-if="task.desc">
        <i class="fas fa-align-left"></i>
      </div>
      <div class="preview-comments" v-if="task.comments.length">
        <i class="far fa-comment"></i>
        {{task.comments.length}}
      </div>
      <div class="preview-check-list" v-if="task.checklist">
        <i class="far fa-check-square"></i>
        <span class="check-list-txt">{{checklistStatus}}</span>
      </div>
      <div
        class="preview-attachments"
        v-if="task.attachments.length"
      >
      <i class="fas fa-paperclip"></i>
      {{task.attachments.length}}
      </div>
    </section>

    <section class="preview-members" v-if="task.members.length">
      <member-preview :members="task.members" />
    </section>
  </div>
</template>

<script>
import memberPreview from "../previews/member-preview.vue";
import dueDatePreview from "../previews/due-date-preview.vue";

export default {
  computed: {
    checklistStatus() {
      const todos = this.task.checklist.todos;
      const doneTodos = todos.filter(todo => todo.isDone).length;
      const allTodos = todos.length;
      return doneTodos + "/" + allTodos;
    },
    isDataIndication() {
      const task = this.task;
      return (
        task.dueDate.time ||
        task.desc ||
        task.comments.length ||
        task.attachments.length ||
        task.checklist ||
        task.members.length
      );
    }
  },
  components: {
    memberPreview,
    dueDatePreview
  },
  props: {
    task: Object
  }
};
</script>

<style>
</style>