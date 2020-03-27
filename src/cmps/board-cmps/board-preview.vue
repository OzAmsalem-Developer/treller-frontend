<template>
  <section :style="{background: board.style.background}" class="board-preview" @click="$router.push('/board/' + board._id)">
      <h3 class="name">{{board.name}}</h3>
  </section>
</template>

<script>
export default {
    props: {
        board: Object
    }
};
</script>