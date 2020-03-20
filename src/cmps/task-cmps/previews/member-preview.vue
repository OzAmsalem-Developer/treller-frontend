<template>
  <section class="member-preview">
    <div class="member-card" v-for="member in members" :key="member._id">
      <span class="member-card-name">{{member.fullName.charAt(0)}}</span>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    nameFirstLetter() {
      return member.fullName.charAt(0);
    }
  },
  props: {
    members: Array
  }
};
</script>

<style>
</style>