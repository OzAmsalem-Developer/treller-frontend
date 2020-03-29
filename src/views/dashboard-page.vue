<template>
  <section v-if="loggedinUser" class="dasboard-page">
    <user-profile @closed="toggleUserProfile" v-if="isUserProfile"/>
    <header>
      <span class="icon">
        <i class="far fa-star"></i>
      </span>
      <h2 class="title">My Boards</h2>
      <div class="user-profile-container">
        <button class="hello center-flex" @click="toggleUserProfile">Hello, {{loggedinUser.username}}</button>
      </div>
    </header>
    <section class="boards">
      <board-preview v-for="board in loggedinUser.boards" :key="board._id" :board="board" />
      <button @click="isCreate = true" class="new-board-btn">Create new board</button>
      <create-board @board-created="createBoard" v-if="isCreate" @closed="isCreate = false" />
    </section>
  </section>
</template>

<script>
import userProfile from "@/cmps/dashboard-cmps/user-profile";
import boardPreview from "@/cmps/board-cmps/board-preview";
import createBoard from "@/cmps/board-cmps/create-board";
export default {
  data() {
    return {
      newBoard: null,
      userCopy: null,
      isCreate: false,
      isUserProfile: false
    };
  },
  methods: {
    async createBoard(board) {
      const minimalBoard = {
        _id: board._id,
        name: board.name,
        style: board.style
      };
      this.userCopy.boards.push(minimalBoard);
      const user = await this.$store.dispatch({
        type: "updateUser",
        user: this.userCopy
      });
      this.$store.commit({ type: "setLoggedinUser", user });
      this.userCopy = JSON.parse(JSON.stringify(user));
      this.isCreate = false;
    },
    toggleUserProfile() {
      this.isUserProfile = !this.isUserProfile
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  created() {
    (async () => {
      await this.$store.dispatch({ type: "getLoggedinUser" });
      this.userCopy = JSON.parse(JSON.stringify(this.loggedinUser));
    })();
  },
  components: {
    userProfile,
    boardPreview,
    createBoard
  }
};
</script>