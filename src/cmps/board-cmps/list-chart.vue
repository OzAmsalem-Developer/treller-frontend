
<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
  props: {
    chartdata: Object,
    options: Object
  }
};
</script>