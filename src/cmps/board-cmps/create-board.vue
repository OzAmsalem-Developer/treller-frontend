<template>
  <section>
    <div @click="$emit('closed')" class="div-screen"></div>
    <section class="create-board" :style="style" ref="createCmp">
        <form  @submit.prevent="createBoard">
          <input ref="newBoardInput" v-model="newBoard.name" placeholder="Board title.." type="text" />
          <button class="save-btn">Create board</button>
        </form>
      <button
        @click="isColorOpen = !isColorOpen; isImgOpen = false"
        class="set-style-btn save-btn"
      >Background color</button>
      <button
        @click="isImgOpen = !isImgOpen; isColorOpen = false"
        class="set-style-btn save-btn"
      >Background image</button>

      <board-img-picker v-if="isImgOpen" @closed="isImgOpen = false" @set-board-img="setBg" />
      <board-color-picker v-if="isColorOpen" @set-board-color="setBg" @closed="isImgOpen = false" />
    </section>
  </section>
</template>

<script>
import { boardService } from "@/services/board.service";
import boardColorPicker from "./board-color-picker";
import boardImgPicker from "./board-img-picker";
export default {
  data() {
    return {
      newBoard: null,
      isColorOpen: false,
      isImgOpen: false
    };
  },
  methods: {
    setBg(background) {
      console.log(background);

      this.newBoard.style.background = background
      this.$refs.createCmp.style["background"] = background;
      this.$refs.createCmp.style["background-size"] = 'cover';
    },
    async createBoard() {
      if (!this.newBoard.name.length) return
      this.newBoard.members.push(this.$store.getters.loggedinUser);
      const board = await this.$store.dispatch({
        type: "createBoard",
        board: this.newBoard
      });
      this.$emit("board-created", board);
      this.newBoard = boardService.getEmptyBoard();
    }
  },
  computed: {
      style() {
        return {
          backgroundImage: this.newBoard.style.background,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
      } 
    }
  },
  mounted() {
    this.$refs.newBoardInput.focus()
  },
  created() {
    this.newBoard = boardService.getEmptyBoard();
  },
  components: {
    boardColorPicker,
    boardImgPicker
  }
};
</script>