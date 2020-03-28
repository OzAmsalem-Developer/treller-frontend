<template>
  <menu class="board-menu">
    <div class="menu-header">
      <span>Menu</span>
    </div>
    <div class="menu" v-if="isMenuOpen.main">
      <div class="menu-btn-container">
        <button class="menu-btn" @click="openMenu('boardStyle')">
          <i class="far fa-image btn-icon"></i>
          <span class="btn-txt">Board Styling</span>
        </button>
        <button class="menu-btn" @click="openMenu('statistic')">
          <i class="fas fa-chart-line btn-icon"></i>
          <span class="btn-txt">Show Board Stats</span>
        </button>
      </div>

      <div class="activities">
        <div class="title">
          <i class="far fa-list-alt title-icon"></i>
          <span class="title-txt">Activities</span>
        </div>
        <board-activities :activities="boardActivities"/>
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
      }
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
    }
  },
  computed: {
    boardActivities() {
      return this.$store.getters.currBoard.activities
    }
  },
    watch: {
    '$route'() {
      this.goBack()
    }
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