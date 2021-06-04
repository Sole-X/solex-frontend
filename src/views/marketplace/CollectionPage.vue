<template>
  <section class="collection-page">
    <section class="collection-page-banner">
      <div class="collection-page-banner-main">
        {{ $route.query.collection || '' }}
        <img v-if="isWhitelist" :src="$static.getFileURL('img/icon/ic-whitelist-badge.svg')" />
      </div>
      <div class="collection-page-banner-sub">{{ $route.query.collection || '' }} is ...
        {{ $t('General.LandingPageDescription')[0] }}
        {{ $t('General.LandingPageDescription')[1] }}
      </div>
      <div class="collection-page-banner-icons">
        <div class="collection-page-banner-icons-icon" v-for="icon in getBannerIcons">
          <img :src="icon.image">
        </div>
      </div>
    </section>
    <section class="collection-page-balance">
      <div class="collection-page-balance-items">
        <div class="collection-page-balance-items-item" v-for="item in getBalanceItems()">
          <div class="collection-page-balance-items-item-value">
            <span v-if="item.symbol" class="symbol">{{ item.symbol }}</span>
            <span class="value">{{ item.value | addComma }}</span>
          </div>
          <div class="collection-page-balance-items-item-key">{{ item.name }}</div>
        </div>
      </div>
    </section>
    <section class="collection-page-items">
      <header class="collection-page-items-header">
        <div class="collection-page-items-header-title">
          Recently Listed
        </div>
        <div class="collection-page-items-header-more" @click="recentlyMoreClicked">
          <span>전체보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8">
            <g fill="none" fill-rule="evenodd" stroke-linecap="round">
              <g stroke="#C1C5CC" stroke-width="2">
                <path d="M67 7L67 11 63 11" transform="translate(-1316 -1156) translate(1252 1151) rotate(-45 65 9)"/>
              </g>
            </g>
          </svg>
        </div>
      </header>
      <main class="collection-page-items-main">
        <asset-item-card-market-place
            class="collection-page-items-main-item"
            v-for="item in getRecentlyItems()"
            :item="item"
            :key="item.id"
            :type="'sell'"
            :status="items.recently.status"
        />
      </main>
    </section>
    <section class="collection-page-items">
      <header class="collection-page-items-header">
        <div class="collection-page-items-header-title">
          On Sale
        </div>
        <div class="collection-page-items-header-more" @click="onSaleMoreClicked">
          <span>전체보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8">
            <g fill="none" fill-rule="evenodd" stroke-linecap="round">
              <g stroke="#C1C5CC" stroke-width="2">
                <path d="M67 7L67 11 63 11" transform="translate(-1316 -1156) translate(1252 1151) rotate(-45 65 9)"/>
              </g>
            </g>
          </svg>
        </div>
      </header>
      <main class="collection-page-items-main">
        <asset-item-card-market-place
            class="collection-page-items-main-item"
            v-for="item in getOnSaleItems()"
            :item="item"
            :key="item.id"
            :type="'sell'"
            :status="items.onSale.status"
        />
      </main>
    </section>
    <section class="collection-page-items">
      <header class="collection-page-items-header">
        <div class="collection-page-items-header-title">
          On Auction
        </div>
        <div class="collection-page-items-header-more" @click="onAuctionMoreClicked">
          <span>전체보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8">
            <g fill="none" fill-rule="evenodd" stroke-linecap="round">
              <g stroke="#C1C5CC" stroke-width="2">
                <path d="M67 7L67 11 63 11" transform="translate(-1316 -1156) translate(1252 1151) rotate(-45 65 9)"/>
              </g>
            </g>
          </svg>
        </div>
      </header>
      <main class="collection-page-items-main">
        <asset-item-card-market-place
            class="collection-page-items-main-item"
            v-for="item in getOnAuctionItems()"
            :item="item"
            :key="item.id"
            :type="'sell'"
            :status="items.onAuction.status"
        />
      </main>
    </section>
  </section>
</template>

<script>
import AssetItemCardMarketPlace from '@/components/asset/item/AssetItemCardMarketPlace';
import { mapGetters } from 'vuex';
let $t, self
let io;

