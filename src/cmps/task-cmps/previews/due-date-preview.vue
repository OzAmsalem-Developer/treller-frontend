<template>
  <div
    class="due-date-preview-container"
    :style="{'background-color': this.bgColor, 'color': this.color}"
  >
    <div class="due-date-preview center-flex">
      <span v-if="dueDate.isCompleted">
        <i class="far fa-clock"></i>
        <span class="due-date-txt">Done</span>
      </span>
      <span v-else>
        <i class="far fa-clock"></i>
        <span class="due-date-txt">{{this.dueDate.time | minimalDate}}</span>
      </span>
    </div>
  </div>
</template>

<script>
import {utilService} from "../../../services/util.service.js"

export default {
  computed: { 
    bgColor() {
      if (this.dueDate.isCompleted) return '#61bd4f'
      const time = this.hourfLeft 
      const bgColor =
        time < 0
          ? "#eb5a46"
          : time < 5
          ? "#ff9f1a"
          : time < 48
          ? "#f2d600"
          : "transparent";
      return bgColor;
    },
    color() {
      return (this.hourfLeft > 48)? 'inherit' : '#fff'
    },
    hourfLeft() {
      return utilService.getHoursDifference(this.dueDate.time);
    }
  },
  props: {
    dueDate: Object
  }
};
</script>

<style>
</style>
// #61bd4f - green
// #eb5a46 - red
// #ff9f1a - orange
// #f2d600 - yellow

