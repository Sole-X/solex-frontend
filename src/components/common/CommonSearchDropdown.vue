<template>
  <div class="common-search-dropdown">
    <div class="common-search-dropdown__selected" @click="handleSelectToggle()">
      <label v-if="selected && selected.name">
        <strong>{{ selected.name }}</strong>
      </label>

      <span v-else class="common-search-dropdown__placeholder">
        {{ defaultTitle || '-' }}
      </span>

      <img :src="$static.getFileURL('img/icon/ic-chevron-bottom-gray.svg')" alt="chevron to bottom" />
    </div>

    <!-- TODO : 선택된 옵션 강조 표시 -->
    <ui-popover
      ref="select"
      class="common-search-select"
      :class="options.selectClass"
      :style="getSelectStyle"
      openOn="manual"
      animation="shift-away"
    >
      <ul>
        <li v-for="(option, i) in list" :key="i" class="text-gray" @click="handleSelectOption(option)">
          {{ option.name }}
        </li>
      </ul>
    </ui-popover>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'CommonSearchDropdown',
  props: {
    list: Array,
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    selected: Object,
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
      showSelect: false,
    };
  },

  computed: {
    getSelectStyle() {
      const rowHeight = 40;

      return {
        height: `${Math.min(this.list.length * rowHeight, rowHeight * 8)}px`,
      };
    },
  },

  watch: {
    list(newVal) {
      if (!newVal || newVal.length === 0) {
        this.$refs.select.close();
      }
    },

    showSelect(newVal) {
      this.$refs.select[newVal ? 'open' : 'close']();
    },
  },

  methods: {
    handleSelectToggle() {
      if (this.list.length === 0) {
        return;
      }

      this.showSelect = !this.showSelect;
    },

    handleSelectOption(option) {
      this.showSelect = false;
      this.$emit('onSelect', option);
    },
  },

  components: {},
};
</script>