export default {
  name: 'CollectionPage',

  mixins: [],

  props: [],

  created() {
    self = this
    $t = this.$t.bind(this)

    // 이미지 스크롤에 따른 레이지 로딩을 위해.
    io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          if (entry.target.hasChildNodes()) {
            const elem = entry.target.childNodes[0];
            const imgsrc = elem.dataset?.imgsrc || '';
            if (imgsrc.length > 0) {
              elem.style.backgroundImage = `url(${imgsrc})`;
              elem.style.backgroundSize = 'contain';
            }
          }
        } else {
          // in current, no action.
        }
      })
    });
  },

  mounted() {
    this.initPage();
  },

  updated() {
    if (this.items.recently.list.length > 0 ) {
      this.imageLazyLoading();
    }
  },

  beforeDestroy() {

  },

  data() {
    return {
      amount: {
        status: 'idle',
        items: 0,
        publishers: 0,
        owners: 0,
        averagePrice: 0,
        volumeTraded: 0,
      },
      items: {
        recently: {
          status: 'idle',
          list: [],
        },
        onSale: {
          status: 'idle',
          list: [],
        },
        onAuction: {
          status: 'idle',
          list: [],
        }
      }
    }
  },

  computed: {
    ...mapGetters([
        'getSupportNft'
    ]),

    getBannerIcons() {
      const { getFileURL } = this.$static;
      return [
        {
          name: 'contract',
          image: getFileURL('img/icon/ic-copy-wh.svg'),
          onclick: () => {
            // TODO: Link to collection url
          }
        },
        {
          name: 'website',
          image: getFileURL('img/icon/ic-website-wh.svg'),
          onclick: () => {
            // TODO: Link to website
          }
        },
        {
          name: 'discord',
          image: getFileURL('img/icon/ic-sns-discord-wh.svg'),
          onclick: () => {
            // TODO: Link to triumphx's discord channel. (about this collection.)
          }
        },
        {
          name: 'medium',
          image: getFileURL('img/icon/ic-medium-collection.svg'),
          onclick: () => {
            // TODO: Link to tirumphx's Medium post. (about this collection.)
          }
        },
        {
          name: 'twitter',
          image: getFileURL('img/icon/ic-sns-twitter-wh.svg'),
          onclick: () => {
            // TODO: Link to triumphx's twitter message. (about this collection.)
          }
        },
      ];
    },

    isWhitelist() {
      const collection = _.find(this.getSupportNft, nft => {
        if (this.$wallet.isSameAddress(nft.tokenAddress, this.$route.query.collectionAddress)) return true;
        return false;
      });

      if (collection) return true;
      return false;
    }
  },

  watch: {
    'amount.items'(newVal, oldVal) {
      if (this.amount.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'amount.publishers'(newVal, oldVal) {
      if (this.amount.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'amount.owners'(newVal, oldVal) {
      if (this.amount.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'amount.averagePrice'(newVal, oldVal) {
      if (this.amount.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'amount.volumeTraded'(newVal, oldVal) {
      if (this.amount.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'items.recently.list'(newVal, oldVal) {
      if (this.items.recently.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'items.onSale.list'(newVal, oldVal) {
      if (this.items.onSale.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },

    'items.onAuction.list'(newVal, oldVal) {
      if (this.items.onAuction.status === 'idle') {
        // TODO: 일정 시간 이후, 다시 HTTP 통신
      }
    },
  },

  methods: {
    async initPage(payload = {}) {
      let result;

      const collectionAddress = this.$route.query.collectionAddress;
      this.amount.status = 'pending';
      try {
        result = await this.$http.get('getCollectionInfo', {
          urlParams: {
            collectionAddr: collectionAddress
          }
        });
      } catch (e) {
        this.amount.status = 'idle';
      }

      if (result.success) {
        this.amount.items = result.info?.nftCnt || 0;
        this.amount.publishers = result.info?.publisherCnt || 0;
        this.amount.owners = result.info?.ownerCnt || 0;
        this.amount.averagePrice = result.info?.avgPrice || 0;
        this.amount.volumeTraded = result.info?.volume || 0;
        this.amount.status = 'complete';
      } else {
        this.amount.status = 'idle';
      }

      // get Recently Items
      this.items.recently.status = 'pending';
      try {
        result = await this.$http.get('getLatestNft', {
          urlQuery: {
            collection: collectionAddress,
            limit: 5
          }
        });
      } catch (e) {
        this.items.recently.status = 'idle';
      }

      if (result.success) {
        this.items.recently.list = result.info?.items || [];
        this.items.recently.status = 'complete';
      } else {
        this.items.recently.status = 'idle';
      }

      // get OnSale Items
      this.items.onSale.status = 'pending';
      try {
        result = await this.$http.get('getLatestNft', {
          urlQuery: {
            collection: collectionAddress,
            limit: 5,
            status: 'SELL',
            lifeStatus: 'START',
          }
        });
      } catch (e) {
        this.items.onSale.status = 'idle';
      }

      if (result.success) {
        this.items.onSale.list = result.info?.items || [];
        this.items.onSale.status = 'complete';
      } else {
        this.items.onSale.status = 'idle';
      }

      // get OnAuction Items
      this.items.onAuction.status = 'pending';
      try {
        result = await this.$http.get('getLatestNft', {
          urlQuery: {
            collection: collectionAddress,
            limit: 5,
            status: 'AUCTION',
            lifeStatus: 'START',
          }
        });
      } catch (e) {
        this.items.onAuction.status = 'idle';
      }

      if (result.success) {
        this.items.onAuction.list = result.info?.items || [];
        this.items.onAuction.status = 'complete';
      } else {
        this.items.onAuction.status = 'idle';
      }

    },

    getBalanceItems() {
      if (this.amount.status === 'idle' || this.amount.status === 'pending') {
        return [
          {
            value: '-',
            name: 'Items',
          },
          {
            value: '-',
            name: 'Publishers',
          },
          {
            value: '-',
            name: 'Owners',
          },
          {
            symbol: '$',
            value: '-',
            name: 'Average Price',
          },
          {
            symbol: '$',
            value: '-',
            name: 'Volume Traded',
          },
        ]
      }

      const amount = {
        items: this.amount.items,
        publishers: this.amount.publishers,
        owners: this.amount.owners,
        averagePrice: this.amount.averagePrice,
        volumeTraded: this.amount.volumeTraded,
      }

      for (const key in amount) {
        const value = String(amount[key]);
        let newVal = '';
        for (const c of value) {
          if (c === '.') {
            break;
          }
          newVal += c;
        }

        if (newVal.length > 6) {
          newVal = newVal.slice(0, newVal.length - 6) + 'M';
          amount[key] = newVal;
        } else if (newVal.length > 3) {
          newVal = newVal.slice(0, newVal.length - 3) + 'K';
          amount[key] = newVal;
        }
      }

      return [
        {
          value: amount.items,
          name: 'Items',
        },
        {
          value: amount.publishers,
          name: 'Publishers',
        },
        {
          value: amount.owners,
          name: 'Owners',
        },
        {
          symbol: '$',
          value: amount.averagePrice,
          name: 'Average Price',
        },
        {
          symbol: '$',
          value: amount.volumeTraded,
          name: 'Volume Traded',
        },
      ]
    },

    getRecentlyItems() {
      if (this.items.recently.status === 'idle' || this.items.recently.status === 'pending') {
        return [
          {
            id: 'recently1',
          },
          {
            id: 'recently2',
          },
          {
            id: 'recently3',
          },
          {
            id: 'recently4',
          },
          {
            id: 'recently5',
          },
        ]
      }
      return this.items.recently.list;
    },

    getOnSaleItems() {
      if (this.items.onSale.status === 'idle' || this.items.onSale.status === 'pending') {
        return [
          {
            id: 'onSale1',
          },
          {
            id: 'onSale2',
          },
          {
            id: 'onSale3',
          },
          {
            id: 'onSale4',
          },
          {
            id: 'onSale5',
          },
        ]
      }
      return this.items.onSale.list;
    },

    getOnAuctionItems() {
      if (this.items.onAuction.status === 'idle' || this.items.onAuction.status === 'pending') {
        return [
          {
            id: 'onAuction1',
          },
          {
            id: 'onAuction2',
          },
          {
            id: 'onAuction3',
          },
          {
            id: 'onAuction4',
          },
          {
            id: 'onAuction5',
          },
        ]
      }
      return this.items.onAuction.list;
    },

    imageLazyLoading() {
      const imageElemList = document.querySelectorAll('.asset-item-card2');
      imageElemList.forEach((elem) => {
        io.observe(elem);
      })
    },

    recentlyMoreClicked() {
      this.$router.push({
        path: '/sell',
        query: {
          collections: this.$route.query.collection,
        }
      })
    },

    onSaleMoreClicked() {
      this.$router.push({
        path: '/sell',
        query: {
          collections: this.$route.query.collection,
          status: 'SALES',
        }
      })
    },

    onAuctionMoreClicked() {
      this.$router.push({
        path: '/sell',
        query: {
          collections: this.$route.query.collection,
          status: 'AUCTIONS',
        }
      })
    },
  },

  components: {
    AssetItemCardMarketPlace
  }
}
</script>