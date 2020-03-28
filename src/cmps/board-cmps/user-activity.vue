<template>
  <section class="user-activity">
    <div class="from-operation">
      <user-avatar :user="activity.from" />
      
      <div class="operation"> <span class="user-name">{{activity.from.username}}</span> 
      {{activity.operation}}</div>
    </div>
    <router-link class="task-link"
        v-if="activity.taskId"
        :to="'/board/' + currBoardId + '/task/' + activity.taskId"
      >Visit now</router-link>
    <div class="time">{{activity.createdAt | dateAgo}}</div>
  </section>
</template>

<script>
import userAvatar from "@/cmps/main-cmps/user-avatar";

export default {
  computed: {
    currBoardId() {
      return this.$store.getters.currBoard._id;
    }
  },
  props: {
    activity: Object
  },
  components: {
    userAvatar
  }
};
</script>

<style>
</style>