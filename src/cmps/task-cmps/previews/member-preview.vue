<template>
  <section class="member-preview">
    <div class="member-card" v-for="member in members" :key="member._id" @click.stop="selectMember(member)">
      <div class="member-card-name">{{member.fullName.charAt(0)}}</div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    selectMember(member) {
      console.log('Member selected:', member.fullName)
    }
  },
  props: {
    members: Array
  }
};
</script>