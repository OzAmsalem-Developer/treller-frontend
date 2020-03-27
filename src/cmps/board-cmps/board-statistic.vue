<template>
  <div class="board-statistic">
    <listChart v-if="currBoard" :chartData="listsChart.chartData" :options="listsChart.options" />
    <button class="close-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
import listChart from "./list-chart";
import {utilService} from "../../services/util.service.js"
export default {
  data() {
    return {
      listsChartColors: {
        fill: null,
        border: null
      }
    }
  },
  computed: {
    listsChart(){
      return {
        chartData: {
          labels: this.listsNames,
          datasets: [
            {
              data: this.listsTasksCount ,
              backgroundColor: this.listsChartColors.fill,
              borderColor: this.listsChartColors.border,
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            position: "top",
            align: "start",
          }
        }
      }
    },
    currBoard() {
      return this.$store.getters.currBoard;
    },
    listsNames() {
      return this.currBoard.taskLists.map(list => list.name)
    },
    listsTasksCount() {
      return this.currBoard.taskLists.map(list => list.tasks.length)
    }
  },
  methods: {
    goBack() {
      this.$emit("closed");
    }, 
    setListsChartColors() {
      const colors = utilService.getRandomChartColors()
      this.listsChartColors = colors
    }
  },
  created() {
    this.setListsChartColors()
  },
  components: {
    listChart
  }
};
</script>

<style>
</style>