<template>
  <div class="board-color-picker">
    <button class="close-btn" @click.stop="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
    <div class="colors-container">
      <div
        class="color-card"
        :style="{'background-color': '#0079bf'}"
        @click="setBoardColor('#0079bf')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#d29034'}"
        @click="setBoardColor('#d29034')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#519839'}"
        @click="setBoardColor('#519839')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#b04632'}"
        @click="setBoardColor('#b04632')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#89609e'}"
        @click="setBoardColor('#89609e')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#cd5a91'}"
        @click="setBoardColor('#cd5a91')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#4bbf6b'}"
        @click="setBoardColor('#4bbf6b')"
      ></div>
      <div
        class="color-card"
        :style="{'background-color': '#00aecc'}"
        @click="setBoardColor('#00aecc')"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$emit("closed");
    },
    setBoardColor(color) {
      this.$emit("set-board-color", color)
    }
  }
};
</script>

<style>
</style>