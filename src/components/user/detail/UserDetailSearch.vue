<template>
  <section class="user-detail-search">
    <div class="user-detail-search__box">
      <div class="common-search-bar user-detail-search__box__input">
        <div class="common-search-bar__input">
          <input type="text" :value="keyword" :placeholder="defaultTitle" @keyup="handleInput" />
          <img :src="$static.getFileURL('img/icon/ic-search-bk.svg')" alt="search" />
        </div>
      </div>

      <div class="user-detail-search__box__tag">
        <button v-for="filter in filters" :key="filter.value" @click="$emit('onRemove', filter)">
          {{ filter.value }}
        </button>
      </div>
    </div>

    <div class="user-detail-search__option" v-if="option.list">
      <common-search-dropdown
        :list="option.list"
        :selected="option.selected"
        :options="{ selectClass: ['user-detail-search__dropdown'] }"
      />
    </div>
  </section>
</template>

<script>
import CommonSearchDropdown from '@/components/common/CommonSearchDropdown';

let $t, component;

export default {
  name: 'UserDetailSearch',
  props: {
    keyword: String,
    filters: {
      type: Array,
      default() {
        return [];
      },
    },
    option: {
      type: Object,
      default() {
        return {};
      },
    },
    defaultTitle: String,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      userInput: '',
    };
  },

  computed: {},

  watch: {},

  methods: {
    handleInput(e) {
      if (e.key === 'Enter') {
        return this.$emit('onSubmit');
      }

      this.$emit('onInput', e.target.value);
    },
  },

  components: {
    CommonSearchDropdown,
  },
};
</script>
