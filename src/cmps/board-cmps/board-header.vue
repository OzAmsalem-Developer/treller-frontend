<template>
  <header class="board-header">
      <h1>{{boardName}}</h1>
  </header>
</template>

<script>
export default {
  computed: {
    boardName() {
      return this.$store.getters.currBoard.name
    }
  }
}
</script>