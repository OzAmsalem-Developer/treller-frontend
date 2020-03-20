<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div class="lists-container">
      <task-list v-for="list in taskLists" :taskList="list" :key="list.id"></task-list>
      <section class="add-list">
        <button class="add-btn" @click="isAddingList = !isAddingList">+Add List</button>
        <form @submit.prevent="addList" v-if="isAddingList">
          <input type="text" placeholder="List title.." v-model="newTaskList.name" />
          <button>Add</button>
        </form>
      </section>
    </div>
    <task-details></task-details>
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/task-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";
import { boardService } from "@/services/board.service";

export default {
  data() {
    return {
      board: null,
      isAddingList: false,
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
        console.log("Board Saved Succesfully");
      } catch {
        console.log("Err, board didnt saved");
      }
    },
    async addList() {
      console.log(this.board);
      
      this.board.tasklists.push(this.newTaskList);
      this.saveBoard();
      this.isAddingList = false
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
    this.newTaskList = boardService.getEmptyList();
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>