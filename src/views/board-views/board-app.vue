<template>
  <main class="board-app" v-if="board">
    <board-header></board-header>
    <div ref="lists" class="lists-container">
      <Container
        @drop="onDrop"
        drag-handle-selector=".list-header"
        orientation="horizontal"
        :drop-placeholder="placeholderOpts"
        drag-class="list-dragging"
        drop-class="list-dropping"
      >
        <Draggable v-for="(list,idx) in taskLists" :key="list.id">
          <task-list
            v-if="list"
            :taskList="list"
            :key="list.id"
            :listIdx="idx"
            @save-list="saveTaskList"
            @save-lists-order="saveListsOrder"
            @list-moved="moveList"
          />
        </Draggable>

        <section class="add-list">
           <transition name="fade">
          <button class="add-list-btn" v-if="!newTaskList" @click="getEmptyList">
            <i class="fas fa-plus plus-icon"></i> Add List</button>
             </transition>
            <transition name="fade">
          <form class="add-list" @submit.prevent="addList" v-if="newTaskList">
            <input
              ref="listInput"
              type="text"
              class="add-list-input"
              placeholder="List title.."
              v-model="newTaskList.name"
              @blur="$refs.submitBtn.click()"
            />
            <button ref="submitBtn" class="add-list-inner-btn">Add</button>
            <button @click="newTaskList = null" class="close-btn"><i class="fas fa-times"></i></button>
          </form>
          </transition>
        </section>
      </Container>
    </div>
    <task-details v-if="!isTaskLoad && isTaskDetailsOpen" @move-task="moveTask" />
  </main>
</template>

<script>
import boardHeader from "@/cmps/board-cmps/board-header";
import taskList from "@/cmps/list-cmps/task-list";
import taskDetails from "@/cmps/task-cmps/task-details";
import { boardService } from "@/services/board.service";
import { utilService } from "@/services/util.service";
import { Container, Draggable } from "vue-smooth-dnd";
import { socketService } from "@/services/socket.service.js";
import {
  eventBus,
  EV_removeList,
  EV_moveTask
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      board: null,
      newTaskList: null,
      isTaskDetailsOpen: false,
      isTaskLoad: false,
      draggingListIdx: null,
      placeholderOpts: {
        className: "list-drop-preview",
        animationDuration: "150",
        showOnTop: false
      }
    };
  },
  methods: {
    async loadBoardAndTask(boardId) {
      const board = await this.$store.dispatch({ type: "loadById", boardId });
      try {
        this.board = JSON.parse(JSON.stringify(board));
        const taskId = this.$route.params.taskId;
        if (taskId) {
          this.$store.commit({ type: "setTaskById", taskId });
          isTaskDetailsOpen = true
        } else {
           isTaskDetailsOpen = false
        }
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
      socketService.emit("board boardChanged", this.board);
    },
    addList() {
      if (!this.newTaskList) return
      if (!this.newTaskList.name.length) {
        this.newTaskList = null;
        return;
      }
      this.board.taskLists.push(this.newTaskList);
      this.saveBoard();
      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(this.$refs.lists, 1500, 700);
      }, 2);
    },
    moveList({ listIdx, toIdx }) {
      const taskList = JSON.parse(
        JSON.stringify(this.board.taskLists[listIdx])
      );
      this.board.taskLists.splice(listIdx, 1);
      this.board.taskLists.splice(toIdx, 0, taskList);
      this.saveBoard();
    },
    onDrop(dropResult) {
      this.board.taskLists = utilService.applyDrag(
        this.board.taskLists,
        dropResult
      );
      this.saveBoard();
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
    saveListsOrder(taskList) {
      const idx = this.board.taskLists.findIndex(tl => tl.id === taskList.id);
      if (idx !== -1) this.board.taskLists.splice(idx, 1, taskList);
      if (idx === this.board.taskLists.length - 1) this.saveBoard();
    },
    moveTask({ fromListId, toListId, taskId }) {
      console.log(fromListId)
      this.isTaskLoad = true
      const fromTaskList = this.board.taskLists.find(tl => tl.id === fromListId);
      console.log(fromTaskList)
      if (!fromTaskList) return
      let taskIdx;
      const task = fromTaskList.tasks.find((t, idx) => {
        if (t.id === taskId) {
          taskIdx = idx;
          return true;
        }
      });
      fromTaskList.tasks.splice(taskIdx, 1);

      console.log('TASK:' , task)
      const toTaskList = this.board.taskLists.find(tl => tl.id === toListId);
      if (!task) return
      toTaskList.tasks.push(task);
      this.saveBoard();
    },
    updateBoard(board) {
      this.$store.commit({ type: "setCurrBoard", board });
      this.board = JSON.parse(JSON.stringify(this.storeBoard));
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

    (async () => {
      await this.loadBoardAndTask(boardId); // Render the task details when taskId is passed as param
      // Socket updates
      socketService.setup();
      socketService.emit("board topic", this.board._id);
      socketService.on("board boardChanged", this.updateBoard);
    })();

    //Event Bus
    eventBus.$on(EV_removeList, this.removeList);
    eventBus.$on(EV_moveTask, this.moveTask);
  },
  destroyed() {
    eventBus.$off(EV_removeList, this.removeList);
    eventBus.$off(EV_moveTask, this.moveTask);
  },
  components: {
    boardHeader,
    taskList,
    taskDetails,
    Container,
    Draggable
  }
};
</script>