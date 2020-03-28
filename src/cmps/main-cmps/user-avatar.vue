<template>
  <div class="avatar">
    <div class="user-avatar center-flex" :style="{background: background}">{{avatarTxt}}</div>
    <img :src="imgUrl" alt class="remove-img" @click="removeMember(user._id)" />
    <div>
      <img :src="imgUrl" alt class="remove-img" @click="$emit('member-removed', user._id)" />
    </div>
  </div>
</template>

<script>
import { utilService } from "@/services/util.service";

export default {
  computed: {
    avatarTxt() {
      return this.user.imgUrl
        ? ""
        : this.user.username.slice(0, 1).toUpperCase();
    },
    background() {
      return this.user.imgUrl
        ? `url("${this.user.imgUrl}")`
        : this.user.avatarColor
        ? this.user.avatarColor
        : utilService.getRandomColor();
    },
    imgUrl() {
      return require("@/assets/img/remove-btn.webp");
    }
  },
  props: {
    user: Object
  }
};
</script>