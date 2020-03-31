<template>
  <section class="main-header">
    <div v-if="isMenuOpen" @click="closeMenu" class="div-screen"></div>
    <nav class="main-nav">
      <router-link class="logo-link" to="/">
        <div class="logo-container">
          <h1 class="main-title">tasky</h1>
          <img class="main-logo" src="../../assets/logo/tasky.png" />
        </div>
      </router-link>
      <div class="menu-container">
        <div class="nav-links" :class="menuState">
          <div class="login-btns" v-if="isGuest">
            <button @click="emitLoginSignup(false)" class="login mobile-nav">Login</button>
            <button @click="emitLoginSignup(true)" class="signup mobile-nav">Signup</button>
          </div>
          <router-link
            v-if="loggedinUser"
            @click.native="closeMenu"
            class="dashboard-nav-btn mobile-nav"
            :to="'/user/' + loggedinUser._id"
          >Dashboard</router-link>
          <div class="user logout-container" v-if="loggedinUser">
            <button @click="logout" class="logout mobile-nav" v-if="!isGuest">Logout</button>
          </div>
        </div>
        <button class="menu-btn" ref="menubtn" @click="toggleMenu">
          <i class="far fa-compass"></i>
        </button>
        <user-avatar class="nav-avatar" :user="loggedinUser" v-if="loggedinUser" />
      </div>
    </nav>
  </section>
</template>

<script>
import userAvatar from "@/cmps/main-cmps/user-avatar";

export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isGuest() {
      if (!this.loggedinUser) return true;
      return this.loggedinUser.isGuest;
    },
    menuState() {
      return this.isMenuOpen ? "main-menu-open" : "";
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch({ type: "logout" });
      this.$router.push("/");
      this.$store.dispatch({ type: "getLoggedinUser" });
      this.closeMenu();
    },
    emitLoginSignup(val) {
      this.$emit("login-signup", val);
      this.closeMenu();
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  },
  components: {
    userAvatar
  }
};
</script>