import Vue from 'vue';
import VueRouter from 'vue-router';

import LandingPage from '@/views/LandingPage.vue';
// import MarketHomePage from '@/views/MarketHomePage';

// import MarketplaceBuyPage from '@/views/marketplace/MarketplaceBuyPage';
// import MarketplaceSellPage from '@/views/marketplace/MarketplaceSellPage';
// import CollectionPage from '@/views/marketplace/CollectionPage';

// import AssetItemPage from '@/views/asset/item/AssetItemPage';
// import AssetItemDescriptionPage from '@/views/asset/item/AssetItemDescriptionPage';
// import AssetItemCollectionPage from '@/views/asset/item/AssetItemCollectionPage';
// import AssetItemChainPage from '@/views/asset/item/AssetItemChainPage';
// import AssetItemHistoryPage from '@/views/asset/item/AssetItemHistoryPage';

// import AssetFormMakeOfferPage from '@/views/asset/form/AssetFormMakeOfferPage';
// import AssetFormNegoPage from '@/views/asset/form/AssetFormNegoPage';
// import AssetFormBidPage from '@/views/asset/form/AssetFormBidPage';

// import UserPage from '@/views/user/UserPage';
// import UserDetailMyInfoPage from '@/views/user/detail/UserDetailMyInfoPage';
// import UserDetailMyItemPage from '@/views/user/detail/UserDetailMyItemPage';
// import UserDetailAssetPage from '@/views/user/detail/UserDetailAssetPage';
// import UserDetailHistoryPage from '@/views/user/detail/UserDetailHistoryPage';
// import UserDetailWatchlistPage from '@/views/user/detail/UserDetailWatchlistPage';

// import ExplorerPage from '@/views/explorer/ExplorerPage';
// import ExplorerMainHistoryPage from '@/views/explorer/main/ExplorerMainHistoryPage';
// import ExplorerMainRakingPage from '@/views/explorer/main/ExplorerMainRakingPage';

// import StakingPage from '@/views/staking/StakingPage';
// import StakingTrixPage from '@/views/staking/detail/StakingTrixPage';
// import StakingMyActivityPage from '@/views/staking/detail/StakingMyActivityPage';

// import RequestSuccessPage from '@/views/RequestSuccessPage';

// import CustomerPrivacyPolicyPage from '@/views/customer/CustomerPrivacyPolicyPage';
// import CustomerUsageTermsPage from '@/views/customer/CustomerUsageTermsPage';
// import CustomerFaqPage from '@/views/customer/CustomerFaqPage';

// import CustomerFaqMostPopularPage from '@/views/customer/faq/CustomerFaqMostPopularPage';
// import CustomerFaqGeneralPage from '@/views/customer/faq/CustomerFaqGeneralPage';
// import CustomerFaqSellSalePage from '@/views/customer/faq/CustomerFaqSellSalePage';
// import CustomerFaqSellAuctionPage from '@/views/customer/faq/CustomerFaqSellAuctionPage';
// import CustomerFaqBuyPage from '@/views/customer/faq/CustomerFaqBuyPage';
// import CustomerFaqStakingPage from '@/views/customer/faq/CustomerFaqStakingPage';
// import CustomerFaqAccountPage from '@/views/customer/faq/CustomerFaqAccountPage';
// import CustomerFaqAdditionalSupportPage from '@/views/customer/faq/CustomerFaqAdditionalSupportPage';
// import CustomerFaqSearchPage from '@/views/customer/faq/CustomerFaqSearchPage';

// import CustomerPrivacyPolicy202102 from '@/views/customer/privacyPolicy/CustomerPrivacyPolicy202102';
// import CustomerPrivacyPolicy202103 from '@/views/customer/privacyPolicy/CustomerPrivacyPolicy202103';

// import CustomerUsageTerms202102 from '@/views/customer/usageTerms/CustomerUsageTerms202102';
// import CustomerUsageTerms202103 from '@/views/customer/usageTerms/CustomerUsageTerms202103';

// import WalletConnectPage from '@/views/wallet/WalletConnectPage';

// import RenderPage from '@/views/render/RenderPage';

Vue.use(VueRouter);

const indexPageRoute = {
  path: '/',
  name: 'IndexPage',
  component: LandingPage,
  meta: {
    hideNav: true,
    hideFooter: true,
  },
};

