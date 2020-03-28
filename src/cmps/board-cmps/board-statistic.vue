<template>
  <div class="board-statistic">
    <listChart
      class="task-list-chart"
      :chartData="taskListsChart.chartData"
      :options="taskListsChart.options"
    />
    <labelChart
      class="label-chart"
      :chartData="taskLabelsChart.chartData"
      :options="taskLabelsChart.options"
    />
    <button class="close-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
import listChart from "./list-chart";
import labelChart from "./label-chart";
import hexToRgba from "hex-to-rgba";
import { utilService } from "../../services/util.service.js";
export default {
  data() {
    return {
      listsChartColors: {
        fill: null,
        border: null
      },
      labelsChartColors: {
        fill: null,
        border: null
      }
    };
  },
  computed: {
    taskListsChart() {
      return {
        chartData: {
          labels: this.listsNames,
          datasets: [
            {
              data: this.listsTasksCount,
              backgroundColor: this.listsChartColors.fill,
              borderColor: this.listsChartColors.border,
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            position: "top",
            align: "start"
          },
          title: {
            display: true,
            text: "List Popularity",
            fontSize: 18
          },
          tooltips: {
             titleFontSize: 15,
            bodyFontSize: 13,
            callbacks: {
              label: function(tooltipItem, data, datasetIndex) {
                var indice = tooltipItem.index;
                return (
                  data.labels[indice] +
                  ": " +
                  data.datasets[0].data[indice] +
                  " Tasks"
                );
              }
            }
          }
        }
      };
    },
    taskLabelsChart() {
      return {
        chartData: {
          labels: this.labelsName,
          datasets: [
            {
              label: "Label",
              data: this.labelsBoardCount,
              backgroundColor: this.labelsChartColors.fill,
              borderColor: this.labelsChartColors.border,
              borderWidth: 1
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: "Labels Distribution",
            fontSize: 27,
          },
          tooltips: {
            titleFontSize: 20,
            bodyFontSize: 20,
            callbacks: {
              label: function(tooltipItem, data, datasetIndex) {
                var indice = tooltipItem.index;
                return data.datasets[0].data[indice] + " Apparitions";
              }
            }
          },
          responsive: false,
          scales: {
            xAxes: [
              {
                barPercentage: 0.9,
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      };
    },
    currBoard() {
      return this.$store.getters.currBoard;
    },
    labelsName() {
      return this.boardLabels.map((label, idx) => {
        return label.txt ? label.txt : "label " + (idx + 1);
      });
    },
    boardLabels() {
      return this.$store.getters.labels;
    },
    labelsBoardCount() {
      const boardTasks = this.$store.getters.boardTasks;
      const labelMap = boardTasks.reduce((acc, task) => {
        task.labels.forEach(label => {
          if (acc[label.id]) acc[label.id]++;
          else acc[label.id] = 1;
        });
        return acc;
      }, {});
      const labelIds = Object.keys(labelMap);
      const labelsBoardCount = this.currBoard.labels.map(label => {
        let isUsed = false;
        labelIds.forEach(usedLabelId => {
          if (label.id === usedLabelId) isUsed = true;
        });
        return isUsed ? labelMap[label.id] : 0;
      });
      // const labelsData = this.labelsName.map(name => [name])
      // labelsBoardCount.forEach((sum, idx) => labelsData[idx].push(sum))
      return labelsBoardCount;
    },
    listsNames() {
      return this.currBoard.taskLists.map(list => list.name);
    },
    listsTasksCount() {
      return this.currBoard.taskLists.map(list => list.tasks.length);
    }
  },
  methods: {
    goBack() {
      this.$emit("closed");
    },
    setListsChartColors() {
      const colors = utilService.getRandomChartColors();
      this.listsChartColors = colors;
    },
    setLabelsChartColors() {
      const labelColors = this.boardLabels.map(label => label.color);
      this.labelsChartColors.border = labelColors.map(hexColor =>
        hexToRgba(hexColor)
      );
      this.labelsChartColors.fill = labelColors.map(hexColor =>
        hexToRgba(hexColor, 0.7)
      );
    }
  },
  created() {
    this.setListsChartColors();
    this.setLabelsChartColors();
    console.log(this.labelsChartColors);
    console.log(this.labelsBoardCount);
    console.log(this.labelsName);
  },
  components: {
    listChart,
    labelChart
  }
};
</script>

<style>
</style>