<template>
  <section class="main-header">
    <h1 class="main-logo">taski</h1>
    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/board/5e7a6b94152ac30558217046">Board</router-link>
      <!-- <router-link to="/about">About</router-link>
      <router-link to="/dashboard">Dashboard</router-link>-->
      <div class="login-btns" v-if="isGuest">
          <button @click="$emit('login-signup')" class="login">Login</button>
        <button @click="$emit('login-signup', true)" class="signup">Signup</button>
      </div>
      <div class="user" v-if="loggedinUser">
        <router-link :to="'/user/' + loggedinUser._id">{{loggedinUser.username}}</router-link>
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
      if (!this.loggedinUser) return true
      return this.loggedinUser.isGuest
    }
  },
  methods: {
    logout() {
      this.$store.dispatch({type: 'logout'})
      this.$store.dispatch({type: 'getLoggedinUser'})
    }
  }
};
</script>