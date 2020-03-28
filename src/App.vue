<template>
  <div id="app">
    <login-signup
      v-if="isLoginSignup"
      :isLogin="isLogin"
      @closed="isLoginSignup = false; isLogin = true"
    />
    <main-header @login-signup="openLoginSignup" />
    <router-view class="view" />
  </div>
</template>

<script>
import mainHeader from "@/cmps/main-cmps/main-header.vue";
import loginSignup from "@/cmps/main-cmps/login-signup.vue";
export default {
  data() {
    return {
      isLoginSignup: false,
      isLogin: true
    };
  },
  methods: {
    openLoginSignup(isSignup) {
      if (isSignup) this.isLogin = false;
      this.isLoginSignup = true;
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    }
  },
  created() {
    this.$store.dispatch({type: 'getLoggedinUser'})
  },
  components: {
    mainHeader,
    loginSignup
  }
};
</script>
