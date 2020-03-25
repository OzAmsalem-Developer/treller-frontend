<template>
  <header class="board-header">
    <div class="board-nav">
      <div class="board-data-container">
        <h3>{{boardName}}</h3>
      </div>
      <button @click="toggleMenu" class="boarn-menu-btn">Menu</button>
    </div>

    <boardMenu 
    v-if="isMenuOpen"
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
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
   }
  },
  components: {
    boardMenu
  }
}
</script>