<template>
  <div class="due-date-preview-container" :style="{'background-color': this.bgColor}">
    <div class="due-date-preview center-flex">
     <span v-if="dueDate.isCompleted">🕖Done</span>
     <span v-else>
      🕖{{this.dueDate.time | minimalDate}}
     </span>
    </div>
  </div>
</template>

<script>
import {utilService} from "../../../services/util.service.js"

export default {
  computed: {
    bgColor() {
      if (this.dueDate.isCompleted) return '#00e600'  
      const dueDateTime = this.dueDate.time;
      const hourfLeft = utilService.getHoursDifference(dueDateTime);
      const color =
        hourfLeft < 0
          ? "#ff3333"
          : hourfLeft < 5
          ? "#e65c00"
          : hourfLeft < 48
          ? "#ffd11a"
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
// #00e600 - green
// #ff3333 - red
// #e65c00 - orange
// #ffd11a - yellow