const routes = [
  {
    path: '*',
    redirect: indexPageRoute,
  },
  {
    ...indexPageRoute,
  },
  {
    path: '/home',
    name: 'MarketHomePage',
    component: () => import(/* webpackChunkName: "MarketHomePage" */ '../views/MarketHomePage.vue'),
    //component: MarketHomePage,
  },
  {
    path: '/buy',
    name: 'MarketBuyPage',
    component: () => import(/* webpackChunkName: "MarketplaceBuyPage" */ '../views/marketplace/MarketplaceBuyPage.vue'),
    //component: MarketplaceBuyPage,
    meta: {
      hideFooter: true,
    },
  },
  {
    path: '/sell',
    name: 'MarketSellPage',
    component: () =>
      import(/* webpackChunkName: "MarketplaceSellPage" */ '../views/marketplace/MarketplaceSellPage.vue'),
    //component: MarketplaceSellPage,
    meta: {
      hideFooter: true,
    },
  },
  {
    path: '/collection',
    name: 'CollectionPage',
    component: () => import(/* webpackChunkName: "CollectionPage" */ '../views/marketplace/CollectionPage.vue'),
    //component: CollectionPage,
    meta: {
      maxWidth: '1220px',
    },
  },
  {
    path: '/asset/item/:tokenAddress/:tokenId',
    name: 'AssetItemPage',
    component: () => import(/* webpackChunkName: "AssetItemPage" */ '../views/asset/item/AssetItemPage.vue'),
    //    component: AssetItemPage,
    children: [
      {
        path: 'description',
        name: 'AssetItemDescriptionPage',
        component: () =>
          import(/* webpackChunkName: "AssetItemDescriptionPage" */ '../views/asset/item/AssetItemDescriptionPage.vue'),
        //component: AssetItemDescriptionPage,
        meta: {
          tab: 'description',
          savedPosition: true,
        },
      },
      {
        path: 'collection',
        name: 'AssetItemCollectionPage',
        component: () =>
          import(/* webpackChunkName: "AssetItemCollectionPage" */ '../views/asset/item/AssetItemCollectionPage.vue'),
        //component: AssetItemCollectionPage,
        meta: {
          tab: 'collection',
          savedPosition: true,
        },
      },
      {
        path: 'chain',
        name: 'AssetItemChainPage',
        component: () =>
          import(/* webpackChunkName: "AssetItemChainPage" */ '../views/asset/item/AssetItemChainPage.vue'),
        //component: AssetItemChainPage,
        meta: {
          tab: 'chain',
          savedPosition: true,
        },
      },
      {
        path: 'history',
        name: 'AssetItemHistoryPage',
        component: () =>
          import(/* webpackChunkName: "AssetItemHistoryPage" */ '../views/asset/item/AssetItemHistoryPage.vue'),
        //component: AssetItemHistoryPage,
        meta: {
          tab: 'history',
          savedPosition: true,
        },
      },
    ],
  },
  {
    path: '/asset/make-offer/:howTo',
    name: 'AssetFormMakeOfferPage',
    component: () =>
      import(/* webpackChunkName: "AssetFormMakeOfferPage" */ '../views/asset/form/AssetFormMakeOfferPage.vue'),
    //component: AssetFormMakeOfferPage,
    meta: {
      needLogin: true,
    },
  },
  {
    path: '/asset/bid/:tokenAddress/:tokenId',
    name: 'AssetFormBidPage',
    component: () => import(/* webpackChunkName: "AssetFormBidPage" */ '../views/asset/form/AssetFormBidPage.vue'),
    //component: AssetFormBidPage,
    meta: {
      needLogin: true,
    },
  },
  {
    path: '/asset/negotiation/:tokenAddress/:tokenId',
    name: 'AssetFormNegoPage',
    component: () => import(/* webpackChunkName: "AssetFormNegoPage" */ '../views/asset/form/AssetFormNegoPage.vue'),
    //component: AssetFormNegoPage,
    meta: {
      needLogin: true,
    },
  },
  {
    path: '/user',
    name: 'UserPage',
    component: () => import(/* webpackChunkName: "UserPage" */ '../views/user/UserPage.vue'),
    //component: UserPage,
    meta: {
      needLogin: true,
    },
    children: [
      {
        path: 'info',
        name: 'UserDetailMyInfoPage',
        component: () =>
          import(/* webpackChunkName: "UserDetailMyInfoPage" */ '../views/user/detail/UserDetailMyInfoPage.vue'),
        //component: UserDetailMyInfoPage,
        meta: {
          tab: 'info',
          needLogin: true,
        },
      },
      {
        path: 'item',
        name: 'UserDetailMyItemPage',
        component: () =>
          import(/* webpackChunkName: "UserDetailMyItemPage" */ '../views/user/detail/UserDetailMyItemPage.vue'),
        //component: UserDetailMyItemPage,
        meta: {
          tab: 'item',
          needLogin: true,
        },
      },
      {
        path: 'asset',
        name: 'UserDetailAssetPage',
        component: () =>
          import(/* webpackChunkName: "UserDetailAssetPage" */ '../views/user/detail/UserDetailAssetPage.vue'),
        //component: UserDetailAssetPage,
        meta: {
          tab: 'asset',
          needLogin: true,
        },
      },
      {
        path: 'history',
        name: 'UserDetailHistoryPage',
        component: () =>
          import(/* webpackChunkName: "UserDetailHistoryPage" */ '../views/user/detail/UserDetailHistoryPage.vue'),
        //component: UserDetailHistoryPage,
        meta: {
          tab: 'history',
          needLogin: true,
        },
      },
      {
        path: 'watchlist',
        name: 'UserDetailWatchlistPage',
        component: () =>
          import(/* webpackChunkName: "UserDetailWatchlistPage" */ '../views/user/detail/UserDetailWatchlistPage.vue'),
        // component: UserDetailWatchlistPage,
        meta: {
          tab: 'watchlist',
          needLogin: true,
        },
      },
    ],
  },
  {
    path: '/explorer',
    name: 'ExplorerPage',
    component: () => import(/* webpackChunkName: "ExplorerPage" */ '../views/explorer/ExplorerPage.vue'),
    //  component: ExplorerPage,
    meta: {
      hideFooter: true,
    },
    children: [
      {
        path: 'history',
        name: 'ExplorerMainHistoryPage',
        component: () =>
          import(
            /* webpackChunkName: "ExplorerMainHistoryPage" */ '../views/explorer/main/ExplorerMainHistoryPage.vue'
          ),
        //component: ExplorerMainHistoryPage,
        meta: {
          tab: 'history',
          hideFooter: true,
        },
      },
      {
        path: 'ranking',
        name: 'ExplorerMainRankingPage',
        component: () =>
          import(/* webpackChunkName: "ExplorerMainRakingPage" */ '../views/explorer/main/ExplorerMainRakingPage.vue'),
        //component: ExplorerMainRakingPage,
        meta: {
          tab: 'ranking',
          hideFooter: true,
        },
      },
    ],
  },
  {
    path: '/staking',
    name: 'StakingPage',
    component: () => import(/* webpackChunkName: "StakingPage" */ '../views/staking/StakingPage.vue'),
    //component: StakingPage,
    meta: {
      hideFooter: true,
      needLogin: true,
    },
    children: [
      {
        path: 'trix',
        name: 'StakingTrixPage',
        component: () =>
          import(/* webpackChunkName: "StakingTrixPage" */ '../views/staking/detail/StakingTrixPage.vue'),
        //component: StakingTrixPage,
        meta: {
          tab: 'trix',
          hideFooter: true,
          needLogin: true,
        },
      },
      {
        path: 'activity',
        name: 'StakingMyActivityPage',
        component: () =>
          import(/* webpackChunkName: "StakingMyActivityPage" */ '../views/staking/detail/StakingMyActivityPage.vue'),
        //component: StakingMyActivityPage,
        meta: {
          tab: 'activity',
          hideFooter: true,
          needLogin: true,
        },
      },
    ],
  },
  {
    path: '/request/complete',
    name: 'RequestSuccessPage',
    component: () => import(/* webpackChunkName: "RequestSuccessPage" */ '../views/RequestSuccessPage.vue'),
    //component: RequestSuccessPage,
  },
  {
    path: '/customer/privacy-policy',
    name: 'CustomerPrivacyPolicyPage',
    component: () =>
      import(/* webpackChunkName: "CustomerPrivacyPolicyPage" */ '../views/customer/CustomerPrivacyPolicyPage.vue'),
    //component: CustomerPrivacyPolicyPage,
    children: [
      {
        path: '202102',
        name: 'CustomerPrivacyPolicy202102',
        component: () =>
          import(
            /* webpackChunkName: "CustomerPrivacyPolicy202102" */ '../views/customer/privacyPolicy/CustomerPrivacyPolicy202102.vue'
          ),
        //component: CustomerPrivacyPolicy202102,
      },
      {
        path: '202103',
        name: 'CustomerPrivacyPolicy202103',
        component: () =>
          import(
            /* webpackChunkName: "CustomerPrivacyPolicy202103" */ '../views/customer/privacyPolicy/CustomerPrivacyPolicy202103.vue'
          ),
        //component: CustomerPrivacyPolicy202103,
      },
    ],
  },
  {
    path: '/customer/usage-terms',
    name: 'CustomerUsageTermsPage',
    component: () =>
      import(/* webpackChunkName: "CustomerUsageTermsPage" */ '../views/customer/CustomerUsageTermsPage.vue'),
    //component: CustomerUsageTermsPage,
    children: [
      {
        path: '202102',
        name: 'CustomerUsageTerms202102',
        component: () =>
          import(
            /* webpackChunkName: "CustomerUsageTerms202102" */ '../views/customer/usageTerms/CustomerUsageTerms202102.vue'
          ),
        //component: CustomerUsageTerms202102,
      },
      {
        path: '202103',
        name: 'CustomerUsageTerms202103',
        component: () =>
          import(
            /* webpackChunkName: "CustomerUsageTerms202103" */ '../views/customer/usageTerms/CustomerUsageTerms202103.vue'
          ),
        //component: CustomerUsageTerms202103,
      },
    ],
  },
  {
    path: '/customer/faq',
    name: 'CustomerFaqPage',
    component: () => import(/* webpackChunkName: "CustomerFaqPage" */ '../views/customer/CustomerFaqPage.vue'),
    //component: CustomerFaqPage,
    children: [
      {
        path: 'popular',
        name: 'CustomerFaqMostPopularPage',
        component: () =>
          import(
            /* webpackChunkName: "CustomerFaqMostPopularPage" */ '../views/customer/faq/CustomerFaqMostPopularPage.vue'
          ),
        //component: CustomerFaqMostPopularPage,
      },
      {
        path: 'general',
        name: 'CustomerFaqGeneralPage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqGeneralPage" */ '../views/customer/faq/CustomerFaqGeneralPage.vue'),
        //component: CustomerFaqGeneralPage,
      },
      {
        path: 'sale',
        name: 'CustomerFaqSellSalePage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqSellSalePage" */ '../views/customer/faq/CustomerFaqSellSalePage.vue'),
        //component: CustomerFaqSellSalePage,
      },
      {
        path: 'auction',
        name: 'CustomerFaqSellAuctionPage',
        component: () =>
          import(
            /* webpackChunkName: "CustomerFaqSellAuctionPage" */ '../views/customer/faq/CustomerFaqSellAuctionPage.vue'
          ),
        //component: CustomerFaqSellAuctionPage,
      },
      {
        path: 'buy',
        name: 'CustomerFaqBuyPage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqBuyPage" */ '../views/customer/faq/CustomerFaqBuyPage.vue'),
        //component: CustomerFaqBuyPage,
      },
      {
        path: 'staking',
        name: 'CustomerFaqStakingPage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqStakingPage" */ '../views/customer/faq/CustomerFaqStakingPage.vue'),
        // component: CustomerFaqStakingPage,
      },
      {
        path: 'account',
        name: 'CustomerFaqAccountPage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqAccountPage" */ '../views/customer/faq/CustomerFaqAccountPage.vue'),
        //component: CustomerFaqAccountPage,
      },
      {
        path: 'additional',
        name: 'CustomerFaqAdditionalSupportPage',
        component: () =>
          import(
            /* webpackChunkName: "CustomerFaqAdditionalSupportPage" */ '../views/customer/faq/CustomerFaqAdditionalSupportPage.vue'
          ),
        //component: CustomerFaqAdditionalSupportPage,
      },
      {
        path: 'search',
        name: 'CustomerFaqSearchPage',
        component: () =>
          import(/* webpackChunkName: "CustomerFaqSearchPage" */ '../views/customer/faq/CustomerFaqSearchPage.vue'),
        //component: CustomerFaqSearchPage,
      },
    ],
  },
  {
    path: '/wallet/connect',
    name: 'WalletConnectPage',
    component: () => import(/* webpackChunkName: "WalletConnectPage" */ '../views/wallet/WalletConnectPage.vue'),
    //component: WalletConnectPage,
  },
  {
    path: '/render',
    name: 'RenderPage',
    component: () => import(/* webpackChunkName: "RenderPage" */ '../views/render/RenderPage.vue'),
    //component: RenderPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.savedPosition) {
      return;
    }

    return {
      x: 0,
      y: 0,
    };
  },
});

export default router;
