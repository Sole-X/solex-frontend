export default {
  beforeDestroy() {
    clearInterval(this.auctionTimer);
  },

  data() {
    return {
      remainPeriod: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        start: false,
      },
      auctionTimer: null,
    };
  },

  methods: {
    $_AssetAuctionTimer_initAuctionTimer(info) {
      if (!info || !info.getRemainAuctionTime) {
        return;
      }

      this.auctionTimer = setInterval(() => {
        const getRemainPeriod = info.getRemainAuctionTime(this.$date.getNow());
        if (!getRemainPeriod.success) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
        }

        this.remainPeriod = _.cloneDeep(getRemainPeriod.info);

        if (getRemainPeriod.info.milliseconds <= 0) {
          return clearInterval(this.auctionTimer);
        }
      }, 1000);
    },

    $_AssetAuctionMixin_openBidStatusModal(info) {
      const { bids } = info.auction;

      if (bids.length === 0) {
        return;
      }

      const requestList = [];

      for (const bid of bids) {
        requestList.push({
          id: bid.bidIndex,
          account: bid.accountAddress,
          createdAt: bid.createdAt,
          price: bid.bidPrice,
        });
      }

      this.showModal({
        component: 'OrderRequestStatusModal',
        params: {
          item: info,
          requestList,
        },
      });
    },
  },
};
