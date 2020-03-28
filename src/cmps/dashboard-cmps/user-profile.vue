<template>
  <section v-if="user">
    <div @click="$emit('closed')" class="div-screen"></div>

    <section class="user-profile">
      <button @click="$emit('closed')" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
      <header>
        <span class="sign-tasky">my Profile</span>
        <img class="sign-main-logo" src="../../assets/logo/tasky-blue.png" />
      </header>
      <hr />
      <!--  -->
      <section class="user-profile-container">
        <div class="profile-view">
          <img v-if="this.user.imgUrl" :src="this.user.imgUrl" alt />
          <div v-else :style="{backgroundColor: this.user.avatarColor}">
            <span>{{avatarTxt}}</span>
          </div>
          <div class="profile-name">
            <span>{{this.userCopy.username}}</span>
          </div>
        </div>
        <div class="profile-edit">
          <div class="profile-name-container">
            <button class="profile-name-btn" @click="toggleEditName">Edit username</button>
            <input
              v-if="isEditName"
              type="txt"
              name="profile-user-name"
              class="profile-name-input"
              v-model="userCopy.username"
            />
            <button v-if="isEditName" class="profile-name-btn" @click="updateUser">Save</button>
          </div>
          <input
            type="file"
            name="peofile-user-avatar"
            class="profile-name-input"
            @change="uploadAvatarImg"
          />
        </div>
      </section>
      <!-- <pre>{{this.user}}</pre> -->
    </section>
    <!--  -->
  </section>
</template>

<script>
import { cloudinaryService } from "@/services/cloudinary.service.js";
export default {
  data() {
    return {
      userCopy: null,
      isEditName: false
    };
  },
  methods: {
    async uploadAvatarImg(ev) {
      const imgUrl = await cloudinaryService.uploadImg(ev);
      // this.userCopy = JSON.parse(JSON.stringify(this.user));
      this.userCopy.imgUrl = imgUrl;
      this.updateUser();
    },

    async updateUser() {
      const user = await this.$store.dispatch({
        type: "updateUser",
        user: this.userCopy
      });

      this.$store.commit({
        type: "setLoggedinUser",
        user
      });
    },
    toggleEditName() {
      this.isEditName = !this.isEditName;
    }
  },
  created() {
    this.userCopy = JSON.parse(JSON.stringify(this.user));
    console.log("this.userCopy", this.userCopy);
  },
  computed: {
    avatarTxt() {
      return this.user.username.slice(0, 1).toUpperCase();
    }
  },
  props: {
    user: {
      type: Object
    }
  }
};
</script>