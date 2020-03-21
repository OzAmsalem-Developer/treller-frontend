<template>
  <div class="due-date-preview" :style="{'background-color': this.bgColor}">
      🕖{{this.dueDate.time | minimalDate}}
  </div>
</template>

<script>
import {utilService} from "../../../services/util.service.js"

export default {
  computed: {
    bgColor() {
      if (this.dueDate.isCompleted) return 'green'  
      const dueDateTime = this.dueDate.time;
      const hourfLeft = utilService.getHoursDifference(dueDateTime);
      const color =
        hourfLeft < 0
          ? "red"
          : hourfLeft < 5
          ? "orange"
          : hourfLeft < 48
          ? "yellow"
          : "none";
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