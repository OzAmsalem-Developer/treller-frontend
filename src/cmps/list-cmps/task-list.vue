<template>
  <section v-if="taskList" class="task-list">
    <section class="edit-list-name" v-if="isEditName">
      <input
      @click="isEditName = true"
        @change="saveListName"
        @blur="saveListName"
        class="list-input"
        type="text"
        v-model="listCopy.name"
        ref="listNameInput"
        draggable="false"
      />

      <button @click="isMenuOpen = !isMenuOpen" class="list-menu-btn">
        <i class="menu-icon fas fa-ellipsis-h"></i>
      </button>

      <div v-if="isMenuOpen" @click="isMenuOpen = false" class="screen-trans"></div>
      <list-menu
        @add-task="getEmptyTask"
        @list-moved="moveList"
        :listId="taskList.id"
        v-if="isMenuOpen"
        @clicked="isMenuOpen = false"
      ></list-menu>
    </section>

    <header class="list-header" v-else>
      <h3 class="list-name" v-if="!isEditName" @click="editListName">{{taskList.name}}</h3>
      <button @click="isMenuOpen = !isMenuOpen" class="list-menu-btn" >
        <i class="menu-icon fas fa-ellipsis-h"></i>
      </button>
      <list-menu
        @add-task="getEmptyTask(); isMenuOpen = false"
        @list-moved="moveList"
        :listId="taskList.id"
        v-if="isMenuOpen"
        @clicked="isMenuOpen = false"
      />
    </header>
    <main class="tasks" ref="tasks" :id="taskList.id">
      <Container
        @drop="onDrop"
        @drag-end="onDragEnd"
        :drag-begin-delay="delayDrag"
        group-name="tasks"
        drag-handle-selector=".task-preview"
        :get-child-payload="getTaskPayload(taskList.id)"
        drag-class="task-dragging"
        drop-class="task-dropping"
      >
        <Draggable class="preview-wrapper" v-for="task in tasks" :key="task.id">
          <task-preview
            :task="task"
            :listId="taskList.id"
            :elTasks="$refs.tasks"
            @remove-task="removeTask"
            @update-task="saveTask"
          />
        </Draggable>
      </Container>
      <transition name="fade">
        <form class="add-task" @submit.prevent="addTask" @keydown.enter.prevent v-if="newTask">
          <textarea
            class="new-task-box"
            ref="taskInput"
            @keyup.enter.prevent="addTask"
            @blur="blurTask"
            v-model="newTask.name"
            cols="30"
            rows="3"
            placeholder="Task name"
          ></textarea>
          <button ref="addTaskBtn" hidden>Add</button>
        </form>
      </transition>
    </main>
    <footer>
      <section v-if="newTask" class="new-task-btns">
        <button @click="$refs.addTaskBtn.click()" ref="sendTaskForm" class="add-task-btn inner">Add</button>
        <button @click.prevent="newTask = null" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </section>
      <button v-else @click="getEmptyTask" class="add-task-btn">
        <i class="fas fa-plus"></i> Add Task
      </button>
    </footer>
  </section>
</template>

<script>
import taskPreview from "@/cmps/task-cmps/task-preview.vue";
import { boardService } from "@/services/board.service";
import { eventBus, EV_closeFromScreen, EV_addActivity } from "@/services/eventBus.service";
import { utilService } from "@/services/util.service";
import listMenu from "@/cmps/list-cmps/list-menu";
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  data() {
    return {
      newTask: null,
      isTaskSaved: false,
      isMenuOpen: false,
      listCopy: null,
      isEditName: false
    };
  },
  methods: {
    getEmptyTask() {
      this.newTask = boardService.getEmptyTask();
      setTimeout(() => {
        this.$refs.tasks.scrollTo(0, this.$refs.tasks.scrollHeight);
        if(this.$refs.taskInput) this.$refs.taskInput.focus();
      }, 2);
    },
    editListName() {
      this.isEditName = true;
      setTimeout(() => {
        this.$refs.listNameInput.focus();
      }, 0);
    },
    addTask(ev) {
      // allow break line on shift+enter
      if ( ev && ev.shiftKey) {
        this.newTask.name += "\n";
        return;
      }
      this.isTaskSaved = true

      if (!this.newTask.name.length) {
        this.newTask = null; // (Close add-task)
        return;
      }
      
      this.newTask.listId = this.taskList.id
      this.listCopy.tasks.push(this.newTask);
      this.saveList("save-list");

      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: this.newTask.id,
        operation: "added task " + `"${this.newTask.name}"` + " to " + this.taskList.name + " list"
      })

     
      // this.newTask = null;
      this.getEmptyTask();
      setTimeout(() => {
        this.$refs.tasks.scrollTo(0, this.$refs.tasks.scrollHeight);
      }, 2);
      this.$refs.taskInput.focus();
    },
    async saveList(evName) {
      await this.emit(evName, this.listCopy);
      this.listCopy = JSON.parse(JSON.stringify(this.taskList));
    },
    async saveTask(task) {
      const idx = this.listCopy.tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        this.listCopy.tasks.splice(idx, 1, task);
        this.saveList("save-list");
      }
    },
    onDrop(dropResult) {
      this.listCopy.tasks = utilService.applyDrag(
        this.taskList.tasks,
        dropResult
      );
      this.saveList("save-lists-order");
    },
    onDragEnd() {
      console.log('end')
      document.querySelector('body').classList.remove('smooth-dnd-no-user-select')
      document.querySelector('body').classList.remove('smooth-dnd-disable-touch-action')
    },
    getTaskPayload(listId) {
      return index => {
        return this.$store.getters.taskLists.filter(tl => tl.id === listId)[0]
          .tasks[index];
      };
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
    moveList(toIdx) {
      this.$emit("list-moved", { listIdx: this.listIdx, toIdx: toIdx - 1 });
      this.isMenuOpen = false;
    },
    saveListName(ev) {
      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "changed list name to " + `"${this.listCopy.name}"`
      })
      this.saveList("save-list");
      this.isEditName = false
    },
    focus(ev) {
      ev.target.focus();
    },
    blurTask() {
      setTimeout(() => {
        if (this.isTaskSaved) {
        this.isTaskSaved = false
          return
        }
        else {
          if ( this.newTask && this.newTask.name.length > 0) this.addTask()
            this.newTask = null
            this.isTaskSaved = false
        }
      }, 150)
    },
    removeTask(taskId) {
      const idx = this.listCopy.tasks.findIndex(t => t.id === taskId);
      const taskName = this.listCopy.tasks[idx].name
      if (idx !== -1) this.listCopy.tasks.splice(idx, 1);
      eventBus.$emit(EV_addActivity, {
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "removed task " + `"${taskName}"`
      })
      this.saveList("save-list");
    }
  },
  watch: {
    tasks() {
      this.listCopy = JSON.parse(JSON.stringify(this.taskList));
    }
  },
  created() {
    this.listCopy = JSON.parse(JSON.stringify(this.taskList));
  },
  computed: {
    tasks() {
      return this.taskList.tasks;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
    delayDrag() {
      return screen.width > 900 ? 0 : 500
    }
  },
  props: {
    taskList: Object,
    listIdx: Number
  },
  components: {
    taskPreview,
    listMenu,
    Container,
    Draggable
  }
};
</script>