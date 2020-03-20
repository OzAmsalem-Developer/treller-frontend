<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div class="lists-container">
      <task-list v-for="list in taskLists" :taskList="list" :key="list.id"></task-list>
    </div>
    <task-details v-if="task" :task="task"></task-details>
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/task-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";

export default {
  data() {
    return {
      board: null,
      task: null
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
    this.loadBoardAndTask(boardId);
    // Render the task details when taskId is passed as param
    console.log(this.$route.params);
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>