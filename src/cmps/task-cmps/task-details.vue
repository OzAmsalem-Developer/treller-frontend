<template>
  <div class="window-overlay" ref="window" @mousedown="closeDetailsOverlay">
    <section v-if="task" class="task-details" ref="task">
      <move-picker
        class="move-picker-menu"
        v-if="isListOpen"
        v-model="moveToList"
        :optionalLists="optionalLists"
        @input="moveTask"
      />
      <div class="task-details-header details-grid-title">
        <span class="details-icons">
          <i class="fas fa-layer-group"></i>
        </span>
        <input v-model="editedTask.name" class="task-title" type="text" @change="updateTask" />
        <button class="close-btn" @click="closeDetails">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="details-container">
        <div class="details-info">
          <div class="details-lmd">
            <section v-if="task.labels.length" class="details-labels details-grid-title">
              <div class="details-grid-last">
                <div class="title-container">
                  <span class="title">Labels:</span>
                </div>
                <div class="list">
                  <label-preview :labels="task.labels" />
                </div>
              </div>
            </section>

            <section v-if="task.members" class="details-members details-grid-title">
              <div class="details-grid-last">
                <div class="title-container">
                  <span class="title">Members:</span>
                </div>
                <div class="list">
                  <member-preview :members="task.members"></member-preview>
                  <button class="member-add-btn member-card" @click="setMembers">+</button>
                </div>
              </div>
            </section>
            <section
              v-if="task.dueDate.isCompleted !== null"
              class="details-due-date details-grid-title"
            >
              <div class="dueDate-container details-grid-last">
                <div class="title-container">
                  <span class="title">Due Date:</span>
                </div>
                <div class="details-due-list">
                  <input
                    class="details-due-check"
                    type="checkbox"
                    v-model="editedTask.dueDate.isCompleted"
                    @change="updateTask"
                  />
                  <div class="block">
                    <el-date-picker
                      @change="updateTask"
                      v-model="editedTask.dueDate.time"
                      type="datetime"
                      format="MMM dd hh:mm A"
                      value-format="timestamp"
                      placeholder="Select date and time"
                      class="el-date-picker"
                      size="mini"
                      ref="calendar"
                    ></el-date-picker>
                  </div>
                  <due-date-preview v-if="task.dueDate.time" :dueDate="task.dueDate" />
                </div>
              </div>
            </section>
          </div>

          <section class="details-description details-grid">
            <div class="details-icons">
              <i class="fas fa-align-left"></i>
            </div>
            <div>
              <span class="titles">Description:</span>
            </div>
            <textarea
              v-model="editedTask.desc"
              @input="expandTextArea"
              @change="updateTask"
              class="details-desc-input details-grid-last"
              ref="description"
              rows="1"
            />
          </section>

          <section v-if="task.checklist" class="details-checklist details-grid">
            <div class="details-icons">
              <i class="far fa-check-square"></i>
            </div>

            <div class="details-checklist-header">
              <input
                class="checklist-title"
                v-model="editedTask.checklist.title"
                type="text"
                @change="updateCheckListTitle"
                ref="checklist"
              />
            </div>
            <div class="details-grid-last">
              <el-progress
                v-if="editedTask.checklist.todos.length"
                :percentage="checklistProgress"
                :color="progressColor"
              ></el-progress>
              <div
                class="checklist-todo-container"
                v-for="item in editedTask.checklist.todos"
                :key="item.id"
              >
                <input type="checkbox" v-model="item.isDone" @change="updateTask" />
                <input
                  type="text"
                  :class="item.isDone? 'todo-done' : ''"
                  class="checklist-todo"
                  v-model="item.txt"
                  @change="updateTask"
                />
                <button class="todo-remove-btn" @click="removeTodo(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
              <input
                class="checklist-add-todo"
                v-model="currTodo.txt"
                type="text"
                placeholder="Add an item"
                @change="addTodo"
              />
            </div>
          </section>

          <section class="details-discussion details-grid">
            <span class="details-icons">
              <i class="fas fa-stream"></i>
            </span>
            <div class="details-disc-header">
              <span class="details-titles">Discussion:</span>
              <!-- <span class="action-link">hide activity feed</span> -->
            </div>
            <input
              class="discussion-add-item details-grid-last"
              type="text"
              v-model="currComment.txt"
              @change="addComment"
              placeholder="Write a comment"
              ref="comment"
            />
          </section>
          <comment-preview :comments="editedTask.comments" @removeComment="removeComment" />
        </div>

        <section class="details-actions">
          <div class="title">Actions:</div>
          <button @click="setLabels">
            <i class="fas fa-tag"></i>
            <span class="action-title">Labels</span>
          </button>
          <button @click="setMembers">
            <i class="far fa-user"></i>
            <span class="action-title">Members</span>
          </button>
          <button @click="setDueDate">
            <i class="far fa-clock"></i>
            <span class="action-title">Due Date</span>
          </button>
          <button @click="updateDescription">
            <i class="fas fa-align-left"></i>
            <span class="action-title">Description</span>
          </button>
          <button @click="updateChecklist">
            <i class="far fa-check-square"></i>
            <span class="action-title">Checklist</span>
          </button>
          <button @click="sendComment">
            <i class="far fa-comment"></i>
            <span class="action-title">Comments</span>
          </button>
          <button @click="toggleListMenu">
            <i class="fas fa-long-arrow-alt-right"></i>
            <span class="action-title">Move</span>
          </button>
          <button @click="removeTask">
            <i class="far fa-trash-alt"></i>
            <span class="action-title">Remove</span>
          </button>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import { socketService } from "@/services/socket.service.js";
