<template>
  <select @change="orderChanged" ref="orderOptions">
    <option value="DATE">{{ $t('Market.OrderByNewest') }}</option>
    <option value="POP">{{ $t('Market.OrderByPopular') }}</option>
    <option value="DATE+">{{ $t('Market.OrderByOldest') }}</option>
    <option value="PRICE+">{{ $t('Market.OrderByLowestPrice') }}</option>
    <option value="PRICE">{{ $t('Market.OrderByHighestPrice') }}</option>
    <option value="PARTICIPANT+">{{ $t('Market.OrderByLowestBid') }}</option>
    <option value="PARTICIPANT">{{ $t('Market.OrderByHighestBid') }}</option>
    <option value="EXPIRE">{{ $t('Market.OrderByExpiringSoon') }}</option>
  </select>
</template>

<script>
let $t, self;

export default {
  name: 'MarketplaceOrder',

  mixins: [],

  props: [''],

  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    orderChanged(event, val) {
      let value;
      if (val) {
        value = val;

        if (!event) {
          event = new Event('changeOutside');
          let curElem = null;
          const parentNode = this.$refs.orderOptions ? this.$refs.orderOptions : null;
          if (parentNode) {
            for (const elem of parentNode.children) {
              if (elem.value === value) {
                curElem = elem;
                break;
              }
            }
          }
          if (curElem) {
            curElem.dispatchEvent(event);
            curElem.selected = true;
          }
        }
      } else {
        value = event.target.value;
      }

      const sortBy = {
        section: 'order',
        value,
        appear: () => '',
      };
      this.order = sortBy;
    },
  },

  components: {},
};
</script>
