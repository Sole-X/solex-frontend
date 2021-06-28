export default {
  methods: {
    $_UserCollapsibleMixin_initCollapsible(refs = []) {
      let i = 0;
      let j = 0;
      let hasOpened = false;

      for (i; i < refs.length; i++) {
        refs[i].open = this.$route.query.tab === String(i + 1);

        if (refs[i].open) {
          hasOpened = true;
          j = i;
        }
      }

      if (hasOpened) {
        if (j < refs.length) {
          let refTop = 0;
          if (refs[j].$refs && refs[j].$refs.bodyWrapper && refs[j].$refs.bodyWrapper.parentElement) {
            refTop = refs[j].$refs.bodyWrapper.parentElement.getBoundingClientRect().top;
          }
          window.scroll({
            top: refTop,
            behavior: 'smooth',
          });
        }

        this.$router.replace({
          query: {},
        });
      }
    },
  },
};
