<template>
  <section class="customer-usage-terms">
    <header class="customer-usage-terms-header">
      <div class="customer-usage-terms-header-up">
        {{ $t('Customer.UsageTermsMainTitle') }}
      </div>
      <div class="customer-usage-terms-header-down">
        <select v-model="version">
          <option v-for="(item, i) in getVersions" v-bind:value="item.version">{{ item.value }}</option>
        </select>
      </div>
    </header>
    <main class="customer-usage-terms-main">
      <router-view></router-view>
    </main>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'CustomerUsageTermsPage',

    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.$router.replace(`/customer/usage-terms/${this.version}`);
    },

    beforeDestroy() {

    },

    data() {
      return {
        version: '202102'
      }
    },

    computed: {
      getVersions() {
        return [
          {
            value: 'Mar 1, 2021',
            version: '202102',
          },{
            value: 'Feb 1, 2021',
            version: '202103'
          }
        ]
      }
    },

    watch: {
      version: function (newVal, oldVal) {
        this.$router.replace(`/customer/usage-terms/${newVal}`);
      }
    },

    methods: {

    },

    components: {

    }
  }
</script>

