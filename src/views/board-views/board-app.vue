<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div ref="lists" class="lists-container">
      <task-list v-for="list in taskLists" :taskList="list" :key="list.id" @save-list="saveTaskList" />
      <section class="add-list">
        <button class="add-btn" @click="getEmptyList">+Add List</button>
        <form class="add-list" @submit.prevent="addList" v-if="newTaskList">
          <input ref="listInput" type="text" placeholder="List title.." v-model="newTaskList.name" />
          <button>Add</button>
        </form>
      </section>
    </div>
    <task-details v-if="!isTaskLoad" @task-updated="saveTask"/>
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/task-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";
import { boardService } from "@/services/board.service";
import { utilService } from "@/services/util.service";
import { eventBus, EV_removeList, EV_saveFailed } from "@/services/eventBus.service";

export default {
  data() {
    return {
      board: null,
      newTaskList: null,
      isTaskLoad: false
    };
  },
  methods: {
    async loadBoardAndTask(boardId) {
      const board = await this.$store.dispatch({ type: "loadById", boardId });
      try {
        this.board = JSON.parse(JSON.stringify(board));
        const taskId = this.$route.params.taskId;

        this.$store.commit({ type: "setTaskById", taskId });
        this.task = JSON.parse(JSON.stringify(this.currTask));
        this.isTaskLoad = false;
      } catch {
        console.log("Err msg to user here");
        this.$router.push("/user/dashboard");
      }
    },
    async saveBoard() {
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
      try {
        console.log("CMP: Board Saved Succesfully");
      } catch (prevBoard) {
        this.board = JSON.parse(JSON.stringify(board));
        console.log("Err, board didnt saved");
        throw new Error('Saving failed')
      }
    },
    async addList() {
      this.board.taskLists.push(this.newTaskList);
      this.saveBoard();
      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(this.$refs.lists, 1500, 700);
      }, 0);
    },
    removeList(listId) {
      const idx = this.board.taskLists.findIndex(list => list.id === listId)
      this.board.taskLists.splice(idx, 1)
      this.saveBoard();
    },
    saveTaskList(taskList) {
      const idx = this.board.taskLists.findIndex(tl => tl.id === taskList.id);
      if (idx !== -1) this.board.taskLists.splice(idx, 1, taskList)
        this.saveBoard()
        .catch(() => {eventBus.$emit(EV_saveFailed)})
    },
    saveTask(task) {
      //CHECK if we need it
      const taskList = JSON.parse(JSON.stringify(this.board.taskLists(list => list.id === task.listId))) 
      const idx = taskList.tasks.findIndex(t => t.id === task.id)
      taskList.splice(idx, 1, task)
      saveTaskList(taskList)
    },
    getEmptyList() {
      this.newTaskList = this.newTaskList ? null : boardService.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(document.querySelector("html"), 1500, 700);
        if (this.$refs.listInput) this.$refs.listInput.focus();
      }, 0);
    }
  },
  computed: {
    taskLists() {
      return this.$store.getters.taskLists;
    },
    currTask() {
      return this.$store.getters.currTask;
    }
  },
  watch: {
    $route() {
      this.isTaskLoad = true;
      const boardId = this.$route.params.boardId;
      this.loadBoardAndTask(boardId);
    }
  },
  created() {
    const boardId = this.$route.params.boardId;
    this.loadBoardAndTask(boardId); // Render the task details when taskId is passed as param

    //Event Bus
    eventBus.$on(EV_removeList, this.removeList)
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>