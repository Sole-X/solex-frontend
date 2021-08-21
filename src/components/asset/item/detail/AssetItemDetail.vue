<template>
  <section class="asset-item__detail">
    <asset-item-detail-chart :history="history" />

    <nav class="asset-item__detail__nav">
      <ul>
        <li
          v-for="tab in getItemDetailTabs"
          :key="tab.tabName"
          :class="$bem('asset-item__detail__nav__tab', '', tab.tabName === currentTab ? ['selected'] : '')"
        >
          <router-link
            :to="{ path: `/asset/item/${$route.params.tokenAddress}/${$route.params.tokenId}/${tab.tabName}` }"
          >
            <strong>{{ tab.title }}</strong>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="asset-item__detail__body ">
      <router-view :info="info" :history="history" />
    </div>

    <asset-item-floating :info="info">
      <div v-if="$_GlobalValueMixin_showRouterView" slot="submit" class="asset-item__floating__submit">
        <button
          v-if="buttonProps && buttonProps.leftButton"
          :class="$bem('common-submit-button', '', buttonProps.leftButton.classes)"
          @click="buttonProps.leftButton.click"
        >
          {{ buttonProps.leftButton.title }}
        </button>

        <button
          v-if="buttonProps && buttonProps.rightButton"
          :class="$bem('common-submit-button', '', buttonProps.rightButton.classes)"
          @click="buttonProps.rightButton.click"
        >
          {{ buttonProps.rightButton.title }}
        </button>
      </div>
    </asset-item-floating>
  </section>
</template>

<script>
import AssetItemFloating from '@/components/asset/item/AssetItemFloating';
import AssetItemDetailChart from '@/components/asset/item/detail/AssetItemDetailChart';
import GlobalValueMixin from '@/mixins/common/GlobalValueMixin';

let $t, component;

export default {
  name: 'AssetItemDetail',

  mixins: [GlobalValueMixin],

  props: {
    info: Object,
    history: Object,
    buttonProps: Object,
  },

  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initItemDetail();
  },

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    currentTab() {
      return this.$route.meta.tab;
    },

    getItemDetailTabs() {
      return [
        {
          title: $t('Market.ItemDescription'),
          tabName: 'description',
        },
        {
          title: $t('Market.Collection'),
          tabName: 'collection',
        },
        {
          title: $t('Market.Chain'),
          tabName: 'chain',
        },
        {
          title: $t('Market.History'),
          tabName: 'history',
        },
      ];
    },
  },

  watch: {},

  methods: {
    initItemDetail() {
      const { meta, path } = this.$route;

      if (!meta.tab) {
        this.$router.replace({
          path: `${path}/description`,
          query: this.$route.query,
        });
      }
    },
  },

  components: {
    AssetItemFloating,
    AssetItemDetailChart,
  },
};
</script>
