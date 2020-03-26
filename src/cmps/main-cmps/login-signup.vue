<template>
  <section>
    <div @click="$emit('closed')" class="div-screen"></div>

    <section class="login-signup">
      <div class="page" v-if="isLoginPage">
        <header>
          <h2>Login to your account</h2>
          <button @click="$emit('closed')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <hr />

        <form class="login-form" @submit.prevent="login">
          <input v-model="loginCredentials.email" type="email" placeholder="Email" />
          <input v-model="loginCredentials.password" type="password" placeholder="Password" />
          <button class="send-btn save-btn">Login</button>
        </form>
        <div class="new">
          New ?
          <button @click="isLoginPage = false">Create new account</button>
        </div>
      </div>

      <div class="page" v-else>
        <header>
          <h2>Singup for FREE collaborate with other peoples</h2>
          <button @click="$emit('closed')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <hr />
        <form class="signup-form" @submit.prevent="signup">
          <input v-model="newCredentials.username" type="text" placeholder="Full name" />
          <input v-model="newCredentials.email" type="email" placeholder="Email" />
          <input v-model="newCredentials.password" type="password" placeholder="Password" />
          <input v-model="confirmPassword" type="password" placeholder="Confirm your password" />
          <button class="send-btn save-btn">Signup</button>
        </form>
        <div class="already">
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
      } catch {
        console.log("Try again");
      }
    },
    async signup() {
      if (this.newCredentials.password === this.confirmPassword) {
        await this.$store.dispatch({
          type: "signup",
          credentials: this.newCredentials
        });
        console.log("Signed up");
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
