<template>
  <section class="main-loading">
    <div @click.stop="emitClose" class="loader-screen">
      <img class="loader-img" src="@/assets/img/loading.svg" />
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    emitClose() {
      console.log("yo!");
      this.$emit("close-loading");
    }
  }
};
</script>