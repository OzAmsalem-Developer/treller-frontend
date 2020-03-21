<template>
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
            <button class="member-card" @click="setMembers">+</button>
          </div>
        </section>

        <section class="details-due-date">
          <!-- <span>🕖</span> -->
          <span class="font-bold">Due Date:</span>
          <span class="action-link">Update</span>
          <div class="details-due-list">
            <input type="checkbox" v-model="editedTask.dueDate.isCompleted" @change="updateTask" />
            <input v-model="currDueDate" @change="setDueDate" type="date" />
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
          />
        </section>

        <section v-if="task.checklist" class="details-checklist">
          <div>
            <input
              class="check-list-title"
              v-model="editedTask.checklist.title"
              type="text"
              @change="updateTask"
            />
            <!-- <span class="action-link">remove</span> -->
          </div>
          <div v-for="item in task.checklist.todos" :key="item.id">
            <input class="details-clean-input" v-model="item.txt" @change="updateTask" />
            <button class="todo-remove-btn" @click="removeTodo(item.id)">X</button>
          </div>
          <input
            class="details-clean-input checklist-add-item"
            v-model="newTodo.txt"
            type="text"
            placeholder="add an item"
            @change="addTodo"
          />
        </section>

        <section class="details-discussion">
          <div>
            <!-- <span>💬</span> -->
            <span class="font-bold">Discussion:</span>
            <span class="action-link">hide activity feed</span>
          </div>
          <input
            class="details-clean-input discussion-add-item"
            type="text"
            v-model="emptyComment.txt"
            placeholder="Write a comment"
          />
          <comment-preview :comments="editedTask.comments" />
        </section>
      </div>

      <section class="details-actions">
        <button @click="moveTask">Move</button>
        <button @click="copyTask">Copy</button>
        <button @click="setLabels">Labels</button>
        <button @click="setMembers">Members</button>
        <button @click="setDueDate">Due Date</button>
        <button @click="updateDescription">Description</button>
        <button @click="updateChecklist">Checklist</button>
        <button @click="sendAttachment">Attachments</button>
        <button @click="sendComment">Comments</button>
      </section>
    </div>
  </section>
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
      newTodo: {
        id: "",
        txt: "",
        isDone: false
      },
      emptyComment: {
        txt: ''
      }
    };
  },
  methods: {
    async updateTask() {
      await this.$store
        .dispatch({ type: "updateTask", task: this.editedTask })
        .catch(prevTask => {
          this.editedTask = prevTask;
          console.log("Err, failed to save task");
        });
    },
    async addTodo() {
      this.newTodo.id = utilService.makeId();
      // you can get empty from the serviced
      this.editedTask.checklist.todos.push(this.newTodo);
      await this.updateTask();
      try {
        const newTodo = {
          id: "",
          txt: "",
          isDone: false
        };
        this.newTodo = newTodo;
      } catch {
        console.log("Failed to save todo + task");
      }
    },
    async addComment() {
    // emptyComment = this.$store.commit({type: "getEmptyComment" task: ""})
    emptyComment = utilService.getEmptyComment()
    // unshift
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
    closeDetails() {
      const boardId = this.$store.getters.currBoardId;
      this.$router.push(`/board/${boardId}`);
    },
    moveTask() {
      console.log("Please move the Task!");
    },
    copyTask() {
      console.log("Please copy the Task!");
    },
    updateTaskName() {
      console.log("I will updated th task name!");
    },
    setLabels() {
      console.log("Please set the Labels!");
    },
    setMembers() {
      console.log("Please set the Members!");
    },
    updateDescription() {
      console.log("Please update the Description!");
    },
    updateChecklist() {
      console.log("Please update the Checklist!");
    },
    sendAttachment() {
      console.log("Please send this Attachments!");
    },
    sendComment() {
      console.log("Please send this Comment!");
    },
    setDueDate() {
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
    }
  },
  created() {
    console.log("// DETAILS PAGE CREATED!");
    console.log("// This should only appear if task details is displayed!");
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    if (this.editedTask) {
      this.getCurrDueDate();
    }
    document.addEventListener("keyup", this.closeDetailsOnEsc);
    console.log("EDITED TASK:", this.editedTask);
  },
  destroyed() {
    console.log("// DETAILS PAGE DESTROED!");
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