<template>
  <section class="asset-item__history">
    <div class="asset-item__history__thead">
      <div
        v-for="(col, i) in getTableHead"
        :key="`${i}-${col.type}`"
        :class="$bem('asset-item__history__col', '', [col.type])"
      >
        {{ col.title }}
      </div>
    </div>

    <div class="asset-item__history__tbody">
      <div class="asset-item__history__row" v-for="row in history.history" :key="row.id">
        <div :class="$bem('asset-item__history__col', '', ['event'])">
          {{ row.eventToString }}
        </div>

        <div :class="$bem('asset-item__history__col', '', ['price'])">
          {{ $bn.toMaxUnit(row.amount, row.currencyInfo.decimal, 4) }} {{ row.currencyInfo.symbol }}
        </div>

        <div :class="$bem('asset-item__history__col', '', ['address'])">
          {{ row.fromAddress }}
        </div>

        <div :class="$bem('asset-item__history__col', '', ['address'])">
          {{ row.toAddress }}
        </div>

        <div :class="$bem('asset-item__history__col', '', ['date'])">
          {{ $date.getFromNow(row.createdAt) }}
        </div>

        <div :class="$bem('asset-item__history__col', '', ['tx-link'])">
          <a :href="$wallet.getTxUrl(row.txHash, 'KLAYTN')" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <defs>
                <path
                  id="31sz8xg1ma"
                  d="M10 5.333h2c.707 0 1.386.281 1.886.781s.78 1.179.78 1.886c0 1.473-1.193 2.667-2.666 2.667h-2c-.368 0-.667.298-.667.666 0 .369.299.667.667.667h2c2.21 0 4-1.79 4-4 0-1.06-.421-2.078-1.172-2.828C14.078 4.422 13.061 4 12 4h-2c-.368 0-.667.298-.667.667 0 .368.299.666.667.666zM6 4c.368 0 .667.298.667.667 0 .368-.299.666-.667.666H4C2.527 5.333 1.333 6.527 1.333 8c0 .707.281 1.386.781 1.886s1.179.78 1.886.78h2c.368 0 .667.3.667.667 0 .369-.299.667-.667.667H4c-1.06 0-2.078-.421-2.828-1.172C.422 10.078 0 9.061 0 8c0-2.21 1.79-4 4-4zm4.667 3.333c.368 0 .666.299.666.667 0 .368-.298.667-.666.667H5.333c-.368 0-.666-.299-.666-.667 0-.368.298-.667.666-.667z"
                />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(-954 -1731) translate(954 1731)">
                  <mask id="46hwfqwnqb" fill="#fff">
                    <use xlink:href="#31sz8xg1ma" />
                  </mask>
                  <use fill="#000" fill-rule="nonzero" xlink:href="#31sz8xg1ma" />
                  <g fill="#B2B2B2" mask="url(#46hwfqwnqb)">
                    <path d="M0 0H16V16H0z" />
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'AssetItemHistoryPage',
  props: {
    info: Object,
    history: Object,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    getTableHead() {
      return [
        {
          type: 'event',
          title: $t('Market.Event'),
        },
        {
          type: 'price',
          title: $t('Market.Price'),
        },
        {
          type: 'address',
          title: 'From',
        },
        {
          type: 'address',
          title: 'To',
        },
        {
          type: 'date',
          title: $t('Market.Date'),
        },
        {
          type: 'tx-link',
          title: $t('Market.ViewTx'),
        },
      ];
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
