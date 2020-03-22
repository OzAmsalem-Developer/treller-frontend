<template>
  <section class="task-preview" @click="taskDetailsPage">
    <button class="preview-menu-btn" @click="toggleMenu">🖊️</button>
    <task-menu
      v-if="isMenuOpen"
      :task="task"
      :listId="listId"
      @click.native="toggleMenu"
      @remove-task="$emit('remove-task', task.id)"
      @set-labels="setTaskLabels"
    />
    <label-preview :labels="taskCopy.labels" />
    <p class="preview-title">{{task.name}}</p>
    <section class="preview-indications">
      <due-date-preview v-if="task.dueDate.time" :dueDate="task.dueDate" />
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
import dueDatePreview from "./previews/due-date-preview.vue";
import taskMenu from "./task-menu.vue";

export default {
  data() {
    return {
      isMenuOpen: false,
      taskCopy: null
    };
  },
  computed: {
    checklistStatus() {
      const todos = this.taskCopy.checklist.todos;
      const doneTodos = todos.filter(todo => todo.isDone).length;
      const allTodos = todos.length;
      return doneTodos + "/" + allTodos;
    },
    taskDetails() {
      const boardId = this.$store.getters.currBoardId;
      const taskId = this.task.id;
      return `/board/${boardId}/task/${taskId}`;
    }
  },
  methods: {
    toggleMenu(ev) {
      ev.stopPropagation();
      this.isMenuOpen = !this.isMenuOpen;
    },
    taskDetailsPage() {
      this.$router.push(this.taskDetails);
    },
    async setTaskLabels(taskLabels) {
      this.taskCopy.labels = taskLabels;
      // emit to list
      await this.emit("update-task", this.taskCopy);
      try {
        this.taskCopy = JSON.parse(JSON.stringify(this.task));
      } catch {
        console.log("Task saving failed");
        this.taskCopy = JSON.parse(JSON.stringify(this.task));
      }
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    }
  },
  created() {
    this.taskCopy = JSON.parse(JSON.stringify(this.task));
  },
  components: {
    labelPreview,
    memberPreview,
    dueDatePreview,
    taskMenu
  },
  props: {
    task: Object,
    listId: String
  }
};
</script>