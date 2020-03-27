<template>
  <div class="board-statistic">
    <listChart :chartdata="listChart.chartData" :options="listChart.options" />
    <button class="close-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
import listChart from "./list-chart";
export default {
  data() {
    return {
      listChart: {
        chartData: {
          labels: this.listNames,
          datasets: [
            {
              data: this.listsTasksCount,
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
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    listNames() {
      const boardListNames = []
      this.currBoard.taskLists.forEach(list => boardListNames.push(list.name));
      return boardListNames;
    },
    listsTasksCount() {
      const listsTasksCount = [];
      this.currBoard.taskLists.forEach(list => {
        listsTasksCount.push(list.tasks.length);
      });
      return listsTasksCount;
    }
  },
  methods: {
    goBack() {
      this.$emit("closed");
    },
    
  },
  components: {
    listChart
  }
};
</script>

<style>
</style>