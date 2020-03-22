<template>
  <div class="window-overlay" ref="window" @mousedown="closeDetailsOverlay">
    <section v-if="task" class="task-details">
      <div class="task-details-header">
        <input v-model="editedTask.name" class="details-title" type="text" @change="updateTask" />
        <button class="close-details-btn" @click="closeDetails">✖️</button>
      </div>
      <div class="details-container">
        <div class="details-info">
          <section v-if="task.labels.length" class="details-labels">
            <!-- <span>💡</span> -->
            <span class="font-bold">Labels:</span>
            <span class="action-link">Update</span>
            <div class="details-labels-list">
              <labelPreview :labels="task.labels" />
              <button>+</button>
            </div>
          </section>

          <section v-if="task.members" class="details-members">
            <span class="font-bold">Members:</span>
            <span class="action-link" @click="setMembers">Invite</span>
            <div class="details-members-list">
              <member-preview :members="task.members"></member-preview>
              <button class="member-add-btn member-card" @click="setMembers">+</button>
            </div>
          </section>

          <section v-if="task.dueDate.isCompleted !== null" class="details-due-date">
            <!-- <span>🕖</span> -->
            <span class="font-bold">Due Date:</span>
            <span class="action-link">Update</span>
            <div class="details-due-list">
              <input
                class="details-due-check"
                type="checkbox"
                v-model="editedTask.dueDate.isCompleted"
                @change="updateTask"
              />
              <input v-model="currDueDate" @change="updateDueDate" type="date" ref="calendar" />
              <due-date-preview v-if="task.dueDate.time" :dueDate="task.dueDate" />
            </div>
          </section>

          <section class="details-description">
            <!-- <span>📄</span> -->
            <div>
              <span class="font-bold">Description:</span>
              <span class="action-link">Edit</span>
            </div>
            <textarea
              v-model="editedTask.desc"
              @change="updateTask"
              class="details-text-area details-desc-input"
              ref="description"
            />
          </section>

          <section v-if="task.checklist" class="details-checklist">
            <div>
              <input
                class="check-list-title"
                v-model="editedTask.checklist.title"
                type="text"
                @change="updateTask"
                ref="checklist"
              />
              <span>{{checklistProgress}}%</span>
              <!-- <span class="action-link">remove</span> -->
            </div>
            <div class="checklist-todo-container" v-for="item in editedTask.checklist.todos" :key="item.id">
              <input type="checkbox" v-model="item.isDone" @change="updateTask" />
              <input
                type="text"
                :class="item.isDone? 'todo-done' : ''"
                class="details-clean-input"
                v-model="item.txt"
                @change="updateTask"
              />
              <button class="todo-remove-btn" @click="removeTodo(item.id)">x</button>
            </div>
            <input
              class="details-clean-input checklist-add-item"
              v-model="currTodo.txt"
              type="text"
              placeholder="add an item"
              @change="addTodo"
            />
          </section>

          <section class="details-discussion">
            <div>
              <!-- <span>💬</span> -->
              <span class="font-bold">Discussion:</span>
              <!-- <span class="action-link">hide activity feed</span> -->
            </div>
            <input
              class="details-clean-input discussion-add-item"
              type="text"
              v-model="currComment.txt"
              @change="addComment"
              placeholder="Write a comment"
              ref="comment"
            />
            <comment-preview :comments="editedTask.comments" @removeComment="removeComment" />
          </section>
        </div>

        <section class="details-actions">
          <button @click="moveTask">Move</button>
          <!-- <button @click="copyTask">Copy</button> -->
          <button @click="setLabels">Labels</button>
          <button @click="setMembers">Members</button>
          <button @click="setDueDate">Due Date</button>
          <button @click="updateDescription">Description</button>
          <button @click="updateChecklist">Checklist</button>
          <button @click="sendComment">Comments</button>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import memberPreview from "@/cmps/task-cmps/previews/member-preview.vue";
import labelPreview from "@/cmps/task-cmps/previews/label-preview.vue";
import dueDatePreview from "@/cmps/task-cmps/previews/due-date-preview.vue";
import commentPreview from "@/cmps/task-cmps/previews/comment-preview.vue";

