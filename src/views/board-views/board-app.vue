<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <task-list v-for="list in taskLists" :taskList="list" :key="list.id"></task-list>
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
    async getBoard(boardId) {
      const board = await this.$store.dispatch({ type: "loadById", boardId });
      console.log(board);
      try {
        this.board = JSON.parse(JSON.stringify(board));
      } catch {
        console.log("Err msg to user here");
        this.$router.push("/user/dashboard");
      }
    }
  },
  computed: {
    taskLists() {
      return this.$store.getters.taskLists;
    }
  },
  created() {
    const boardId = this.$route.params.boardId;
    this.getBoard(boardId)
    // Render the task details when taskId is passed as param
    const taskId = this.$route.params.taskId;
    if (taskId) this.task = this.$store.commit({type: 'getTask', taskId})
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>