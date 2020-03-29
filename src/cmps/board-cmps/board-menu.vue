<template>
  <menu class="board-menu">
    <div class="menu-header">
      <span>Menu</span>
    </div>
    <div class="menu" v-if="isMenuOpen.main" >
      <div class="menu-btn-container">
        <button class="menu-btn" @click="openMenu('boardStyle')">
          <i class="far fa-image btn-icon"></i>
          <span class="btn-txt">Board styling</span>
        </button>
        <button class="menu-btn" @click="openMenu('statistic')">
          <i class="fas fa-chart-line btn-icon"></i>
          <span class="btn-txt">Show board stats</span>
        </button>
        <button class="menu-btn remove" @click="alertDisplay()">
          <i class="far fa-trash-alt btn-icon"></i>
          <span class="btn-txt">Remove board</span>
        </button>
      </div>

      <div class="activities">
        <div class="title">
          <i class="far fa-list-alt title-icon"></i>
          <span class="title-txt">Activities</span>
        </div>
        <board-activities :activities="boardActivities" />
      </div>
    </div>

    <boardStyleMenu
      v-if="isMenuOpen.boardStyle"
      @closed="closeMenu('boardStyle')"
      @update-style="updateStyle"
    />
    <boardStatistic
      v-if="isMenuOpen.statistic"
      @closed="closeMenu('statistic')"
      @update-style="updateStyle"
    />
    <button class="close-btn" v-if="isMenuOpen.main" @click="goBack">
      <i class="fas fa-times"></i>
    </button>
  </menu>
</template>

<script>
import boardStyleMenu from "./board-style-menu.vue";
import boardStatistic from "./board-statistic";
import boardActivities from "./board-activities";

export default {
  data() {
    return {
      isMenuOpen: {
        main: true,
        boardStyle: false,
        statistic: false
      },
      loggedUser: null
    };
  },
  methods: {
    openMenu(menuKey) {
      this.isMenuOpen.main = false;
      this.isMenuOpen[menuKey] = true;
    },
    closeMenu(menuKey) {
      this.isMenuOpen[menuKey] = false;
      this.isMenuOpen.main = true;
    },
    updateStyle(background) {
      this.$emit("update-style", background);
    },
    goBack() {
      this.$emit("closed");
    },
    async removeBoard() {
      return await this.$store.dispatch({
        type: "removeBoard",
        boardId: this.currBoardId
      });
    },
    alertDisplay() {
      if (this.currBoardId === '5e7f569207836732d8037f5a'){
        return this.$swal("You are not allowed to remove this board", "This is a public board", "warning");
      }
      this.$swal({
        title: "Are you sure?",
        text: "You can't revert your action",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes Delete it!",
        cancelButtonText: "No, Keep it!",
        showCloseButton: true,
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.value) {
          this.removeBoard().then(boardId => {
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            const idx = user.boards.findIndex(board => board._id === boardId);
            if (idx !== -1) {
              user.boards.splice(idx, 1);
              (async () => {
                await this.$store.dispatch({ type: "updateUser", user });
                this.$router.push(`/user/${this.loggedUser._id}`);
                this.$swal(
                  "Deleted",
                  "You successfully deleted this board",
                  "success"
                );
              })();
            }
          });
        } else {
          this.$swal("Cancelled", "Your board is still intact", "info");
        }
      });
    }
  },
  computed: {
    boardActivities() {
      return this.$store.getters.currBoard.activities;
    },
    currBoardId() {
      return this.$store.getters.currBoard._id;
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    isMobile() {
      return true
    }
  },
  watch: {
    $route() {
      this.goBack();
    }
  },
  created() {
    this.loggedUser = JSON.parse(JSON.stringify(this.loggedInUser));
  },
  components: {
    boardStyleMenu,
    boardStatistic,
    boardActivities
  }
};
</script>

<style>
</style>