<template>
  <section>
    <div @click="$emit('closed')" class="div-screen"></div>

    <section class="login-signup">
      <button @click="$emit('closed')" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
      <div class="page" v-if="isLoginPage">
        <header>
          <h2>Login to</h2>
          <span class="sign-tasky">tasky</span>
          <img class="sign-main-logo" src="../../assets/logo/tasky-blue.png" />
        </header>
        <hr />
        <form class="login-form" @submit.prevent="login">
          <input v-model="loginCredentials.email" type="email" placeholder="Email" required />
          <input
            v-model="loginCredentials.password"
            type="password"
            placeholder="Password"
            required
          />
          <button class="send-btn save-btn">Login</button>
        </form>
        <div class="switch">
          New ?
          <button @click="isLoginPage = false">Create new account</button>
        </div>
      </div>

      <div class="page" v-else>
        <header>
          <h2>Singup to</h2>
          <span class="sign-tasky">tasky</span>
          <img class="sign-main-logo" src="../../assets/logo/tasky-blue.png" />
          <button @click="$emit('closed')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <hr />
        <form class="signup-form" @submit.prevent="signup">
          <input v-model="newCredentials.username" type="text" placeholder="Full name" required />
          <input v-model="newCredentials.email" type="email" placeholder="Email" required />
          <input v-model="newCredentials.password" type="password" placeholder="Password" required />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
          <button class="send-btn save-btn">Signup</button>
        </form>
        <div class="switch">
          Already have a user ?
          <button @click="isLoginPage = true">Login</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoginPage: true,
      loginCredentials: {
        email: "",
        password: ""
      },
      newCredentials: {
        email: "",
        username: "",
        password: ""
      },
      confirmPassword: ""
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch({
          type: "login",
          credentials: this.loginCredentials
        });
        console.log("Logged in sucessfully");
        this.$emit("closed");
      } catch {
        console.log("Try again");
      }
    },
    async signup() {
      if (
        !this.newCredentials.email.length ||
        !this.newCredentials.password.length
      ) {
        this.$emit("closed");
        return;
      }
      if (this.newCredentials.password === this.confirmPassword) {
        await this.$store.dispatch({
          type: "signup",
          credentials: this.newCredentials
        });
        console.log("Signed up");
        this.$emit("closed");
      } else {
        console.log("Wrong confirm password");
      }
    },
    closeWindow() {
      this.$store.commit({ type: "closeWindow" });
    }
  },
  created() {
    this.isLoginPage = this.isLogin;
  },
  props: {
    isLogin: Boolean
  }
};
</script>
