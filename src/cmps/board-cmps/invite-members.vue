<template>
  <section class="invite-members">
      <header>
        <div class="title"><i class="fas fa-user-plus"></i> Invite members</div>
        <div class="close-btn" @click="$emit('closed')"><i class="fas fa-times"></i></div>
      </header>

  <div class="toggle">
     <toggle-button :width="35" :height="18" @change="searchUsers"
       v-model="isRegisteredOnly"/>
     <span>Only registered</span>
  </div>

  <div class="search-input-wrapper">
      <input
        placeholder="User name or email"
        v-model="searchStr"
        @input="searchUsers"
        type="text"
        class="search"
      />
      <div class="icon">
        <i class="fa fa-search"></i>
      </div>
  </div>

    <div class="members-container">
      <div class="member" v-for="member in searchRes" @click="addMember(member)">
        <user-avatar :user="member" />
        <div class="name">{{member.username}}</div>
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus, EV_addMember } from "@/services/eventBus.service";
import userAvatar from "@/cmps/main-cmps/user-avatar";

export default {
  data() {
    return {
      searchStr: "",
      searchRes: "",
      isRegisteredOnly: false
    };
  },
  methods: {
    async searchUsers() {
      const users = await this.$store.dispatch({
        type: "loadUsers",
        searchStr: this.searchStr
      });
      const searchRes = users.filter(user => {
        const currBoard = user.boards.find(
          board => board._id === this.currBoard._id
        );
        return currBoard ? false : true;
      });
      if (this.isRegisteredOnly) {
        this.searchRes = searchRes.filter(user => !user.isGuest)
        return
      }
      this.searchRes = searchRes;
    },
    addMember(member) {
      const user = JSON.parse(JSON.stringify(member));
      user.boards.push({
        _id: this.currBoard._id,
        style: this.currBoard.style,
        name: this.currBoard.name
      });
      this.$store.dispatch({ type: "updateUser", user });
      eventBus.$emit(EV_addMember, member);
    }
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    }
  },
  watch: {
      'currBoard.members'() {
       this.searchUsers()
      }
  },
  created() {
    this.searchUsers();
  },
  components: {
    userAvatar
  }
};
</script>
