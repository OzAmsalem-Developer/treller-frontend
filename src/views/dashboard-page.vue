<template>
  <section class="dasboard-page">
      <h1>Dasboard-Page</h1>
  </section>
</template>

<script>
export default {
  computed: {
    loggeninUser() {
      this.$store.getters.loggedinUser
    }
  },
  created() {
    userId = this.$route.params.userId
    if (!userId) {
      if (loggeninUser) {
        this.$router.push('/user/dashboard/' + loggeninUser._id)
      }
    }

    // Now get user etc..
  }
}
</script>