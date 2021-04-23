<template>
  <canvas id="priceChart">
    
  </canvas>
</template>

<script>
let $t, self
import Chart from 'chart.js'
import { mapGetters } from 'vuex';

export default {
  name: 'AssetItemDetailChartView2',
  props: [
    'histories', 'propHoverData', 'propShowHover'
  ],

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
    this.createChart('priceChart', this.planetChartData)
  },

  computed: {
    ...mapGetters([
      'getSupportCurrency'
    ]),
  },
  methods:{
    createChart(charId, chartData){
      const ctx = document.getElementById(charId);
      
      let xLabels = [];
      for (const row of this.histories) {
        const date = new Date(row.updatedAt);
        let xLabel = `${date.getMonth()}/${date.getDate()}`
        xLabels = [...xLabels, xLabel];
      }

      let data = [];
      
      for (const row of this.histories) {
        
        const currency = _.find(this.getSupportCurrency, cur => {
          if (this.$wallet.isSameAddress(row.currency, cur.tokenAddress)) return true;
          return false;
        })
        let price = 0;
        if (currency) {
          price = currency.toFiat(this.$bn.toMaxUnit(row.amount, currency.decimal, 4));
          price = price.dprec ? price.dprec(4) : price;
        }
        data = [
            ...data,
            price
        ];
      }
      
      const myChart = new Chart(ctx,{
        type: "line",
        data: {
          labels: xLabels,
          datasets: [
            {
              data: data,
              fill: false,
              backgroundColor: "rgba(54,73,93,.5)",
              borderColor: "#36495d",
              borderWidth: 3
            }
          ]
        },
        options: {
          legend:{
            display: false
          },
          responsive: true,
          lineTension: 1,
          tooltips: {
            mode: 'index',
            intersect: false,
            custom: function(tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
              tooltip.displayColors = false;
            },
            callbacks: {

              label: function(tooltipItem, data) {
                  var label = data.datasets[tooltipItem.datasetIndex].label || '';

                  if (label) {
                      label += ': ';
                  }
                  label += Math.round(tooltipItem.yLabel * 100) / 100;
                  return label;
              }
            }
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25
                }
              }
            ]
          }
        }
        ,
      })
    }
  }
}
</script>