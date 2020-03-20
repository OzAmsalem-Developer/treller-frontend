<template>
  <section class="label-preview">
    <div class="label-card" v-for="label in labels" :key="label">
        {{label}}
    </div>
  </section>
</template>

<script>
export default {
  props: {
    labels: Array
  }
};
</script>

<style>
</style>