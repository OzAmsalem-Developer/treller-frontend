<template>
  <menu class="board-menu">
    <div class="menu-header">
      <span>Menu</span>
    </div>
    <div class="menu" v-if="isMenuOpen.main">
      <button class="menu-btn" @click="openMenu('boardStyle')">
        <i class="far fa-image btn-icon"></i>
        <span class="btn-txt">Board Styling</span>
      </button>
      <button class="menu-btn" @click="openMenu('statistic')">
        <i class="fas fa-chart-line btn-icon"></i>
        <span class="btn-txt">Show Board Stats</span>
      </button>

      <div class="activities">
        <span class="title">Activities</span>
        <!-- Activities component here -->
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
  </menu>
</template>

<script>
import boardStyleMenu from "./board-style-menu.vue";
import boardStatistic from "./board-statistic";

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
    }
  },
  components: {
    boardStyleMenu,
    boardStatistic
  }
};
</script>

<style>
</style>