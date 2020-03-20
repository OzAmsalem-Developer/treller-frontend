<template>
  <main class="board-app" v-if="board" ref="boardApp">
    <board-header></board-header>
    <div class="lists-container">
      <task-list v-for="list in taskLists" :taskList="list" :key="list.id"></task-list>
      <section class="add-list">
        <button class="add-btn" ref="addListBtn" @click="getEmptyList">+Add List</button>
        <form class="moveToCMP" @submit.prevent="addList" v-if="newTaskList">
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
      this.board.taskLists.push(this.newTaskList);
      this.saveBoard();
      this.newTaskList = null;
      this.getEmptyList();
      setTimeout(() => {
        
        this.scrollTo(document.querySelector('html'), 1500, 700)
      }, 0);

    },
     scrollTo(element, scrollPixels, duration) {
      const scrollPos = element.scrollLeft;
      // Condition to check if scrolling is required
      if ( !( (scrollPos === 0 || scrollPixels > 0) && (element.clientWidth + scrollPos === element.scrollWidth || scrollPixels < 0))) 
      {
        // Get the start timestamp
        const startTime =
          "now" in window.performance
            ? performance.now()
            : new Date().getTime();
        
        function scroll(timestamp) {
          //Calculate the timeelapsed
          const timeElapsed = timestamp - startTime;
          //Calculate progress 
          const progress = Math.min(timeElapsed / duration, 1);
          //Set the scrolleft
          element.scrollLeft = scrollPos + scrollPixels * progress;
          //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
          if (timeElapsed < duration) {
            //Request for animation
            window.requestAnimationFrame(scroll);
          } else {
            return;
          }
        }
        //Call requestAnimationFrame on scroll function first time
        window.requestAnimationFrame(scroll);
      }
    },
    getEmptyList() {
      this.newTaskList = boardService.getEmptyList();
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