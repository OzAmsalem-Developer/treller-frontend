<template>
  <section>
    <div class="screen"></div>

    <section class="login-signup">
      <div class="login" v-if="isLogin">
        <h2>Login to your account</h2>
        <hr />
        <form class="login-form" @submit.prevent="login">
          <input v-modal="loginCredentials.email" type="email" placeholder="Email" />
          <input v-modal="loginCredentials.password" type="password" placeholder="Password" />
          <button class="login-btn">Login</button>
        </form>
        <div class="new">
          New ?
          <button @click="isLogin = false">Create new account</button>
        </div>
      </div>

      <div class="signup" v-else>
        <h2>Singup to FREE collaborate with other peoples</h2>
        <hr />
        <form class="signup-form" @submit.prevent="signup">
          <input v-modal="newCredentials.username" type="text" placeholder="Full name" />
          <input v-modal="newCredentials.email" type="email" placeholder="Email" />
          <input v-modal="newCredentials.password" type="password" placeholder="Password" />
          <input
            v-modal="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
          <button class="login-btn">Login</button>
        </form>
        <div class="already">
          Already have a user ?
          <button @click="isLogin = true">Login</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      loginCredentials: {
        email: "",
        password: ""
      },
      newCredentials: {
        email: "",
        username: '',
        password: "",
      },
        confirmPassword: ""
    };
  },
  methods: {
    async login() { 
      try {
        await this.$store.dispatch({ type: "login", credentials: this.loginCredentials });
        console.log("Logged in sucessfully");
      } catch {
        console.log("Try again");
      }
    },
    async signup() {
        if(this.credentials.password === this.confirmPass) {
              await this.$store.dispatch({type: 'signup', credentials})
                console.log('Signed up')
        } else {
            console.log('Wrong confirm password');
        }
    },
    closeWindow() {
        this.$store.commit({type: 'closeWindow'})
    }
  }
};
</script>
