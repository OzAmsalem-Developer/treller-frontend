<template>
  <div class="board-style-menu">
    <div v-if="isMenuOpen.main">
      <div class="btn color-picker-btn center-flex" @click="openColorPicker">
        <h3>Colors</h3>
      </div>
      <div class="btn img-picker-btn center-flex" @click="openImgPicker">
        <h3>Images</h3>
      </div>
    </div>

    <boardColorPicker
      v-if="isMenuOpen.colorPicker"
      @closed="closeColorPicker"
      @set-board-color="updateStyle"
    />
    <boardImgPicker
      v-if="isMenuOpen.imgPicker"
      @closed="closeImgPicker"
      @set-board-img="updateStyle"
    />
    <button class="close-btn" v-if="isMenuOpen.main" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
import boardColorPicker from "./board-color-picker";
import boardImgPicker from "./board-img-picker";
export default {
  data() {
    return {
      isMenuOpen: {
        main: true,
        colorPicker: false,
        imgPicker: false
      }
    };
  },
  methods: {
    openColorPicker() {
      this.isMenuOpen.main = false;
      this.isMenuOpen.colorPicker = true;
    },
    closeColorPicker() {
      this.isMenuOpen.main = true;
      this.isMenuOpen.colorPicker = false;
    },
    openImgPicker() {
      this.isMenuOpen.main = false;
      this.isMenuOpen.imgPicker = true;
    },
    closeImgPicker() {
      this.isMenuOpen.imgPicker = false;
      this.isMenuOpen.main = true;
    },
    goBack() {
      this.$emit("closed");
    },
    updateStyle(background) {
      this.$emit("update-style", background);
    }
  },
  components: {
    boardColorPicker,
    boardImgPicker
  }
};
</script>

<style>
</style>