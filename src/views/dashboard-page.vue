<template>
  <section v-if="loggedinUser" class="dasboard-page">
    <header>
    <span class="icon"><i class="far fa-star"></i></span>
     <h2 class="title">My Boards</h2>
     <div class="hello center-flex">Hello {{loggedinUser.username}}</div>
    </header>
    <section class="boards">
    <board-preview  v-for="board in loggedinUser.boards" :board="board" />
    <button @click="isCreate = true" class="new-board-btn">Create new board</button>
    <create-board @board-created="createBoard" v-if="isCreate" @closed="isCreate = false"/>
    </section>

  </section>
</template>

<script>
import boardPreview from '@/cmps/board-cmps/board-preview'
import createBoard from '@/cmps/board-cmps/create-board'
export default {
  data() {
    return {
      newBoard: null,
      userCopy: null,
      isCreate: false
    };
  },
  methods: {
    async createBoard(board) {
      const minimalBoard = {
        _id: board._id,
        name: board.name,
        style: board.style
      }
      this.userCopy.boards.push(minimalBoard)
      const user = await this.$store.dispatch({type: 'updateUser' , user: this.userCopy})
      this.userCopy = JSON.parse(JSON.stringify(user))
      this.isCreate = false
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  created() {
      (async () => {
      await this.$store.dispatch({type: 'getLoggedinUser'})
      this.userCopy = JSON.parse(JSON.stringify(this.loggedinUser))
    })();
    
  },
  components: {
    boardPreview,
    createBoard
  }
};
</script>