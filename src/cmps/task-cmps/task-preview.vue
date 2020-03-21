<template>
  <section class="task-preview" @click="taskDetailsPage">
      <button class="preview-menu-btn" @click="toggleMenu">🖊️</button>
      <task-menu v-if="isMenuOpen" @click.native="toggleMenu"/>
      <label-preview :labels="task.labels" />
      <p class="preview-title">{{task.name}}</p>
      <section class="preview-indications">
        <div
          class="preview-due-date"
          v-if="task.dueDate"
          :style="{'background-color': this.dueDateColor}"
        >🕖{{task.dueDate | minimalDate}}</div>
        <div class="preview-desc" v-if="task.desc">📄</div>
        <div class="preview-comments" v-if="task.comments.length">💬{{task.comments.length}}</div>
        <div class="preview-check-list" v-if="task.checklist">🗹{{checklistStatus}}</div>
        <div
          class="preview-attachments"
          v-if="task.attachments.length"
        >Attachments({{task.attachments.length}})</div>
      </section>
      <div class="preview-members" v-if="task.members.length">
        <member-preview :members="task.members" />
      </div>
  </section>
</template>

<script>
import { utilService } from "../../services/util.service.js";
import labelPreview from "./previews/label-preview.vue";
import memberPreview from "./previews/member-preview.vue";
import taskMenu from "./task-menu.vue"

export default {
  data() {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    checklistStatus() {
      const todos = this.task.checklist.todos;
      const doneTodos = todos.filter(todo => todo.isDone).length;
      const allTodos = todos.length;
      return doneTodos + "/" + allTodos;
    },
    dueDateColor() {
      const dueDate = this.task.dueDate;
      const hourfLeft = utilService.getHoursDifference(dueDate);
      const color =
        hourfLeft < 0
          ? "red"
          : hourfLeft < 5
          ? "orange"
          : hourfLeft < 48
          ? "yellow"
          : "none";
      return color;
    },
    taskDetails() {
      const boardId = this.$store.getters.currBoardId;
      const taskId = this.task.id;
      return `/board/${boardId}/task/${taskId}`;
    }
  },
  methods: {
    toggleMenu(ev) {
      ev.stopPropagation()
      this.isMenuOpen = !this.isMenuOpen 
    },
    taskDetailsPage() {
      this.$router.push(this.taskDetails)
    }
  },
  components: {
    labelPreview,
    memberPreview,
    taskMenu
  },
  props: {
    task: Object
  }
};
</script>