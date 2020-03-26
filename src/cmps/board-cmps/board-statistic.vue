<template>
  <div class="board-statistic">
    
   <button class="close-btn"  @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
export default {
methods:{
  goBack() {
      this.$emit("closed");
    }
}
}
</script>

<style>

</style>