<template>
  <div class="window-overlay" ref="window" @mousedown="closeDetailsOverlay">
    <section v-if="task" class="task-details" ref="task">
      <label-picker
        class="move-label-menu"
        v-if="isLabelOpen"
        @set-labels="setLabels"
        :boardLabels="boardLabels"
        :taskLabels="task.labels"
        @close-picker="toggleLabelMenu"
      />
      <move-picker
        class="move-picker-menu"
        v-if="isMoveOpen"
        v-model="moveToList"
        :optionalLists="optionalLists"
        @input="moveTask"
        @close-picker="toggleMoveMenu"
      />
      <add-member
        :task="task"
        v-if="isAddMember"
        @add-task-member="addMember"
        @closed="isAddMember = false"
      />
      <div class="task-details-header details-grid-title">
        <span class="details-icons">
          <i class="fas fa-layer-group"></i>
        </span>
        <input v-model="editedTask.name" class="task-title" type="text" @change="updateAndBlur" />
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

            <section v-if="task.members" class="details-members">
              <div class="detils-members-container">
                <div class="title-container">
                  <span class="title">Members:</span>
                </div>
                <div class="members">
                  <user-avatar
                    @member-removed="removeMember"
                    v-for="member in task.members"
                    :user="member"
                    :key="member._id"
                  />
                  <button class="member-add-btn member-card" @click="isAddMember = !isAddMember">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </section>
            <section v-if="task.dueDate.isCompleted !== null" class="details-due-date">
              <!-- <div class="dueDate-container"> -->
              <div class="title-container">
                <span class="title">Due Date:</span>
              </div>
              <!-- <div class="details-due-list"> -->
              <div class="details-due-check-main">
                <input
                  class="details-due-check"
                  type="checkbox"
                  v-model="editedTask.dueDate.isCompleted"
                  @change="updateTask"
                />
              </div>
              <!-- <div class="block"> -->
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
              <!-- </div> -->
              <due-date-preview
                v-if="task.dueDate.time"
                class="due-date-preview"
                :dueDate="task.dueDate"
              />
              <!-- </div> -->
              <!-- </div> -->
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
              placeholder="Add more information here"
              class="details-desc-input details-grid-last"
              ref="description"
              rows="1"
            />
          </section>
          <section v-if="editedTask.attachments.length" class="details-attachment details-grid">
            <div class="details-icons">
              <i class="far fa-image"></i>
            </div>
            <div>
              <span class="titles">Image:</span>
            </div>
            <img class="details-grid-last" :src="getTaskImg" />
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
                @change="updateAndBlur"
                ref="checklist"
              />
            </div>
            <div class="details-grid-last">
              <el-progress
                class="checklist-progress"
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
          <button @click="toggleLabelMenu">
            <i class="fas fa-tag"></i>
            <span class="action-title">Labels</span>
          </button>
          <button @click="isAddMember = !isAddMember">
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
          <label class="add-image-btn" for="add-img">
            <i class="far fa-image"></i>
            <span class="action-title">Add Image</span>
          </label>
          <input id="add-img" @change="uploadImg" type="file" />
          <button @click="updateChecklist">
            <i class="far fa-check-square"></i>
            <span class="action-title">Checklist</span>
          </button>
          <button @click="sendComment">
            <i class="far fa-comment"></i>
            <span class="action-title">Comments</span>
          </button>
          <button @click="toggleMoveMenu">
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
import { eventBus, EV_addActivity } from "@/services/eventBus.service.js";
import { socketService } from "@/services/socket.service.js";
import { cloudinaryService } from "@/services/cloudinary.service.js";
import userAvatar from "@/cmps/main-cmps/user-avatar";
import labelPreview from "@/cmps/task-cmps/previews/label-preview.vue";
import dueDatePreview from "@/cmps/task-cmps/previews/due-date-preview.vue";
import commentPreview from "@/cmps/task-cmps/previews/comment-preview.vue";
import movePicker from "@/cmps/task-cmps/pickers/move-picker.vue";
import labelPicker from "@/cmps/task-cmps/pickers/label-picker.vue";
import addMember from "@/cmps/task-cmps/add-member";

