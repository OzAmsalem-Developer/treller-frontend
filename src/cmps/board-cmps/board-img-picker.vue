<template>
  <div class="board-img-picker">
    <div class="img-container">
      <img class="img-card" v-for="(n, idx) in 14" 
      :src="getImgUrl(idx)"
      @click="setBoardImage(idx)"
      />
    </div>
    <button class="close-btn" @click.stop="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$emit("closed");
    },
    getImgUrl(idx) {
      return require(`@/assets/img/background/${idx}.jpg`)
    },
    setBoardImage(idx){
      const imgUrl =  'url(' + this.getImgUrl(idx) + ')'
      this.$emit('set-board-img', imgUrl)
    }
  }
};
</script>

<style>
</style>