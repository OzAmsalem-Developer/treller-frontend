<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div ref="lists" class="lists-container">
      <task-list
        v-for="(list,idx) in taskLists"
        :taskList="list"
        :key="list.id"
        :listIdx="idx"
        @save-list="saveTaskList"
        @list-moved="moveList"
        @listdrag-start="onListDragStart"
        @list-dropped="onListDropped"
      />
      <section class="add-list">
        <button class="add-btn" @click="getEmptyList">+Add List</button>
        <form class="add-list" @submit.prevent="addList" v-if="newTaskList">
          <input ref="listInput" type="text" placeholder="List title.." v-model="newTaskList.name" />
          <button>Add</button>
        </form>
      </section>
    </div>
    <task-details v-if="!isTaskLoad && currTask" />
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/list-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";
import { boardService } from "@/services/board.service";
import { utilService } from "@/services/util.service";
import {
  eventBus,
  EV_removeList,
  EV_saveFailed,
  EV_moveTask
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      board: null,
      newTaskList: null,
      isTaskLoad: false,
      draggingListIdx: null
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
        this.board = JSON.parse(JSON.stringify(this.storeBoard));
        console.log("CMP: Board Saved Succesfully");
      } catch (prevBoard) {
        this.board = JSON.parse(JSON.stringify(board));
        console.log("Err, board didnt saved");
        throw new Error("Saving failed");
      }
    },
    addList() {
      if (!this.newTaskList.name.length) return;
      this.board.taskLists.push(this.newTaskList);
      this.saveBoard();
      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(this.$refs.lists, 1500, 700);
      }, 0);
    },
    moveList({ listIdx, toIdx }) {
      const taskList = JSON.parse(JSON.stringify(this.board.taskLists[listIdx]))
      this.board.taskLists.splice(listIdx, 1);
      this.board.taskLists.splice(toIdx, 0, taskList);
      this.saveBoard();
    },
    onListDragStart(idx) {
      this.draggingListIdx = idx
    },
    onListDropped(idx) {
      if (idx === this.draggingListIdx) return
      this.moveList({
        listIdx: this.draggingListIdx,
        toIdx: idx
      })
       this.draggingListIdx = null
    },
    removeList(listId) {
      const idx = this.board.taskLists.findIndex(list => list.id === listId);
      this.board.taskLists.splice(idx, 1);
      this.saveBoard();
    },
    saveTaskList(taskList) {
      const idx = this.board.taskLists.findIndex(tl => tl.id === taskList.id);
      if (idx !== -1) this.board.taskLists.splice(idx, 1, taskList);
      this.saveBoard();
    },
    moveTask({ from, to, taskId }) {
      const fromTaskList = this.board.taskLists.find(tl => tl.id === from);
      let taskIdx;
      const task = fromTaskList.tasks.find((t, idx) => {
        if (t.id === taskId) {
          taskIdx = idx;
          return true;
        }
      });
      fromTaskList.tasks.splice(taskIdx, 1);

      const toTaskList = this.board.taskLists.find(tl => tl.id === to);
      toTaskList.tasks.push(task);
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
    },
    storeBoard() {
      return this.$store.getters.currBoard;
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
    eventBus.$on(EV_removeList, this.removeList);
    eventBus.$on(EV_moveTask, this.moveTask);
  },
  components: {
    boardHeader,
    taskList,
    taskDetails
  }
};
</script>