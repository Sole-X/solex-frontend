<template>
  <section class="asset-item__chart">
    <header class="asset-item__chart__header">
      <div class="asset-item__chart__header__title">
        <h4>{{$t('Market.PriceChart')}}</h4>
      </div>

      <div class="asset-item__chart__header__summary">
        <div class="asset-item__chart__header__summary__col">
          <p><strong>$ {{history.maxPrice.dprec(2) | addComma}}</strong> {{selectedCurrency.name}}</p>
          <p>
            <img :src="$static.getFileURL('img/icon/ic-chart-highest.svg')" alt="highest" />
            {{$t('Market.HighestPrice')}}
          </p>
        </div>

        <div class="asset-item__chart__header__summary__col">
          <p><strong>$ {{history.minPrice.dprec(2) | addComma}}</strong> {{selectedCurrency.name}}</p>
          <p>
            <img :src="$static.getFileURL('img/icon/ic-chart-lowest.svg')" alt="lowest" />
            {{$t('Market.LowestPrice')}}
          </p>
        </div>

        <div class="asset-item__chart__header__summary__col">
          <p><strong>$ {{history.avgPrice.dprec(2) | addComma}}</strong> {{selectedCurrency.name}}</p>
          <p>
            <img :src="$static.getFileURL('img/icon/ic-chart-average.svg')" alt="average" />
            {{$t('Market.AveragePrice')}}
          </p>
        </div>
      </div>
    </header>

    <article class="asset-item__chart__wrapper">
      <asset-item-detail-chart-view
        :histories="history.history"
        :propHoverData="hoverData"
        v-on:update:hoverData="setData"
        :propShowHover="showHover"
        v-on:update:showHover="setData"
      />
    </article>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CommonSearchDropdown from '@/components/common/CommonSearchDropdown'
  import AssetItemDetailChartView from '@/components/asset/item/detail/AssetItemDetailChartView';

  let $t, component

  export default {
    name: 'AssetItemDetailChart',
    props: {
      history: Object
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {
        selectedCurrency: {},
        histories: [],
        historyReversed: [],
        hoverData: null,
        showHover: false
      }
    },

    computed: {
      ...mapGetters([
        'getSupportCurrency',
        'getItemHistory'
      ]),

      getCurrencyToDropdownList() {
        return _.map(_.cloneDeep(this.getSupportCurrency), currency => {
          return {
            name: currency.symbol,
            value: currency
          }
        })
      }
    },

    watch: {
      history: function(newVal, oldVal) {
        this.historyReversed = _.cloneDeep(newVal.history).reverse();
      },

      getItemHistory: function () {
        const itemHistory = this.getItemHistory;
        let historyTemp = null;
        if (itemHistory && itemHistory.history && itemHistory.history.length > 0 && itemHistory.history[0]) {
          historyTemp = itemHistory.history[0];
        }
        this.histories = historyTemp;
      }
    },

    methods: {
      setData(key, value) {
        this[key] = value;
      },
    },

    components: {
      CommonSearchDropdown,
      AssetItemDetailChartView
    }
  }
</script>
