<template>
  <header class="board-header">
    <div class="board-data-container">
      <span class="board-name">{{currBoard.name}}</span>
    </div>
    <div class="members">
      <user-avatar v-for="user in currBoard.members" :key="user._id" :user="user" />
    </div>
    <div class="board-nav">
      <button @click="isInvite = !isInvite" class="nav-menu-btn"><i class="fas fa-user-plus"></i></button>
      <button @click="toggleMenu" class="nav-menu-btn"><i class="fas fa-bars"></i></button>
    </div>

    <invite-members @closed="isInvite = false" v-if="isInvite" />
    <boardMenu :class="openMenuClass" @closed="isMenuOpen = false" @update-style="updateStyle" />
  </header>
</template>

<script>
import boardMenu from "./board-menu.vue";
import inviteMembers from "./invite-members";
import userAvatar from "@/cmps/main-cmps/user-avatar";
export default {
  data() {
    return {
      isMenuOpen: false,
      isInvite: false
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    openMenuClass() {
      return this.isMenuOpen ? "open-menu" : "";
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    updateStyle(background) {
      this.$emit("update-style", background);
    }
  },
  components: {
    boardMenu,
    inviteMembers,
    userAvatar
  }
};
</script>