export default {
  data() {
    return {
      editedTask: null,
      currDueDate: null,
      currTodo: {
        txt: ""
      },
      currComment: {
        txt: ""
      }
    };
  },
  methods: {
    async updateTask() {
      await this.$store.dispatch({ type: "updateTask", task: this.editedTask });
      try {
        this.editedTask = JSON.parse(JSON.stringify(this.task));
      } catch (prevTask) {
        this.editedTask = JSON.parse(JSON.stringify(prevTask));
        console.log("Err, failed to save task");
      }
    },
    async addTodo() {
      let emptyTodo = utilService.getEmptyTodo();
      emptyTodo.txt = this.currTodo.txt;
      this.editedTask.checklist.todos.push(emptyTodo);
      await this.updateTask();
      try {
        this.currTodo.txt = "";
      } catch {
        console.log("Failed to save todo + task");
      }
    },
    async removeTodo(todoId) {
      const idx = this.editedTask.checklist.todos.findIndex(
        todo => todo.id === todoId
      );
      if (idx !== -1) {
        this.editedTask.checklist.todos.splice(idx, 1);
      }
      await this.updateTask().catch(() => {
        console.log("Failed to save todo + task");
      });
    },
    async addComment() {
      let emptyComment = utilService.getEmptyComment();
      emptyComment.txt = this.currComment.txt;
      emptyComment.from = "Guest";
      this.editedTask.comments.unshift(emptyComment);
      await this.updateTask();
      try {
        this.currComment.txt = "";
      } catch {
        console.log("Failed to save comment + task");
      }
    },
    async removeComment(commentId) {
      const idx = this.editedTask.comments.findIndex(
        comment => comment.id === commentId
      );
      if (idx !== -1) {
        this.editedTask.comments.splice(idx, 1);
      }
      await this.updateTask().catch(() => {
        console.log("Failed to save todo + task");
      });
    },
    closeDetails() {
      const boardId = this.$store.getters.currBoardId;
      this.$router.push(`/board/${boardId}`);
    },
    closeDetailsOverlay(ev) {
      if (ev.target !== this.$refs.window) return;
      const boardId = this.$store.getters.currBoardId;
      this.$router.push(`/board/${boardId}`);
    },
    moveTask() {
      console.log("Please move the Task!");
    },
    copyTask() {
      console.log("Please copy the Task!");
    },
    setLabels() {
      console.log("Please set the Labels!");
    },
    setMembers() {
      console.log("Please set the Members!");
    },
    updateDescription() {
      this.$refs.description.focus();
    },
    async updateChecklist() {
      if (this.editedTask.checklist) {
        this.$refs.checklist.focus();
      } else {
        let emptyChecklist = utilService.getEmptyChecklist();
        this.editedTask.checklist = emptyChecklist;
        await this.updateTask();
        try {
          this.$refs.checklist.focus();
        } catch {
          console.log("failed to save checklist");
        }
      }
    },
    sendComment() {
      this.$refs.comment.focus();
    },
    async setDueDate() {
      if (this.editedTask.dueDate.isCompleted === null) {
        this.editedTask.dueDate.isCompleted = false;
        await this.updateTask();
        try {
          this.$refs.calendar.focus();
        } catch {
          console.log("failed to save setDueDate");
        }
      } else {
        this.$refs.calendar.focus();
      }
    },
    updateDueDate() {
      // Turn currDueDate to Timestamp!
      this.editedTask.dueDate.time = new Date(this.currDueDate).getTime();
      this.updateTask();
    },
    getCurrDueDate() {
      var day = new Date(this.editedTask.dueDate.time).getDate();
      var month = new Date(this.editedTask.dueDate.time).getMonth() + 1;
      var year = new Date(this.editedTask.dueDate.time).getFullYear();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      this.currDueDate = `${year}-${month}-${day}`;
    },
    closeDetailsOnEsc(ev) {
      if (ev.key === "Escape") this.closeDetails();
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    },
    checklistProgress() {
      if (!this.editedTask.checklist.todos.length) return "0";

      let isDoneCount = this.editedTask.checklist.todos.filter(
        todo => todo.isDone === true
      ).length;
      const progress =
        (isDoneCount / this.editedTask.checklist.todos.length) * 100;
      return parseInt(progress);

      return;
    }
  },
  created() {
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    console.log("// Details Task:", this.editedTask);
    if (this.editedTask) {
      this.getCurrDueDate();
    }
    document.addEventListener("keyup", this.closeDetailsOnEsc);
  },
  destroyed() {
    document.removeEventListener("keyup", this.closeDetailsOnEsc);
  },
  components: {
    memberPreview,
    labelPreview,
    dueDatePreview,
    commentPreview
  }
};
</script>