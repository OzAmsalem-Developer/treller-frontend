<template>
  <section class="task-preview">
    <!-- <section v-if="task.labels.length" class="preview-labels">
      <div class="preview-label" v-for="label in task.labels" :key="label.id">
        <span>{{label}}</span>
      </div>
    </section>-->
    <label-preview :labels="task.labels" />
    <h2 class="preview-title">{{task.name}}</h2>
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
      <memberPreview :members="task.members" />
      <!-- <div
        class="preview-member"
        v-for="member in task.members"
        :key="member.id"
      >{{member.fullName}}</div>-->
    </div>
  </section>
</template>

<script>
import {utilService} from "../../services/util.service.js"
import labelPreview from "./previews/label-preview.vue";
import memberPreview from "./previews/member-preview.vue";

export default {
  props: {
    task: Object
  },
  computed: {
    checklistStatus() {
      const todos = this.task.checklist.todos;
      const doneTodos = todos.filter(todo => todo.isDone).length;
      const allTodos = todos.length;
      return doneTodos + "/" + allTodos;
    },
    dueDateColor() {
      const dueDate = this.task.dueDate
      const hourfLeft = utilService.getHoursDifference(dueDate)
      const color = 
      (hourfLeft < 0)? 'red' :
      (hourfLeft < 5)? 'orange' : 
      (hourfLeft < 48)? 'yellow' : 'none' 
      return color
    },
  },
  components: {
    labelPreview,
    memberPreview
  }
};
</script>