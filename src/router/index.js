import Vue from 'vue'
import VueRouter from 'vue-router'

import LandingPage from '@/views/LandingPage.vue'
import MarketHomePage from '@/views/MarketHomePage'

import MarketplaceBuyPage from '@/views/marketplace/MarketplaceBuyPage';
import MarketplaceSellPage from '@/views/marketplace/MarketplaceSellPage';
import CollectionPage from '@/views/marketplace/CollectionPage';

import AssetItemPage from '@/views/asset/item/AssetItemPage'
import AssetItemDescriptionPage from '@/views/asset/item/AssetItemDescriptionPage'
import AssetItemCollectionPage from '@/views/asset/item/AssetItemCollectionPage'
import AssetItemChainPage from '@/views/asset/item/AssetItemChainPage'
import AssetItemHistoryPage from '@/views/asset/item/AssetItemHistoryPage'

import AssetFormMakeOfferPage from '@/views/asset/form/AssetFormMakeOfferPage'
import AssetFormNegoPage from '@/views/asset/form/AssetFormNegoPage'
import AssetFormBidPage from '@/views/asset/form/AssetFormBidPage'

import UserPage from '@/views/user/UserPage'
import UserDetailMyInfoPage from '@/views/user/detail/UserDetailMyInfoPage'
import UserDetailMyItemPage from '@/views/user/detail/UserDetailMyItemPage'
import UserDetailAssetPage from '@/views/user/detail/UserDetailAssetPage'
import UserDetailHistoryPage from '@/views/user/detail/UserDetailHistoryPage'
import UserDetailWatchlistPage from '@/views/user/detail/UserDetailWatchlistPage'

import ExplorerPage from '@/views/explorer/ExplorerPage'
import ExplorerMainHistoryPage from '@/views/explorer/main/ExplorerMainHistoryPage'
import ExplorerMainRakingPage from '@/views/explorer/main/ExplorerMainRakingPage'

import StakingPage from '@/views/staking/StakingPage'
import StakingTrixPage from '@/views/staking/detail/StakingTrixPage'
import StakingMyActivityPage from '@/views/staking/detail/StakingMyActivityPage'

import RequestSuccessPage from '@/views/RequestSuccessPage'

import CustomerPrivacyPolicyPage from '@/views/customer/CustomerPrivacyPolicyPage'
import CustomerUsageTermsPage from '@/views/customer/CustomerUsageTermsPage'
import CustomerFaqPage from '@/views/customer/CustomerFaqPage'

import CustomerFaqMostPopularPage from '@/views/customer/faq/CustomerFaqMostPopularPage';
import CustomerFaqGeneralPage from '@/views/customer/faq/CustomerFaqGeneralPage';
import CustomerFaqSellSalePage from '@/views/customer/faq/CustomerFaqSellSalePage';
import CustomerFaqSellAuctionPage from '@/views/customer/faq/CustomerFaqSellAuctionPage';
import CustomerFaqBuyPage from '@/views/customer/faq/CustomerFaqBuyPage';
import CustomerFaqStakingPage from '@/views/customer/faq/CustomerFaqStakingPage';
import CustomerFaqAccountPage from '@/views/customer/faq/CustomerFaqAccountPage';
import CustomerFaqAdditionalSupportPage from '@/views/customer/faq/CustomerFaqAdditionalSupportPage';
import CustomerFaqSearchPage from '@/views/customer/faq/CustomerFaqSearchPage';

import CustomerPrivacyPolicy202102 from '@/views/customer/privacyPolicy/CustomerPrivacyPolicy202102';
import CustomerPrivacyPolicy202103 from '@/views/customer/privacyPolicy/CustomerPrivacyPolicy202103';

import CustomerUsageTerms202102 from '@/views/customer/usageTerms/CustomerUsageTerms202102'
import CustomerUsageTerms202103 from '@/views/customer/usageTerms/CustomerUsageTerms202103'

import WalletConnectPage from '@/views/wallet/WalletConnectPage';

import RenderPage from '@/views/render/RenderPage';

Vue.use(VueRouter)

const indexPageRoute = {
  path: '/',
  name: 'IndexPage',
  component: LandingPage,
  meta: {
    hideNav: true,
    hideFooter: true
  }
}

