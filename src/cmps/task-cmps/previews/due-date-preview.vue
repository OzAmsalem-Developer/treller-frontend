<template>
  <div class="due-date-preview-container" :style="{'background-color': this.bgColor}">
    <div class="due-date-preview center-flex">
     <span v-if="dueDate.isCompleted">🕖<span class="due-date-txt">Done</span></span>
     <span v-else>
      🕖<span class="due-date-txt">{{this.dueDate.time | minimalDate}}</span>
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
      const dueDateTime = this.dueDate.time;
      const hourfLeft = utilService.getHoursDifference(dueDateTime);
      const color =
        hourfLeft < 0
          ? "#eb5a46"
          : hourfLeft < 5
          ? "#ff9f1a"
          : hourfLeft < 48
          ? "#f2d600"
          : "transparent";
      return color;
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

