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
    <userChart
      class="user-chart"
      :chartData="userActivityChart.chartData"
      :options="userActivityChart.options"
    />
    <button class="close-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
</template>

<script>
import listChart from "./list-chart";
import labelChart from "./label-chart";
import userChart from "./user-chart";
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
              borderWidth: 1,
              barPercentage: 0.9
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: "Labels Distribution",
            fontSize: 27
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
    userActivityChart() {
      return {
        chartData: {
          labels: ["Editind", "Adding", "Removing", "Commenting",  "Tasks moved"],
          datasets: [
            {

              data: [10, 30, 12, 9, 5],
              // data: [45, 50, 32, 60, 40],
              // backgroundColor: this.listsChartColors.fill,
              // borderColor: this.listsChartColors.border,
              borderWidth: 1
            },
            {
              data: [18, 6, 14, 8, 3],
              // data: [80, 15, 30, 80, 100],
              backgroundColor: this.labelsChartColors.fill,
              borderColor: this.labelsChartColors.border,
              borderWidth: 1
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: "Team activities",
            fontSize: 27
          },
          tooltips: {
            titleFontSize: 20,
            bodyFontSize: 20
            // callbacks: {
            //   label: function(tooltipItem, data, datasetIndex) {
            //     var indice = tooltipItem.index;
            //     return data.datasets[0].data[indice] + " Apparitions";
            //   }
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
    },
    getUserActivities(userId) {
      const data = [0,0,0,0,0]
      this.currBoard.activities.forEach(act => {
        if (act.from._id === userId) {
          let actTxt = act.operation
          if (actTxt.includes('added task')) data[0]++
          if (actTxt.includes('leave a comment')) data[1]++
          if (actTxt.includes('moved a task')) data[2]++
          if (actTxt.includes('done todo')) data[3]++
          if (actTxt.includes('to done')) data[4]++
        }
      })
      return data
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
    },

  },
  created() {
    this.setListsChartColors();
    this.setLabelsChartColors();
  },
  components: {
    listChart,
    labelChart,
    userChart
  }
};
</script>

<style>
</style>