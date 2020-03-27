
<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins
export default {
//   watch: {
//     chartdata () {
//       this.$data._chart.update()
//   }
// },
  extends: Doughnut,
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  components:{
    Doughnut
  },
  props: {
    // chartdata:{
    //   type: Object,
    //   default: null
    // }, 
    options:{
      type: Object,
      default: null
    } 
  }
};
</script>