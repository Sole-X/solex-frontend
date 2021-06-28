<!-- TODO : 컴포넌트 속성으로 size 받아 스타일 설정 -->
<template>
  <div :class="$bem('common-loader', '', getLoaderClasses)">
    <div class="common-loader__spinner">
      <div v-for="i in 12" :key="i" />
    </div>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'CommonLoader',
  props: {
    size: {
      type: Number,
      default() {
        return 48;
      },
    },
    color: String,
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

  computed: {
    getLoaderClasses() {
      const { color, size } = this;
      const result = [size];

      if (color) {
        result.push(color);
      }

      return result;
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
