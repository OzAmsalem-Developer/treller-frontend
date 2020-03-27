<template>
  <section class="main-header">
    <router-link class="logo-link" to="/">
      <div class="logo-container">
        <h1 class="main-title">tasky</h1>
        <img class="main-logo" src="../../assets/logo/tasky.png" />
      </div>
    </router-link>
    <nav class="nav-links">
      <!-- <router-link to="/about">About</router-link>-->
      <div class="login-btns" v-if="isGuest">
        <button @click="$emit('login-signup')" class="login">Login</button>
        <button @click="$emit('login-signup', true)" class="signup">Signup</button>
      </div>
      <div class="user" v-if="loggedinUser">
        <router-link class="username" :to="'/user/' + loggedinUser._id">Dashboard</router-link>
        <button @click="logout" class="logout" v-if="!isGuest">Logout</button>
      </div>
    </nav>
  </section>
</template>

<script>
export default {
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isGuest() {
      if (!this.loggedinUser) return true;
      return this.loggedinUser.isGuest;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch({ type: "logout" });
      this.$store.dispatch({ type: "getLoggedinUser" });
      this.router.push('/')
    }
  }
};
</script>