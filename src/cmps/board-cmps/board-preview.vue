<template>
  <section :style="style" class="board-preview" @click="$router.push('/board/' + board._id)">
      <h3 class="name">{{board.name}}</h3>
  </section>
</template>

<script>
export default {
    computed: {
        style() {
            return {
               background: this.board.style.background,
               backgroundSize: 'cover'
            } 
        }
    },
    props: {
        board: Object
    }
};
</script>