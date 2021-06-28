<template>
  <section class="user-info__featured__filter">
    <div
      :class="$bem('user-info__featured__filter__option', '', option.id === selected.id ? ['selected'] : '')"
      v-for="option in filters"
      :key="option.id"
      @click="onSelect(option)"
    >
      <span
        ><strong>{{ option.title }}</strong></span
      >
      <label class="text-primary">{{ option.total }}</label>
    </div>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'UserInfoFeaturedFilter',
  props: {
    filters: Array,
    selected: Object,
    onSelect: Function,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {},

  components: {},
};
</script>
