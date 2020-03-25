<template>
<section>
      <task-menu
      v-if="isMenuOpen"
      :task="task"
      :listId="listId"
      @click.native.stop
      @remove-task="$emit('remove-task', task.id)"
      @set-labels="updateTask"
      @set-name="updateTask"
      @set-due-date="updateTask"
      :menu="$refs.pMenuBtn"
      :isScroll="isScroll"
      @clicked="closeMenu"
      @closed="isMenuOpen = false"
    >
    </task-menu>
  <section class="task-preview" @click="taskDetailsPage" >
    <button ref="pMenuBtn" class="preview-menu-btn" @click="openMenu">
      <i class="fas fa-pencil-alt"></i>
    </button>
    
    <label-preview :labels="task.labels" />
    <p class="preview-title">{{task.name}}</p>
    <dataIndicationPreview :task="task"/>
  </section>
</section>

</template>

<script>
import labelPreview from "./previews/label-preview.vue";
import dataIndicationPreview from "./previews/data-indication-preview.vue"
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
      const todos = this.task.checklist.todos;
      const doneTodos = todos.filter(todo => todo.isDone).length;
      const allTodos = todos.length;
      return doneTodos + "/" + allTodos;
    },
    taskDetails() {
      const boardId = this.$store.getters.currBoardId;
      const taskId = this.task.id;
      return `/board/${boardId}/task/${taskId}`;
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
      )
    },
    isScroll() {
      const elList = document.getElementById(this.listId)
      var hasVerticalScrollbar = elList.scrollHeight > elList.clientHeight;
      return hasVerticalScrollbar
    }
  },
  methods: {
    openMenu(ev) {
      ev.stopPropagation();
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu(task) {
      this.updateTask(task)
      this.isMenuOpen = false
    },
    taskDetailsPage() {
      this.$router.push(this.taskDetails);
    },
    async updateTask(task) {
      this.taskCopy = task;
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
    taskMenu,
    labelPreview,
    dataIndicationPreview
  },
  props: {
    task: Object,
    listId: String,
    elTasks: HTMLElement
  }
};
</script>