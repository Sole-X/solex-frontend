export default {
  methods: {
    $_AssetSellMixin_openNegoStatusModal(info) {
      if (info.exchange.negos.length === 0) {
        return;
      }

      this.showModal({
        component: 'OrderRequestStatusModal',
        params: {
          type: 1,
          item: info,
          requestList: info.exchange.negos,
          requestCurrentList: info.exchange.currentNegos,
        },
      });
    },

    $_AssetSellMixin_limitMinPrice(price) {
      const priceNum = Number(price);
      if (/^(\d*)[\.]?(\d{1,4})?$/g.test(price)) {
        return price;
      } else {
        return String(Math.floor(priceNum * 10 ** 4) / 10 ** 4);
      }
    },
  },
};
