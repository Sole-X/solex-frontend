<template>
  <section class="customer-privacy-policy">
    <header class="customer-privacy-policy-header">
      <div class="customer-privacy-policy-header-up">
        {{ $t('Customer.PrivacyPolicyMainTitle') }}
      </div>
      <div class="customer-privacy-policy-header-down">
        <select v-model="version">
          <option v-for="(item, i) in getVersions" v-bind:value="item.version">{{ item.value }}</option>
        </select>
      </div>
    </header>
    <main class="customer-privacy-policy-main">
      <router-view></router-view>
    </main>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'CustomerPrivacyPolicyPage',

  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.$router.replace(`/customer/privacy-policy/${this.version}`);
  },

  beforeDestroy() {},

  data() {
    return {
      version: '202102',
    };
  },

  computed: {
    getVersions() {
      return [
        {
          value: this.$t('General.Language') === 'KOR' ? '2021년 3월 1일' : 'Mar 1, 2021',
          version: '202102',
        },
        {
          value: this.$t('General.Language') === 'KOR' ? '2021년 2월 1일' : 'Feb 1, 2021',
          version: '202103',
        },
      ];
    },
  },

  watch: {
    version: function (newVal, oldVal) {
      this.$router.replace(`/customer/privacy-policy/${newVal}`);
    },
  },

  methods: {},

  components: {},
};
</script>
