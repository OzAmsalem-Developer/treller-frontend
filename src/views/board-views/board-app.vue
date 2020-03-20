<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div class="lists-container">
      <task-list v-for="list in taskLists" :taskList="list" :key="list.id" @task-added="addTask" />
      <section class="add-list">
        <button class="add-btn" @click="getEmptyList">+Add List</button>
        <form class="add-list" @submit.prevent="addList" v-if="newTaskList">
          <input ref="listInput" type="text" placeholder="List title.." v-model="newTaskList.name" />
          <button>Add</button>
        </form>
      </section>
    </div>
    <task-details />
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/task-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";
import { boardService } from "@/services/board.service";
import { utilService } from "@/services/util.service";

export default {
  data() {
    return {
      board: null,
      newTaskList: null
    };
  },
  methods: {
    async loadBoardAndTask(boardId) {
      const board = await this.$store.dispatch({ type: "loadById", boardId });
      try {
        this.board = JSON.parse(JSON.stringify(board));
        const taskId = this.$route.params.taskId;

        this.$store.commit({ type: "setCurrTask", taskId });
        this.task = JSON.parse(JSON.stringify(this.currTask));
      } catch {
        console.log("Err msg to user here");
        this.$router.push("/user/dashboard");
      }
    },
    async saveBoard() {
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
      try {
        console.log("CMP: Board Saved Succesfully");
      } catch(prevBoard) {
        this.board = JSON.parse(JSON.stringify(board));
        console.log("Err, board didnt saved");
      }
    },
    async addList() {
      this.board.taskLists.push(this.newTaskList);
      this.saveBoard();
      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(document.querySelector("html"), 1500, 700);
      }, 0);
    },
    addTask({newTask, listId}) {
      const taskList = this.board.taskLists.find(tl => tl.id === listId)
      if (taskList) taskList.tasks.push(newTask)
      this.saveBoard();
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
  watchers: {
    $route() {
      const boardId = this.$route.params.boardId;
      this.loadBoardAndTask(boardId);
    }
  },
  created() {
    const boardId = this.$route.params.boardId;
    this.loadBoardAndTask(boardId); // Render the task details when taskId is passed as param
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>