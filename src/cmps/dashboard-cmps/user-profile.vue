<template>
  <section v-if="userCopy">
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
      <section class="user-profile-container">
        <div class="profile-view">
          <img v-if="this.userCopy.imgUrl" :src="this.userCopy.imgUrl" alt />
          <div v-else :style="{backgroundColor: this.userCopy.avatarColor}">
            <span>{{avatarTxt}}</span>
          </div>
          <div class="profile-name">
            <span>{{this.userCopy.username}}</span>
          </div>
        </div>
        <div class="profile-edit">
          <label class="profile-menu-btn" for="profile-user-avatar">Edit profile image</label>
          <input
            type="file"
            id="profile-user-avatar"
            class="profile-img-input"
            @change="uploadAvatarImg"
          />
          <button class="profile-menu-btn profile-name-btn" @click="toggleEditName">Edit username</button>
          <div class="profile-name-container" v-if="isEditName">
            <input
              type="txt"
              name="profile-user-name"
              class="profile-name-input"
              v-model="userCopy.username"
            />
            <button class="profile-save-btn" @click="updateUsername">Save</button>
            <button class="profile-cancel-btn" @click="toggleEditName">Cancel</button>
          </div>
        </div>
      </section>
    </section>
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
    async updateUsername() {
      await this.updateUser();
      this.toggleEditName();
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
      return this.userCopy.username.slice(0, 1).toUpperCase();
    }
  },
  props: {
    user: {
      type: Object
    }
  }
};
</script>