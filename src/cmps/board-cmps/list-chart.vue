
<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins
export default {

  extends: Doughnut,
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  props: {
    options:{
      type: Object,
      default: null
    } 
  }
};
</script>