<template>
  <TrendChart
      v-if="this.histories && this.histories.length > 0"
      :datasets="getDatasets"
      :grid="getGrid"
      :labels="getLabels"
      :interactive='true'
      @mouse-move="onMouseMove"
  >
  </TrendChart>
</template>

<script>
let $t, self
import { mapGetters } from 'vuex';

export default {
  name: 'AssetItemDetailChartView',

  mixins: [],

  props: [
      'histories', 'propHoverData', 'propShowHover'
  ],

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {

  },

  beforeDestroy() {

  },

  data() {
    return {

    }
  },

  computed: {
    ...mapGetters([
        'getSupportCurrency'
    ]),

    hoverData: {
      get () {
        return this.propHoverData;
      },

      set (newVal) {
        this.$emit('update:hoverData', 'hoverData', newVal);
      }
    },

    showHover: {
      get () {
        return this.propShowHover;
      },

      set (newVal) {
        this.$emit('update:showHover', 'showHover', newVal);
      }
    },

    getChartData() {
      let data = [];
      for (const row of this.histories) {
        data = [Boolean(Number(row.usdPrice)) ? Number(row.usdPrice) : 0, ...data];
      }
      return data;
    },

    getDataset() {
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
          {
            value: Number(price),
            updatedAt: row.updatedAt,
          }
        ];
      }

      return {
        data: data,
        smooth: true,
        fill: false,
        className: 'item-price'
      }
    },

    getDatasets() {
      return [this.getDataset];
    },

    getGrid() {
      return {
        verticalLines: true,
        horizontalLines: true
      }
    },

    getLabels() {
      let xLabels = [];
      for (const row of this.histories) {
        const date = new Date(row.updatedAt);
        let xLabel = `${date.getMonth()}/${date.getDate()}`
        xLabels = [...xLabels, xLabel];
      }

      return {
        xLabels: xLabels,
        yLabels: 5,
        yLabelsTextFormatter: val => '$ ' + Math.round(val * 10000) / 10000
      }
    }
  },

  watch: {
    hoverData (newVal, oldVal) {
      if (!newVal) {
        this.showHover = false;
        return;
      }
      this.showHover = true;
    }
  },

  methods: {
    onMouseMove(event) {
      const { index, data } = event ? event : {index: null, data: null};

      this.hoverData = data;
    }
  },

  components: {

  }
}
</script>