const routes = [
  {
    path: '*',
    redirect: indexPageRoute
  },
  {
    ...indexPageRoute
  },
  {
    path: '/home',
    name: 'MarketHomePage',
    component: MarketHomePage
  },
  {
    path: '/buy',
    name: 'MarketBuyPage',
    component: MarketplaceBuyPage,
    meta: {
      hideFooter: true
    }
  },
  {
    path: '/sell',
    name: 'MarketSellPage',
    component: MarketplaceSellPage,
    meta: {
      hideFooter: true
    }
  },
  {
    path: '/collection',
    name: 'ColllectionPage',
    component: CollectionPage,
    meta: {
      maxWidth: '1220px',
    }
  },
  {
    path: '/asset/item/:tokenAddress/:tokenId',
    name: 'AssetItemPage',
    component: AssetItemPage,
    children: [
      {
        path: 'description',
        name: 'AssetItemDescriptionPage',
        component: AssetItemDescriptionPage,
        meta: {
          tab: 'description',
          savedPosition: true
        }
      },
      {
        path: 'collection',
        name: 'AssetItemCollectionPage',
        component: AssetItemCollectionPage,
        meta: {
          tab: 'collection',
          savedPosition: true
        }
      },
      {
        path: 'chain',
        name: 'AssetItemChainPage',
        component: AssetItemChainPage,
        meta: {
          tab: 'chain',
          savedPosition: true
        }
      },
      {
        path: 'history',
        name: 'AssetItemHistoryPage',
        component: AssetItemHistoryPage,
        meta: {
          tab: 'history',
          savedPosition: true
        }
      }
    ]
  },
  {
    path: '/asset/make-offer/:howTo',
    name: 'AssetFormMakeOfferPage',
    component: AssetFormMakeOfferPage,
    meta: {
      needLogin: true
    }
  },
  {
    path: '/asset/bid/:tokenAddress/:tokenId',
    name: 'AssetFormBidPage',
    component: AssetFormBidPage,
    meta: {
      needLogin: true
    }
  },
  {
    path: '/asset/negotiation/:tokenAddress/:tokenId',
    name: 'AssetFormNegoPage',
    component: AssetFormNegoPage,
    meta: {
      needLogin: true
    }
  },
  {
    path: '/user',
    name: 'UserPage',
    component: UserPage,
    meta: {
      needLogin: true
    },
    children: [
      {
        path: 'info',
        name: 'UserDetailMyInfoPage',
        component: UserDetailMyInfoPage,
        meta: {
          tab: 'info',
          needLogin: true
        }
      },
      {
        path: 'item',
        name: 'UserDetailMyItemPage',
        component: UserDetailMyItemPage,
        meta: {
          tab: 'item',
          needLogin: true
        }
      },
      {
        path: 'asset',
        name: 'UserDetailAssetPage',
        component: UserDetailAssetPage,
        meta: {
          tab: 'asset',
          needLogin: true
        }
      },
      {
        path: 'history',
        name: 'UserDetailHistoryPage',
        component: UserDetailHistoryPage,
        meta: {
          tab: 'history',
          needLogin: true
        }
      },
      {
        path: 'watchlist',
        name: 'UserDetailWatchlistPage',
        component: UserDetailWatchlistPage,
        meta: {
          tab: 'watchlist',
          needLogin: true
        }
      }
    ]
  },
  {
    path: '/explorer',
    name: 'ExplorerPage',
    component: ExplorerPage,
    meta: {
      hideFooter: true
    },
    children: [
      {
        path: 'history',
        name: 'ExplorerMainHistoryPage',
        component: ExplorerMainHistoryPage,
        meta: {
          tab: 'history',
          hideFooter: true
        }
      },
      {
        path: 'ranking',
        name: 'ExplorerMainRankingPage',
        component: ExplorerMainRakingPage,
        meta: {
          tab: 'ranking',
          hideFooter: true
        }
      }
    ]
  },
  {
    path: '/staking',
    name: 'StakingPage',
    component: StakingPage,
    meta: {
      hideFooter: true,
      needLogin: true
    },
    children: [
      {
        path: 'trix',
        name: 'StakingTrixPage',
        component: StakingTrixPage,
        meta: {
          tab: 'trix',
          hideFooter: true,
          needLogin: true
        }
      },
      {
        path: 'activity',
        name: 'StakingMyActivityPage',
        component: StakingMyActivityPage,
        meta: {
          tab: 'activity',
          hideFooter: true,
          needLogin: true
        }
      }
    ]
  },
  {
    path: '/request/complete',
    name: 'RequestSuccessPage',
    component: RequestSuccessPage
  },
  {
    path: '/customer/privacy-policy',
    name: 'CustomerPrivacyPolicyPage',
    component: CustomerPrivacyPolicyPage,
    children: [
      {
        path: '202102',
        name: 'CustomerPrivacyPolicy202102',
        component: CustomerPrivacyPolicy202102
      },
      {
        path: '202103',
        name: 'CustomerPrivacyPolicy202103',
        component: CustomerPrivacyPolicy202103
      },
    ]
  },
  {
    path: '/customer/usage-terms',
    name: 'CustomerUsageTermsPage',
    component: CustomerUsageTermsPage,
    children: [
      {
        path: '202102',
        name: 'CustomerUsageTerms202102',
        component: CustomerUsageTerms202102
      },
      {
        path: '202103',
        name: 'CustomerUsageTerms202103',
        component: CustomerUsageTerms202103
      }
    ]
  },
  {
    path: '/customer/faq',
    name: 'CustomerFaqPage',
    component: CustomerFaqPage,
    children: [
      {
        path: 'popular',
        name: 'CustomerFaqMostPopularPage',
        component: CustomerFaqMostPopularPage
      },
      {
        path: 'general',
        name: 'CustomerFaqGeneralPage',
        component: CustomerFaqGeneralPage
      },
      {
        path: 'sale',
        name: 'CustomerFaqSellSalePage',
        component: CustomerFaqSellSalePage
      },
      {
        path: 'auction',
        name: 'CustomerFaqSellAuctionPage',
        component: CustomerFaqSellAuctionPage
      },
      {
        path: 'buy',
        name: 'CustomerFaqBuyPage',
        component: CustomerFaqBuyPage
      },
      {
        path: 'staking',
        name: 'CustomerFaqStakingPage',
        component: CustomerFaqStakingPage
      },
      {
        path: 'account',
        name: 'CustomerFaqAccountPage',
        component: CustomerFaqAccountPage
      },
      {
        path: 'additional',
        name: 'CustomerFaqAdditionalSupportPage',
        component: CustomerFaqAdditionalSupportPage
      },
      {
        path: 'search',
        name: 'CustomerFaqSearchPage',
        component: CustomerFaqSearchPage
      }
    ]
  },
  {
    path: '/wallet/connect',
    name: 'WalletConnectPage',
    component: WalletConnectPage
  },
  {
    path: '/render',
    name: 'RenderPage',
    component: RenderPage
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if(to.meta.savedPosition) {
      return
    }

    return {
      x: 0,
      y: 0
    }
  }
})

export default router
