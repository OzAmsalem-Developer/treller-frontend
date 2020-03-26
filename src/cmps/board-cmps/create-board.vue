<template>
<section>
     <div @click="$emit('closed')" class="div-screen"></div>
  <section class="create-board">
      <input v-model="newBoard.name" placeholder="Board title.." type="text">
        <button @click="isStyleOpen = !isStyleOpen" class="set-style-btn save-btn">Background color</button>

        <board-img-picker @set-board-img="setBg"/>
        <board-color-picker
         @set-board-color="setBg"
         @closed="isStyleOpen = false" v-if="isStyleOpen" />
  </section>
</section>
</template>

<script>
import { boardService } from "@/services/board.service";
import boardColorPicker from './board-color-picker'
export default {
    data() {
        return {
        newBoard: null,
        isStyleOpen: false
        }
    },
    methods: {
        setBg(background) {
            this.newBoard.style.background = background 
        }
    },
    created() {
        this.newBoard = JSON.parse(JSON.stringify(boardService.getEmptyBoard()))
    },
    components: {
        boardColorPicker
    }
}
</script>