<template>
  <section v-if="editedUser">
    <div @click="$emit('closed')" class="div-screen"></div>
    <section class="user-profile">
      <mainLoading v-if="isLoading" />
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
          <img
            v-if="this.editedUser.imgUrl"
            :src="this.editedUser.imgUrl"
            alt
          />
          <div
            class="text-avatar"
            v-else
            :style="{ backgroundColor: this.editedUser.avatarColor }"
          >
            <span>{{ avatarTxt }}</span>
          </div>
          <div class="profile-name">
            <span>{{ this.editedUser.username }}</span>
          </div>
        </div>
        <div class="profile-edit">
          <label class="profile-menu-btn" for="profile-user-avatar"
            >Edit profile image</label
          >
          <input
            type="file"
            id="profile-user-avatar"
            class="profile-img-input"
            @change="uploadAvatarImg"
          />
          <button
            class="profile-menu-btn profile-name-btn"
            @click="toggleEditName"
          >
            Edit username
          </button>
          <div class="profile-name-container" v-show="isEditName">
            <input
              type="txt"
              name="profile-user-name"
              class="profile-name-input"
              ref="editname"
              v-model="editedUser.username"
            />
            <button class="profile-save-btn" @click="updateUsername">
              Save
            </button>
            <button class="profile-cancel-btn" @click="toggleEditName">
              Cancel
            </button>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import { cloudinaryService } from "@/services/cloudinary.service.js";
import mainLoading from "@/cmps/main-cmps/main-loading.vue";
export default {
  data() {
    return {
      editedUser: null,
      isEditName: false,
      isLoading: false,
    };
  },
  methods: {
    async uploadAvatarImg(ev) {
      this.isLoading = true;
      const imgUrl = await cloudinaryService.uploadImg(ev);
      try {
        this.editedUser.imgUrl = imgUrl;
        this.isLoading = false;
        this.updateUser();
      } catch (err) {
        console.log("err, failed to upload image", err);
        this.isLoading = false;
      }
    },
    async updateUsername() {
      await this.updateUser();
      this.toggleEditName();
    },
    async updateUser() {
      const user = await this.$store.dispatch({
        type: "updateUser",
        user: this.editedUser,
      });

      this.$store.commit({
        type: "setLoggedinUser",
        user,
      });
      this.editedUser = JSON.parse(JSON.stringify(this.loggedInUser));
    },
    toggleEditName() {
      this.isEditName = !this.isEditName;
      if (this.isEditName) this.$refs.editname.focus();
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    avatarTxt() {
      return this.editedUser.username.slice(0, 1).toUpperCase();
    },
  },
  created() {
    this.editedUser = JSON.parse(JSON.stringify(this.loggedInUser));
  },
  components: {
    mainLoading,
  },
};
</script>