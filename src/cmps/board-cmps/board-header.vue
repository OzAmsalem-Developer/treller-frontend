<template>
  <header class="board-header">
    <div class="board-data-container">
      <span class="board-name">{{currBoard.name}}</span>
    </div>
    <div class="members">
      <user-avatar v-for="user in currBoard.members" @member-removed="removeMember" :key="user._id" :user="user" />
    </div>
    <div class="board-nav">
      <button @click="isInvite = !isInvite" class="nav-menu-btn"><i class="fas fa-user-plus"></i></button>
      <button @click="toggleMenu" class="nav-menu-btn"><i class="fas fa-bars"></i></button>
    </div>

      <transition name="fade">
    <invite-members @closed="isInvite = false" v-if="isInvite" />
    </transition>
    <boardMenu :class="openMenuClass" @closed="isMenuOpen = false" @update-style="updateStyle" />
  </header>
</template>

<script>
import boardMenu from "./board-menu.vue";
import inviteMembers from "./invite-members";
import userAvatar from "@/cmps/main-cmps/user-avatar";
import {eventBus,EV_removeMember} from "@/services/eventBus.service";

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
    },
    async removeMember(userId) {
      const users =  await this.$store.dispatch({type: 'loadUsers'})
      const user = users.find(u => u._id === userId)
      if (!user) return
      const idx = user.boards.findIndex(board => board._id === this.$store.getters.currBoard._id)
      user.boards.splice(idx, 1)
      this.$store.dispatch({type: 'updateUser', user})
        eventBus.$emit(EV_removeMember, userId)
    },
    closeInvite() {
      this.isInvite = false
    }
  },
  mounted() {
    document.querySelector('.lists-container').addEventListener('click', this.closeInvite)
  },
  destroyed() {
    document.querySelector('.lists-container').removeEventListener('click', this.closeInvite)
  },
  components: {
    boardMenu,
    inviteMembers,
    userAvatar
  }
};
</script>