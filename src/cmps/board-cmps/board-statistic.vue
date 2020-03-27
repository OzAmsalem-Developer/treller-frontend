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
export default {
  computed: {
    listsChart(){
      return {
        chartData: {
          labels: this.listsNames,
          datasets: [
            {
              data: this.listsTasksCount ,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
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
  },
  created() {
    console.log(this.listsNames, this.listsTasksCount);
    
    console.log(this.listsChart);
    
  },
  components: {
    listChart
  }
};
</script>

<style>
</style>