import memberPreview from "@/cmps/task-cmps/previews/member-preview.vue";
import labelPreview from "@/cmps/task-cmps/previews/label-preview.vue";
import dueDatePreview from "@/cmps/task-cmps/previews/due-date-preview.vue";
import commentPreview from "@/cmps/task-cmps/previews/comment-preview.vue";
import movePicker from "@/cmps/task-cmps/pickers/move-picker.vue";

export default {
  data() {
    return {
      editedTask: null,
      currDueDate: null,
      moveToList: null,
      isListOpen: false,
      currTodo: {
        txt: ""
      },
      currComment: {
        txt: ""
      }
    };
  },
  methods: {
    toggleListMenu() {
      this.isListOpen = !this.isListOpen;
    },
    moveTask(toListId) {
      console.log("Please move the Task!");
      console.log("toListId:", toListId);
    // const fromListId = this.editedTask.

      // const lists = this.$store.getters.taskLists
      this.$emit("move-task", { fromListId, toListId, taskId });
    },
    async updateTask() {
      await this.$store.dispatch({ type: "updateTask", task: this.editedTask });
      try {
        this.editedTask = JSON.parse(JSON.stringify(this.task));
      } catch (prevTask) {
        this.editedTask = JSON.parse(JSON.stringify(prevTask));
        console.log("Err, failed to save task");
      }
      socketService.emit("board boardChanged", this.currBoard);
    },
    updateCheckListTitle(ev) {
      ev.target.blur();
      this.updateTask();
    },
    async removeTask() {
      await this.$store.dispatch({
        type: "removeTask",
        task: this.editedTask
      });
      try {
        this.closeDetails();
      } catch (prevTask) {
        this.editedTask = JSON.parse(JSON.stringify(prevTask));
        console.log("Err, failed to save task");
      }
      socketService.emit("board boardChanged", this.currBoard);
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
    async updateChecklist() {
      if (this.editedTask.checklist) {
        this.$refs.checklist.select();
      } else {
        let emptyChecklist = utilService.getEmptyChecklist();
        this.editedTask.checklist = emptyChecklist;
        await this.updateTask();
        try {
          this.$refs.checklist.select();
        } catch {
          console.log("failed to save checklist");
        }
      }
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
    expandTextArea() {
      console.log("Hello!");
      const textarea = this.$refs.description;
      var heightLimit = 200;
      textarea.style.height = "";
      textarea.style.height =
        Math.min(textarea.scrollHeight, heightLimit) + "px";
    },
    sendComment() {
      this.$refs.comment.focus();
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
    closeDetailsOnEsc(ev) {
      if (ev.key === "Escape") this.closeDetails();
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    },
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId);
    },
    checklistProgress() {
      if (!this.editedTask.checklist.todos.length) return 0;

      let isDoneCount = this.editedTask.checklist.todos.filter(
        todo => todo.isDone === true
      ).length;
      const progress =
        (isDoneCount / this.editedTask.checklist.todos.length) * 100;
      return parseInt(progress);
    },
    progressColor() {
      let isDoneCount = this.editedTask.checklist.todos.filter(
        todo => todo.isDone === true
      ).length;
      const progress =
        (isDoneCount / this.editedTask.checklist.todos.length) * 100;
      if (progress === 100) return "#67C23A";
      else return "#409EFF";
    },
    currBoard() {
      return this.$store.getters.currBoard;
    }
  },
  created() {
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    console.log("// Details Task:", this.editedTask);
    document.addEventListener("keyup", this.closeDetailsOnEsc);
  },
  destroyed() {
    document.removeEventListener("keyup", this.closeDetailsOnEsc);
  },
  components: {
    memberPreview,
    labelPreview,
    dueDatePreview,
    commentPreview,
    movePicker
  }
};
</script>