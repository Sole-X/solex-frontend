<template>
  <div class="user-page">
    <nav class="main-page__inner-nav">
      <ul>
        <li
          v-for="tab in getUserTabs"
          :key="tab.path"
          :class="$bem('main-page__inner-nav__tab', '', tab.type === $route.meta.tab ? ['selected'] : '')"
        >
          <router-link :to="{ path: tab.path }" class="text-gray">
            {{ tab.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="user-page__detail">
      <router-view />
    </div>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'UserPage',
  beforeRouteEnter(to, from, next) {
    if (!to.meta.tab) {
      return next('/user/info');
    }

    return next();
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
    getUserTabs() {
      return [
        {
          type: 'info',
          name: $t('UserPage.MyInfo'),
          path: '/user/info',
        },
        {
          type: 'item',
          name: $t('UserPage.MyItems'),
          path: '/user/item',
        },
        {
          type: 'asset',
          name: $t('UserPage.MyAssets'),
          path: '/user/asset',
        },
        {
          type: 'history',
          name: $t('UserPage.MyActivity'),
          path: '/user/history',
        },
        {
          type: 'watchlist',
          name: $t('UserPage.MyWatchlist'),
          path: '/user/watchlist',
        },
      ];
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
