<template>
  <section class="customer-page customer-faq-page">
    <header class="customer-page__header">
      <h1 class="customer-page__header__title">
        <strong>{{ $t('Customer.MainTitle') }}</strong>
      </h1>

      <customer-search-bar :handleSearch="handleSearch"></customer-search-bar>

      <nav class="main-page__header__nav">
        <section class="main-page__header__nav__item-container">
          <div class="main-page__header__nav__item" v-for="tab in getTabs[0]" :data-idx="tab.tab" @click="tabClicked">
            {{ tab.title }}
          </div>
        </section>
        <section class="main-page__header__nav__item-container">
          <div class="main-page__header__nav__item" v-for="tab in getTabs[1]" :data-idx="tab.tab" @click="tabClicked">
            {{ tab.title }}
          </div>
        </section>
      </nav>

      <router-view :search="search"></router-view>
    </header>
  </section>
</template>

<script>
  import CommonSearchBar from '@/components/common/CommonSearchBar'
  import CustomerSearchBar from '@/components/customer/CustomerSearchBar';

  let $t, component

  export default {
    name: 'CustomerFaqPage',

    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.$router.replace(`/customer/faq/${this.curTab}`);
    },

    updated() {
      const items = document.getElementsByClassName('main-page__header__nav__item');
      for (const item of items) {
        if (item.className.includes('tab-selected')) {
          item.className = item.className.replace(' tab-selected', '');
        }
        if (item.dataset.idx === this.curTab) {
          item.className += ' tab-selected';
        }
      }
    },

    beforeDestroy() {

    },

    data() {
      return {
        faqKeyword: '',
        search: '',
        curTab: 'popular',
      }
    },

    computed: {
      getTabs() {
        return [
          [{
            title: $t('Customer.TabPopular'),
            tab: 'popular'
          },
            {
              title: $t('Customer.TabGeneral'),
              tab: 'general'
            },
            {
              title: $t('Customer.TabSale'),
              tab: 'sale'
            },
            {
              title: $t('Customer.TabAuction'),
              tab: 'auction'
            }],
          [{
            title: $t('Customer.TabBuy'),
            tab: 'buy'
          },
            {
              title: $t('Customer.TabStaking'),
              tab: 'staking'
            },
            {
              title: $t('Customer.TabAccount'),
              tab: 'account'
            },
            {
              title: $t('Customer.TabAdditional'),
              tab: 'additional'
            }]
        ]
      },
    },

    watch: {
      curTab: function (newVal, oldVal) {
        this.$router.push(`/customer/faq/${newVal}`);
      },

      search: function (newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          this.curTab = "search";
        }
      }
    },

    methods: {
      handleTab(tab) {
        this.$router.push({
          query: {
            tab: tab.name
          }
        })
      },

      handleSetFaqKeyword(keyword) {
        this.faqKeyword = keyword
      },

      handleSearchFaq() {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            keyword: this.faqKeyword
          }
        })
      },

      tabClicked(event) {
        const idx = event.target.dataset.idx;
        if (idx) {
          this.curTab = idx;
        }
      },

      handleSearch(val) {
        this.search = val;
      }
    },

    components: {
      CommonSearchBar,
      CustomerSearchBar
    }
  }
</script>
