<template>
  <header class="board-header">
    <div class="board-nav">
      <div class="board-data-container">
        <span class="board-name">{{boardName}}</span>
      </div>
      <button @click="toggleMenu" class="menu-btn">Menu</button>
    </div>

    <!-- v-show="isMenuOpen" -->
    <boardMenu 
    :class="openMenuClass"
    @closed="isMenuOpen = false"
    @update-style="updateStyle"
    />
  </header>
</template>

<script>
import boardMenu from './board-menu.vue'
export default {
  data() {
    return {
      isMenuOpen : false
    }
  },
  computed: {
    boardName() {
      return this.$store.getters.currBoard.name
    },
    openMenuClass(){
      return (this.isMenuOpen)? 'open-menu' : ''
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
   },
   updateStyle(background){
     this.$emit('update-style', background)
   }
  },
  components: {
    boardMenu
  }
}
</script>