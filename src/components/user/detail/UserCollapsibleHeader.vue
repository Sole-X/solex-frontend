<template>
  <div class="user-collapsible__header">
    <h4>
      <strong>{{ title }}</strong>
    </h4>
    <label>{{ total }}</label>
    <div v-if="sortby" class="user-collapsible__header-sortby">
      <div class="user-collapsible__header-sortby-title" @click="sortbyClicked" ref="sortbyClickEvent">
        {{ sortKey }}
        <img v-if="!isSortbyDropdown" :src="$static.getFileURL('img/icon/ic-chevron-bottom-gray.svg')" />
        <img v-else :src="$static.getFileURL('img/icon/ic-chevron-up-gray.svg')" />
      </div>
      <div class="user-collapsible__header-sortby-vertical"></div>
      <div v-if="isSortbyDropdown" class="user-collapsible__header-sortby-items" ref="sortbyClickevent2">
        <div
          class="user-collapsible__header-sortby-items-item"
          v-for="item in getSortKeys"
          @click="(event) => sortbyDropdownItemClicked(event, item.appear)"
        >
          {{ item.appear }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'UserCollapsibleHeader',
  props: {
    title: String,
    total: [String, Number],
    sortby: Boolean,
    propSortbyKey: String,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    window.addEventListener('click', this.clickEventSortbyDropdown);
  },

  beforeDestroy() {
    window.removeEventListener('click', this.clickEventSortbyDropdown);
  },

  data() {
    return {
      isSortbyDropdown: false,
    };
  },

  computed: {
    sortKey: {
      get() {
        return this.propSortbyKey;
      },

      set(newVal) {
        this.$emit('update:sortbyKey', 'sortbyKey', newVal);
      },
    },

    getSortKeys() {
      return [
        {
          appear: 'All',
        },
        {
          appear: 'In Progress',
        },
        {
          appear: 'Complete',
        },
      ];
    },
  },

  watch: {},

  methods: {
    sortbyClicked(event) {
      event.preventDefault();
      event.stopPropagation();

      this.isSortbyDropdown = !this.isSortbyDropdown;
    },

    sortbyDropdownItemClicked(event, value) {
      event.preventDefault();
      event.stopPropagation();

      this.sortKey = value || 'Sort by';
      this.isSortbyDropdown = false;
    },

    clickEventSortbyDropdown(event) {
      this.isSortbyDropdown = false;
    },
  },

  components: {},
};
</script>
