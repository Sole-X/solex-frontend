export default {
  methods: {
    $_PagerMixin_getPageList(page = 1, maxPage = 1, pageLimit = 10) {
      if (maxPage <= pageLimit) {
        return _.map(Array(maxPage), (v, i) => {
          return i + 1;
        });
      }

      if (page <= pageLimit) {
        return _.map(Array(pageLimit), (v, i) => {
          return i + 1;
        });
      }

      return _.map(Array(pageLimit), (v, i) => {
        return page - (10 - i + 1);
      });
    },
  },
};
