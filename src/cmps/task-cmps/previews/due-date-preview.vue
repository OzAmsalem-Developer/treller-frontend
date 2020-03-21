<template>
  <div class="due-date-preview" :style="{'background-color': this.bgColor}">
     <span v-if="dueDate.isCompleted">🕖Done</span>
     <span v-else>
      🕖{{this.dueDate.time | minimalDate}}
     </span>
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