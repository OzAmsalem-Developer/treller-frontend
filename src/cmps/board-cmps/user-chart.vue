<script>
import { Radar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins
export default {

  extends: Radar,
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