export default {
  data() {
    return {
      editedTask: null,
      currDueDate: null,
      moveToList: null,
      isLabelOpen: false,
      isMoveOpen: false,
      isAddMember: false,
      listId: null,
      currTodo: {
        txt: ""
      },
      currComment: {
        txt: ""
      }
    };
  },
  methods: {
    async uploadImg(ev) {
      const imgUrl = await cloudinaryService.uploadImg(ev);

      this.editedTask.attachments.unshift(imgUrl);
      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation: "added image to task " + `"${this.task.name}"`
      });
      this.updateTask();
    },
    getListId() {
      const idx = this.$store.getters.taskLists.findIndex(taskList => {
        let matchingTask = taskList.tasks.find(
          task => task.id === this.task.id
        );
        return !!matchingTask;
      });
      this.listId = this.$store.getters.taskLists[idx].id;
    },
    setLabels(labels) {
      this.editedTask.labels = labels;
      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation: "updated task labels for " + `"${this.task.name}"`
      });
      this.updateTask();
    },
    toggleMoveMenu() {
      this.isMoveOpen = !this.isMoveOpen;
    },
    toggleLabelMenu() {
      this.isLabelOpen = !this.isLabelOpen;
    },
    moveTask() {
      const toListId = this.moveToList;
      const taskId = this.task.id;
      this.$emit("move-task", { toListId, taskId });
      this.updateTask();
      this.toggleMoveMenu();
    },
    async updateTask() {
      await this.$store.dispatch({ type: "updateTask", task: this.editedTask });
      try {
        setTimeout(() => {
          this.editedTask = JSON.parse(JSON.stringify(this.task));
        }, 2);
      } catch (prevTask) {
        this.editedTask = JSON.parse(JSON.stringify(prevTask));
        console.log("Err, failed to save task");
      }
      socketService.emit("board boardChanged", this.currBoard);
    },
    updateAndBlur(ev) {
      ev.target.blur();
      this.updateTask();
    },
    async removeTask() {
      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "removed task " + `"${this.task.name}"`
      });

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

        eventBus.$emit(EV_addActivity, {
          from: this.loggedinUser,
          createdAt: Date.now(),
          taskId: this.task.id,
          operation: "set due date to" + `"${this.task.name}"`
        });

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

      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation:
          "added todo item " +
          `"${this.currTodo.txt}"` +
          " to task " +
          `"${this.task.name}"`
      });

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
      emptyComment.from = this.loggedinUser;
      this.editedTask.comments.unshift(emptyComment);

      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation:
          "leave a comment " +
          `"${this.currComment.txt}"` +
          " in " +
          `"${this.task.name}"`
      });

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
        eventBus.$emit(EV_addActivity, {
          from: this.loggedinUser,
          createdAt: Date.now(),
          taskId: this.task.id,
          operation: "added checklist to" + `"${this.task.name}"`
        });

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
    addMember(member) {
      this.editedTask.members.push(member);

      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation: "added " + member.username + " to " + `"${this.task.name}"`
      });

      this.updateTask();
    },
    removeMember(userId) {
      const idx = this.editedTask.members.findIndex(m => m._id === userId);
      if (idx === -1) return;
      const userName = this.editedTask.members[idx].username;
      this.editedTask.members.splice(idx, 1);

      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.task.id,
        operation: "remove " + userName + " from " + `"${this.task.name}"`
      });

      this.updateTask();
    },
    updateDescription() {
      this.$refs.description.select();
    },
    expandTextArea() {
      const textarea = this.$refs.description;
      utilService.expandTextArea(textarea);
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
    getTaskImg() {
      return this.editedTask.attachments[0];
    },
    optionalLists() {
      const taskLists = this.$store.getters.taskLists;
      return taskLists.filter(tl => tl.id !== this.listId);
    },
    boardLabels() {
      return this.$store.getters.labels;
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
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  created() {
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    console.log("// Details Task:", this.task);
    document.addEventListener("keyup", this.closeDetailsOnEsc);
    this.getListId();
  },
  destroyed() {
    document.removeEventListener("keyup", this.closeDetailsOnEsc);
  },
  mounted() {
    this.expandTextArea();
  },
  components: {
    userAvatar,
    labelPreview,
    dueDatePreview,
    commentPreview,
    labelPicker,
    movePicker,
    addMember
  }
};
</script>