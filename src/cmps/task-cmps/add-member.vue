<template>
  <section class="invite-members">
      <header>
        <div class="title"><i class="fas fa-user-plus"></i> Add task members</div>
        <div class="close-btn" @click="$emit('closed')"><i class="fas fa-times"></i></div>
      </header>
   
      <input
        placeholder="Search member"
        v-model="searchStr"
        @input="searchUsers"
        type="text"
        class="search"
      />
    <div class="members-container">
      <div class="member" v-for="member in searchRes" @click="addMember(member)">
        <user-avatar :user="member" />
        <div class="name">{{member.username}}</div>
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus, EV_addTaskMember } from "@/services/eventBus.service";
import userAvatar from "@/cmps/main-cmps/user-avatar";

export default {
  data() {
    return {
      searchStr: "",
      searchRes: ""
    };
  },
  methods: {
    async searchUsers() {
      const searchRes = this.boardMembers.filter(user => {
        let isAlreadyMember = false
        this.task.members.forEach(member => {
          if (member._id === user._id) isAlreadyMember = true 
        })
        return !isAlreadyMember;
      });
      this.searchRes = searchRes;
    },
    addMember(member) {
      this.$emit('add-task-member', member);
    }
  },
  computed: {
    boardMembers() {
      return this.$store.getters.currBoard.members
    }
  },
  watch: {
      'task.members'() {
       this.searchUsers()
      }
  },
  created() {
    this.searchUsers();
  },
  props: {
    task: Object
  },
  components: {
    userAvatar
  }
};
</script>
