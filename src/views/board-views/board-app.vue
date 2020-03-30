<template>
  <main class="board-app" v-if="board && backgroundStyle" :style="backgroundStyle">
    <board-header @update-style="updateStyle"></board-header>
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
              <i class="fas fa-plus plus-icon"></i>
              <span>Add List</span>
            </button>
          </transition>
          <transition name="fade">
            <form
              class="add-list"
              @keyup.enter="isListSaved = false"
              @submit.prevent="addList"
              v-if="newTaskList"
            >
              <input
                ref="listInput"
                type="text"
                class="add-list-input"
                placeholder="List title.."
                v-model="newTaskList.name"
                @blur="blurAddList"
              />
              <div class="btns">
                <button ref="addListBtn" class="add-list-inner-btn">Add</button>
                <button @click="newTaskList = null" class="close-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
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
  EV_moveTask,
  EV_addMember,
  EV_removeMember,
  EV_updateBoardLabels,
  EV_addActivity,
  EV_boardLabelsSaved
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      board: null,
      newTaskList: null,
      isTaskDetailsOpen: false,
      isTaskLoad: false,
      isListSaved: false,
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
          this.isTaskDetailsOpen = true;
        } else {
          this.isTaskDetailsOpen = false;
        }
        this.isTaskLoad = false;
      } catch {
        const user = JSON.parse(JSON.stringify(this.loggedinUser))
        const idx = user.boards.findIndex(board => board._id === this.board._id)
        if (idx !== -1) {
          user.boards.splice(idx, 1)
          let updatedUser = await this.$store.dispatch({type: 'updateUser', user})
          this.$store.commit({type: 'setLoggedinUser', user: updatedUser})
          this.$router.push("/user/" + updatedUser._id);
        }
        console.log("Err msg to user here");
      }
    },
    async saveBoard() {
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
      try {
        this.board = JSON.parse(JSON.stringify(this.storeBoard));
        console.log("CMP: Board Saved Succesfully");
        socketService.emit("board boardChanged", this.board);
        return this.board;
      } catch (prevBoard) {
        this.board = JSON.parse(JSON.stringify(board));
        console.log("Err, board didnt saved");
        throw new Error("Saving failed");
      }
    },
    addList(ev) {
      if (!this.newTaskList) return;
      this.isListSaved = true;
      if (!this.newTaskList.name.length) {
        this.newTaskList = null;
        return;
      }
      this.board.taskLists.push(this.newTaskList);
      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "added new list " + `"${this.newTaskList.name}"`
      });
      this.saveBoard();
      console.log(this.board);

      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(this.$refs.lists, 1500, 700);
      }, 2);
    },
    blurAddList() {
      setTimeout(() => {
        if (this.isListSaved) {
          this.isListSaved = false;
          return;
        } else {
          if (this.newTaskList && this.newTaskList.name.length > 0) {
            this.addList();
          }
          this.newTaskList = null;
          this.isListSaved = false;
        }
      }, 150);
    },
    moveList({ listIdx, toIdx }) {
      const taskList = JSON.parse(
        JSON.stringify(this.board.taskLists[listIdx])
      );
      this.board.taskLists.splice(listIdx, 1);
      this.board.taskLists.splice(toIdx, 0, taskList);
      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "moved list " + `"${this.board.taskLists[listIdx].name}"`
      });
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
      let listName = this.board.taskLists[idx].name;
      this.board.taskLists.splice(idx, 1);
      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "removed " + `"${listName}""` + "  list"
      });
      this.saveBoard();
    },
    saveTaskList(taskList) {
      const idx = this.board.taskLists.findIndex(tl => tl.id === taskList.id);
      if (idx !== -1) this.board.taskLists.splice(idx, 1, taskList);
      this.saveBoard();
    },
    saveListsOrder(taskList) {
      
      console.log(taskList);
      // onDrop is called for each list. So save to DB only when last list is updated.
      const idx = this.board.taskLists.findIndex(tl => tl.id === taskList.id);
      if (idx !== -1) this.board.taskLists.splice(idx, 1, taskList);
      if (idx === this.board.taskLists.length - 1) {
        // console.log(idx);
        this.saveBoard();
      } 
    },
    moveTask({ toListId, taskId }) {
      var fromListId;
      const idx = this.taskLists.findIndex(taskList => {
        let matchingTask = taskList.tasks.find(task => task.id === taskId);
        return !!matchingTask;
      });
      fromListId = this.taskLists[idx].id;

      const fromTaskList = this.board.taskLists.find(
        tl => tl.id === fromListId
      );
      if (!fromTaskList) return;
      let taskIdx;
      var task = fromTaskList.tasks.find((t, idx) => {
        if (t.id === taskId) {
          taskIdx = idx;
          return true;
        }
      });

      fromTaskList.tasks.splice(taskIdx, 1);
      const toTaskList = this.board.taskLists.find(tl => tl.id === toListId);
      if (!task) return;
      toTaskList.tasks.push(task);

      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: taskId,
        operation:
          "moved task  " +
          `"${task.name}""` +
          "  to list " +
          `"${toTaskList.name}""`
      });

      this.saveBoard();
    },
    updateBoard(board) {
      this.$store.commit({ type: "setCurrBoard", board });
      this.board = JSON.parse(JSON.stringify(board));
      console.log("Board updated");
    },
    getEmptyList() {
      this.newTaskList = this.newTaskList ? null : boardService.getEmptyList();
      setTimeout(() => {
        utilService.scrollTo(document.querySelector("html"), 1500, 700);
        if (this.$refs.listInput) this.$refs.listInput.focus();
      }, 0);
    },
    async updateStyle(background) {
      if (!this.loggedinUser) return;
      const user = JSON.parse(JSON.stringify(this.loggedinUser));
      const miniBoard = user.boards.find(
        board => board._id === this.storeBoard._id
      );
      miniBoard.style.background = background;
      const savedUser = await this.$store.dispatch({
        type: "updateUser",
        user
      });

      this.$store.commit({ type: "setLoggedinUser", user: savedUser });
      this.board.style.background = background;
      this.board.style.backgroundSize = "cover";

      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "changed board background style"
      });

      this.saveBoard();
    },
    addMember(user) {
      this.board.members.push(user);
      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "invited " + user.username + " to this board"
      });
      this.saveBoard();
    },
    removeMember(userId) {
      const idx = this.board.members.findIndex(m => m._id === userId);
      const userName = this.board.members[idx].username;
      this.board.members.splice(idx, 1);
      this.board.activities.unshift({
        from: this.loggedinUser,
        createdAt: Date.now(),
        taskId: null,
        operation: "remove " + userName + " from this board"
      });
      this.saveBoard();
    },
    async updateBoardLabels(labels) {
      this.board.labels = labels;
      let newCurrTask;
      this.board.taskLists.forEach(taskList => {
        taskList.tasks.forEach(task => {
          const newTaskLabels = task.labels.map(label => {
            const updatedLabel = labels.find(l => l.id === label.id);
            return updatedLabel;
          });
          task.labels = newTaskLabels;
          if (this.currTask && task.id === this.currTask.id)
            newCurrTask = JSON.parse(JSON.stringify(task));
        });
      });
      if (this.currTask) {
        await this.$store.dispatch({ type: "updateTask", task: newCurrTask });
      }
      const savedBoard = await this.saveBoard();
      eventBus.$emit(EV_boardLabelsSaved, savedBoard.labels);
    },
    addActivity(activity) {
      const board = JSON.parse(JSON.stringify(this.board));
      board.activities.unshift(activity);
      // Updating the copy and the store, and waiting to the next 'saveBoard'
      // for saving to database
      this.$store.commit({ type: "setCurrBoard", board: board });
      this.board = JSON.parse(JSON.stringify(board));
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
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    backgroundColor() {
      return {
        background: this.storeBoard.style.background,
      }
    },
    backgroundImage() {
      return {
        backgroundImage: this.board.style.background,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        opacity: 0.9
    }
    },
    backgroundStyle() {
      return (this.storeBoard.style.background.charAt(0) === '#')?  //if hex color
      this.backgroundColor :
      this.backgroundImage 
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
    eventBus.$on(EV_addMember, this.addMember);
    eventBus.$on(EV_removeMember, this.removeMember);
    eventBus.$on(EV_updateBoardLabels, this.updateBoardLabels);
    eventBus.$on(EV_addActivity, this.addActivity);
  },
  destroyed() {
    eventBus.$off(EV_removeList, this.removeList);
    eventBus.$off(EV_moveTask, this.moveTask);
    eventBus.$off(EV_addMember, this.addMember);
    eventBus.$off(EV_removeMember, this.removeMember);
    eventBus.$off(EV_updateBoardLabels, this.updateBoardLabels);
    eventBus.$off(EV_addActivity, this.addActivity);
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