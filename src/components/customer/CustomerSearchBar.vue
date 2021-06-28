<template>
  <div class="customer-search-bar">
    <div class="customer-search-bar__container">
      <input
        class="customer-search-bar__input"
        ref="customer-search-bar-input"
        :placeholder="placeholder"
        @keypress="inputEntered"
      />
      <img
        class="customer-search-bar__submit"
        :src="$static.getFileURL('img/icon/ic-search-bk.svg')"
        alt="submit"
        width="18px"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script>
let $t, self;

export default {
  name: 'CustomerSearchBar',

  props: ['handleSearch'],

  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    placeholder() {
      return $t('Customer.InputPlaceholder');
    },
  },

  watch: {},

  methods: {
    handleSubmit(event) {
      const value = this.$refs['customer-search-bar-input'].value;
      this.$refs['customer-search-bar-input'].value = '';
      this.handleSearch(value);
    },

    inputEntered(event) {
      if (event.keyCode === 13) {
        this.handleSubmit(event);
      }
    },
  },

  components: {},
};
</script>
