export default {
  methods: {
    $_SearchMixin_getHighlightedKeyword(value, keyword) {
      return value.replace(`/${keyword}/gi`, `<strong>${keyword}</strong>`);
    },
  },
};
