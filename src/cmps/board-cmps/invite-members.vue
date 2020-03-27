<template>
  <section class="invite-members">
        <div class="close-btn" @click="$emit('closed')"><i class="fas fa-times"></i></div>
    <header>
      <input
        placeholder="User name or email"
        v-model="searchStr"
        @input="searchUsers"
        type="text"
        class="search"
      />
    </header>
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
      searchRes: ""
    };
  },
  methods: {
    async searchUsers() {
      const users = await this.$store.dispatch({
        type: "loadUsers",
        searchStr: this.searchStr
      });
      const searchRes = users.filter(user => {
        if (!user.boards) return false;
        const currBoard = user.boards.find(
          board => board._id === this.$store.getters.currBoard._id
        );
        return currBoard ? false : true;
      });
      console.log(searchRes);

      this.searchRes = searchRes;
    },
    addMember(member) {
      eventBus.$emit(EV_addMember, member);
      const idx = this.searchRes.findIndex(m => m._id === member._id);
      this.searchRes.splice(idx, 1);
      const user = JSON.parse(JSON.stringify(member));
      user.boards.push({
        _id: this.currBoard._id,
        style: this.currBoard.style,
        name: this.currBoard.name
      });
      this.$store.dispatch({ type: "updateUser", user });
    }
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    }
  },
  watch: {
      'currBoard.members'(from, to) {
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
