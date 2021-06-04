<template>
  <div class="marketplace-filter-wrapper">
    <div class="marketplace-filter">
      <!-- filter by -->
      <section class="marketplace-filter-item filter-by" id="market-sell-filter-by" v-show="filterby && getNumOfFilterBy > 0 && sections.includes('filterBy')">
        <div class="marketplace-filter-item-top">
          <div class="marketplace-filter-title">{{ $t('Market.SelectedFilter') }}</div>
          <div class="marketplace-filter-reset">
            <div class="marketplace-filter-reset-button" @click="resetClicked">{{ $t('Market.FilterReset') }}</div>
            <img :src="$static.getFileURL('img/icon/ic-refresh-gray.svg')" @click="resetClicked">
          </div>
        </div>
        <div class="marketplace-filter-popover" ref='filterby'>
          <div class="marketplace-filter-popover-filterby" v-for="item in filterby" v-show="item.section !== 'order'" :data-obj="JSON.stringify(item)">
            <div :data-item="JSON.stringify(item)">{{ item.appear && item.appear() }}</div>
            <img :src="$static.getFileURL('img/icon/ic-close-gray.svg')" :data-item="JSON.stringify(item)" @click="filterCloseClicked">
          </div>
        </div>
      </section>

      <!-- status -->
      <section class="marketplace-filter-item" id="market-sell-status" v-show="this.sections.includes('status')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'status')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterStatus') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.status" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.status ? itemsHeights['status'] + 'px' : '0px'}"
        >
          <div ref="status">
            <div class="marketplace-filter-popover-item" v-if="page !== 'buy'">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'status', value: 'SALES'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => statusClicked(event, 'SALES')" :data-obj="JSON.stringify({section: 'status', value: 'SALES'})">{{ $t('Market.FilterStatusItems')[0] }}</div>
              </div>
              <div class="item-value">{{ nftCnt.nftCntSell || 0 }}</div>
            </div>
            <div class="marketplace-filter-popover-item" v-if="page !== 'buy'">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'status', value: 'AUCTIONS'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => statusClicked(event, 'AUCTIONS')" :data-obj="JSON.stringify({section: 'status', value: 'AUCTIONS'})">{{ $t('Market.FilterStatusItems')[1] }}</div>
              </div>
              <div class="item-value">{{ nftCnt.nftCntAuction || 0 }}</div>
            </div>
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'status', value: 'SOLDITEMS'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => statusClicked(event, 'SOLDITEMS')" :data-obj="JSON.stringify({section: 'status', value: 'SOLDITEMS'})">{{ $t('Market.FilterStatusItems')[2] }}</div>
              </div>
              <div class="item-value">{{ page === 'buy' ? nftCnt.nftCntBuyDone : nftCnt.nftCntDone || 0 }}</div>
            </div>
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'status', value: 'PROMOTION'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => statusClicked(event, 'PROMOTION')" :data-obj="JSON.stringify({section: 'status', value: 'PROMOTION'})">{{ $t('Market.FilterStatusItems')[3] }}</div>
              </div>
              <div class="item-value">{{ nftCnt.nftCntPromotion || 0 }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- blockchain -->
      <section class="marketplace-filter-item" id="market-sell-blockchain">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'blockchain')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterBlockchain') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.blockchain" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
          class="marketplace-filter-popover"
          :style="{'height': itemsShows.blockchain ? itemsHeights['blockchain'] + 'px' : '0'}"
        >
          <div ref="blockchain">
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'blockchain', value: 'ETHEREUM'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => blockchainClicked(event, 'ETHEREUM')" data-value='ETHEREUM'>{{ $t('Market.FilterBlockchainItems')[0] }}</div>
              </div>
              <div class="item-value">{{ getNftCnt('CateETH') }}</div>
            </div>
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'blockchain', value: 'KLAYTN'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => blockchainClicked(event, 'KLAYTN')" data-value='KLAYTN'>{{ $t('Market.FilterBlockchainItems')[1] }}</div>
              </div>
              <div class="item-value">{{ getNftCnt('CateKLAY') }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- categories -->
      <section class="marketplace-filter-item" id="market-sell-categories" v-show="this.sections.includes('categories')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'categories')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterCategories') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.categories" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.categories ? itemsHeights['categories'] + 'px' : '0'}"
        >
          <div ref="categories">
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'categories', value: 'ART'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => categoriesClicked(event, 'ART')" data-value='ART'>{{ $t('Market.FilterCategoriesItems')[2] }}</div>
              </div>
              <div class="item-value">{{ getNftCnt('CateART') }}</div>
            </div>
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'categories', value: 'COLLECTIBLES'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => categoriesClicked(event, 'COLLECTIBLES')" data-value='COLLECTIBLES'>{{ $t('Market.FilterCategoriesItems')[3] }}</div>
              </div>
              <div class="item-value">{{ getNftCnt('CateCOLLECT') }}</div>
            </div>
            <div class="marketplace-filter-popover-item">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'categories', value: 'ETC'})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => categoriesClicked(event, 'ETC')" data-value='ETC'>{{ $t('Market.FilterCategoriesItems')[4] }}</div>
              </div>
              <div class="item-value">{{ getNftCnt('CateETC') }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- collections -->
      <section class="marketplace-filter-item" id="market-sell-collections" v-show="this.sections.includes('collections')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'collections')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterCollections') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.collections" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.collections ? '140px' : '0'}"
        >
          <div ref="collections">
            <div
                v-for="(item, idx) in originalFilter.collections"
                class="marketplace-filter-popover-collection disabled marketplace-filter-popover-item-title"
                @click="(event) => collectionsClicked(event, item.name, item)"
                :key="idx"
                :data-sideinfo="nftCnt[`sellCollection${item.symbol}`]"
                :data-obj="JSON.stringify({section: 'collections', value: item.name})"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </section>

      <!-- currencies -->
      <section class="marketplace-filter-item" id="market-sell-currencies" v-show="this.sections.includes('currencies')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'currencies')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterCurrencies') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.currencies" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.currencies ? '150px' : '0'}"
        >
          <div ref="currencies">
            <div class="marketplace-filter-popover-item" v-for="(item, idx) in this.originalFilter.currencies">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'currencies', value: item.name, symbol: item.symbol})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => currenciesClicked(event, item.name, item)">{{ item.symbol }}</div>
              </div>
              <div class="item-value">{{ getNftCnt(`Currency${item.symbol}`) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- price -->
      <section class="marketplace-filter-item" id="market-sell-price" v-show="this.sections.includes('price')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'price')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterPrice') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.price" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.price ? itemsHeights['price'] + 'px' : '0'}"
        >
          <div ref="price">
            <select name="currency" ref="price-select" @change="currencyInPriceChanged">
              <option value="" selected disabled hidden>select currency</option>
              <option v-for="(item, idx) in this.originalFilter.currencies" :value="item.symbol">{{ item.symbol }}</option>
            </select>

            <div class="marketplace-filter-popover-item" v-for="(item, idx) in this.originalFilter.price" ref="priceItems">
              <div
                  class="marketplace-filter-popover-item-title"
                  :data-obj="JSON.stringify({section: 'price', ...item})"
              >
                <div class="red-dot disabled"></div>
                <div class="item-value" @click="(event) => priceClicked(event, item.value, item)">{{ item.name }}</div>
              </div>
            </div>
            <section class="marketplace-filter-popover-price-input-section">
              <div class="marketplace-filter-popover-price-input-wrap">
                <input class="marketplace-filter-popover-price-input" type="number" placeholder="Min" ref="priceMin" @keyup="priceKeyUpped">
              </div>
              <span class="marketplace-filter-popover-price-span">~</span>
              <div class="marketplace-filter-popover-price-input-wrap">
                <input class="marketplace-filter-popover-price-input has-img" type="number" placeholder="Max" ref="priceMax" @keyup="priceKeyUpped">
                <img :src="$static.getFileURL('img/icon/ic-search-gray.svg')" @click="priceSearchClicked">
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="marketplace-filter-item" id="market-sell-publisher" v-show="this.sections.includes('publisher')">
        <div class="marketplace-filter-item-top" @click="event => topClicked(event, 'publisher')">
          <div class="marketplace-filter-title">{{ $t('Market.FilterPublisher') }}</div>
          <img class="marketplace-filter-item-top-chevron" v-if="!itemsShows.publisher" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')">
          <img class="marketplace-filter-item-top-chevron" v-else :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')">
        </div>
        <div
            class="marketplace-filter-popover"
            :style="{'height': itemsShows.publisher ? '175px' : '0'}"
        >
          <div ref="publisher" class="marketplace-filter-popover-publisher">
            <div class="marketplace-filter-popover-publisher-input-container">
              <input type="text" class="marketplace-filter-popover-input" v-model="publisherInput" v-on:keyup.enter="publisherSubmitClicked" />
              <img :src="$static.getFileURL('img/icon/ic-search-gray.svg')" @click="publisherSubmitClicked" />
            </div>
            <div class="marketplace-filter-popover-publisher-list" ref="publisher-list">
              <div
                  class="marketplace-filter-popover-publisher-list-item disabled"
                  v-for="item in getPublisherList()"
                  @click="(event) => publisherClicked(event, item)"
                  :data-name="item"
              >
                <div class="red-dot"/>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

let $t, self
let scrollEvent;
let io;

export default {
  name: 'MarketplaceFilterMarketPlace',

  props: [
      'sections', 'propItems', 'propCurrentPage', 'propMaxPage', 'propTotal', 'propDataLoaded', 'propOrder', 'page', 'propCurStatus'
  ],
  /*
  sections : filterBy, status, categories, collections, currencies, price
   */

  mixins: [],

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
    this.initPage();
  },

  updated() {

  },

  beforeDestroy() {

  },

  data() {
    return {
      itemsShows: {
        status: true,
        blockchain: true,
        categories: true,
        collections: true,
        currencies: true,
        price: true,
        publisher: true,
      },
      itemsHeights: {
        status: 0,
        blockchain: 0,
        categories: 0,
        collections: 0,
        currencies: 0,
        price: 0,
        publisher: 0,
      },
      filterby: [],
      filters: {
        status: [],
        blockchain: [],
        categories: [],
        collections: [],
        currencies: [],
        price: [],
        order: [],
        search: [],
        publisher: [],
      },
      originalFilter: {
        status: [],
        blockchain: [],
        categories: [],
        collections: [],
        currencies: [],
        order: [],
        search: [],
        price: [
          {
            value: '0-5',
            name: '~ 5'
          },
          {
            value: '5-10',
            name: '5 ~ 10'
          },
          {
            value: '10-20',
            name: '10 ~ 20'
          },
          {
            value: '20~',
            name: '20 +'
          }
        ]
      },
      nftCnt: {
        nftCntAuction: 0,
        nftCntBuy: 0,
        nftCntSell: 0,
        nftCntCateETH: 0,
        nftCntCateKLAY: 0,
        nftCntCateART: 0,
        nftCntCateCOLLECT: 0,
        nftCntCateETC: 0
      },
      selectedOption: 'Select Currency',
      showSelectBox: false,
      publisherInput: '',
      pubs: [],
    }
  },

  computed: {
    ...mapGetters([
      'getSupportCurrency',
      'getSupportNft',
      'getResponseData'
    ]),

    items: {
      get () {
        return this.propItems;
      },

      set (newVal) {
        this.$emit('update:items', 'items', newVal);
      }
    },

    currentPage: {
      get () {
        return this.propCurrentPage;
      },

      set (newVal) {
        this.$emit('update:currentPage', 'currentPage', newVal);
      }
    },

    maxPage: {
      get () {
        return this.propMaxPage;
      },

      set (newVal) {
        this.$emit('update:maxPage', 'maxPage', newVal);
      }
    },

    total: {
      get () {
        return this.propTotal;
      },

      set (newVal) {
        this.$emit('update:total', 'total', newVal);
      }
    },

    dataLoaded: {
      get () {
        return this.propDataLoaded;
      },

      set (newVal) {
        this.$emit('update:dataLoaded', 'dataLoaded', newVal);
      }
    },

    order: {
      get () {
        return this.propOrder;
      },

      set (newVal) {
        this.$emit('update:order', 'order', newVal);
      }
    },

    curStatus: {
      get () {
        return this.propCurStatus;
      },

      set (newVal) {
        this.$emit('update:curStatus', 'curStatus', newVal);
      }
    },

    getNumOfFilterBy() {
      let cnt = 0;
      for (const row of this.filterby) {
        if (row.section !== 'order') {
          cnt++;
        }
      }
      return cnt;
    },
  },

  watch: {
    'filters.status': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ]);
    },

    'filters.blockchain': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
          ...newVal,
        ...this.filters.status,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ])
    },

    'filters.categories': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ]);
    },

    'filters.collections': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ]);
    },

    'filters.currencies': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ]);
    },

    'filters.price': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.order,
        ...this.filters.search,
        ...this.filters.publisher,
      ]);
    },

    'filters.order': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.search,
        ...this.filters.publisher,
      ])
    },

    'filters.search': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
        ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.publisher,
      ])
    },

    'filters.publisher': function (newVal, oldVal) {
      this.filterby = _.cloneDeep([
          ...newVal,
        ...this.filters.status,
        ...this.filters.blockchain,
        ...this.filters.categories,
        ...this.filters.collections,
        ...this.filters.currencies,
        ...this.filters.price,
        ...this.filters.order,
        ...this.filters.search,
      ]);

      const publisherList = this.$refs['publisher-list'];

      for (const elem of publisherList.children) {
        const name = elem.dataset.name;

        const filter = newVal.find(item => {
          if (item.value === name) return true;
          return false;
        })

        if (filter) {
          elem.className = elem.className.replace('disabled', 'selected');
        } else {
          elem.className = elem.className.replace('selected', 'disabled');
        }
      }
    },

    filterby: async function(newVal, oldVal) {
      const targetURL = this.getTargetURL();
      this.currentPage = 1;

      this.setDataLoaded(false);
      const res = await axios.get(targetURL);
      if (res.status === 200) {
        this.items = _.cloneDeep(res.data.items);
        this.currentPage = res.data.currentPage;
        this.maxPage = res.data.maxPage;
        this.total = res.data.total;

        this.setDataLoaded(true);
      }
    },

    currentPage: async function(newVal, oldVal) {
      if (typeof newVal === 'string') {
        this.currentPage = Number(this.currentPage);
        return;
      } else if (typeof oldVal === 'string' && Number(oldVal) === newVal) {
        return;
      }

      let targetURL = this.getTargetURL();

      // this.setDataLoaded(false);
      const res = await axios.get(targetURL);
      if (res.status === 200) {
        this.items.push(...res.data.items);
        this.currentPage = res.data.currentPage;
        this.maxPage = res.data.maxPage;
        this.total = res.data.total;

        // this.setDataLoaded(true);
      }
    },

    propOrder: function (newVal, oldVal) {
      this.filters.order = [newVal];
    },
  },

  methods: {
    async initPage() {
      const res2 = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/v1/common/token/whitelist`);
      let nfts = [];
      let currencies = [];
      if (res2.status === 200) {
        nfts = _.cloneDeep(res2.data.nfts);
        currencies = _.cloneDeep(res2.data.tokens);
      }
      for (const currency of currencies) {
        this.originalFilter.currencies.push(currency);
      }
      for (const nft of nfts) {
        this.originalFilter.collections.push(nft);
      }

      this.itemsHeights.status = this.$refs.status ? this.$refs.status.offsetHeight : 0;
      this.itemsHeights.blockchain = this.$refs.blockchain ? this.$refs.blockchain.offsetHeight : 0;
      this.itemsHeights.categories = this.$refs.categories ? this.$refs.categories.offsetHeight : 0;
      this.itemsHeights.collections = this.$refs.collections ? this.$refs.collections.offsetHeight : 0;
      this.itemsHeights.currencies = this.$refs.currencies ? this.$refs.currencies.offsetHeight : 0;
      this.itemsHeights.price = this.$refs.price ? this.$refs.price.offsetHeight : 0;
      this.itemsHeights.publisher = this.$refs.publisher ? this.$refs.publisher.offsetHeight : 0;

      const res3 = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/v1/common/sideInfo`);
      if (res3.status === 200) {
        if (res3.data && res3.data.nftCnt) {
          this.nftCnt = _.cloneDeep(res3.data.nftCnt);
          this.pubs = res3.data?.pubs || [];
        }
      }

      const $query = this.$route.query;
      if ($query['status']) await this.routeWithFilter('status');
      if ($query['blockchain']) await this.routeWithFilter('blockchain');
      if ($query['categories']) await this.routeWithFilter('categories');
      if ($query['collections']) await this.routeWithFilter('collections');
      if ($query['currencies']) await this.routeWithFilter('currencies');
      if ($query['price']) await this.routeWithFilter('price');
      if ($query['search']) await this.routeWithFilter('search');
      if ($query['publisher']) await this.routeWithFilter('publisher');
    },

    routeWithFilter(section) {
      const $query = this.$route.query;

      if ($query[section + 'Obj']) {
        const obj = JSON.parse($query[section + 'Obj']);
        this[`${section}Clicked`](null, $query[section], obj);
      } else if (section === 'search') {
        if ($query[section]) {
          const value = $query[section];
          this.filters.search.push({
            section: 'search',
            value,
            appear: () => {
              return value;
            }
          });
        }
      } else {
        if ($query[section]) {
          const arr = $query[section].split(',');
          for (const value of arr) {
            this[`${section}Clicked`](null, value);
          }
        }
      }
    },

    getTargetURL() {
      const queries = {
        page: [this.currentPage],
        status: [],
        blockchain: [],
        categories: [],
        collections: [],
        currencies: [],
        price: [],
        search: [],
        publisher: [],
        order: [],
        limit: [20],
        connectAddr: []
      }

      let userAddress = '';
      if (this.getUserInfo)
        userAddress = this.getUserInfo.address;
      if (Boolean(userAddress))
        queries.connectAddr.push(userAddress);

      for (const filter of this.filterby) {
        queries[filter.section].push(this.translateFilter(filter));
      }

      let urlQuery = "";
      for (let key in queries) {
        let query = queries[key];

        // SOLD_ITEMS 일 때,
        if (key === 'status') {
          if (query.length > 0) urlQuery += 'lifeStatus=';
          for (const q of query) {
            if (!(urlQuery.includes('DONE') || urlQuery.includes('START'))) {
              if (q === 'SOLDITEMS') {
                urlQuery += 'DONE,';
              }
              else if (q === 'SELL' || q === 'AUCTION') {
                urlQuery += 'START,';
              }
            }

            if (urlQuery[urlQuery.length - 1] === ',') {
              urlQuery = urlQuery.slice(0, -1);
            }
            urlQuery += '&';
          }
        }

        switch(key) {
          case 'blockchain':
            key = 'platform';
            break;
          case 'categories':
            key = 'category';
            break
          case 'collections':
            key = 'collection';
            break
          case 'currencies':
            key = 'currency';
            break
        }

        query = [...new Set(queries[key])];

        urlQuery += `${key}=`;
        for (const q of query) {
          urlQuery += `${q},`;
        }
        if (urlQuery[urlQuery.length - 1] === ',') {
          urlQuery = urlQuery.slice(0, -1);
        }
        urlQuery += '&';
      }

      const baseURL = `${process.env.VUE_APP_API_ENDPOINT}`;
      let pathURL = '';

      if (this.page === 'sell') {
        pathURL = 'v1/nfts';
      } else if (this.page === 'buy') {
        pathURL = 'v1/buys';
      }
      /*
        page: [],
        status: [],
        platform: [],
        category: [],
        collection: [],
        currency: [],
        price: [],
        search: [],
        limit: []
       */
      const targetURL = `${baseURL}/${pathURL}?${urlQuery}`;

      return targetURL;
    },

    statusClicked(event, value) {
      const status = {
        section: 'status',
        value,
        appear: () => {
          const text = this.$t(`Market.FilterStatus${value[0].toUpperCase() + value.slice(1).toLowerCase()}`)
          return text;
        }
      }

      if (!event) {
        event = new Event('clickOutside');
        const parentElem = this.$refs['status'];
        let curElem = null;
        for (const elem of parentElem.children) {
          if (JSON.parse(elem.children[0].dataset.obj).value.includes(value)) {
            curElem = elem.children[0];
            break;
          }
        }
        if (curElem) {
          curElem.children[1].dispatchEvent(event);
        }
      }

      let flag = false;
      let oldVal = _.cloneDeep(this.filters.status);
      this.filters.status.splice(0);
      if ((oldVal.length > 0 && oldVal[0].value !== status.value) || oldVal.length === 0) flag = true;
      if (flag) this.filters.status.push(status);

      // 다중 선택을 위한 코드
      // const idx = this.filters.status.findIndex(i => i.value === value);
      // if (idx > -1) {
      //   this.filters.status.splice(idx, 1);
      //   this.curStatus.splice(idx, 1);
      //
      //   if (event.target.parentElement.hasChildNodes()) {
      //     const redDotNode = event.target.parentElement.childNodes[0];
      //     redDotNode.className = redDotNode.className.replace('selected', 'disabled');
      //   }
      // } else {
      //   this.filters.status.push(status);
      //   this.curStatus.push(status);
      //
      //   if (event.target.parentElement.hasChildNodes()) {
      //     const redDotNode = event.target.parentElement.childNodes[0];
      //     redDotNode.className = redDotNode.className.replace('disabled', 'selected');
      //   }
      // }

      for (const node of this.$refs.status.children) {
        const redDotNode = node.querySelector('.red-dot');
        if (redDotNode) redDotNode.className = redDotNode.className.replace('selected', 'disabled');
      }
      if (flag && event.target.parentElement.hasChildNodes()) {
        const redDotNode = event.target.parentElement.childNodes[0];
        redDotNode.className = redDotNode.className.replace('disabled', 'selected');
      }
    },

    blockchainClicked(event, value) {
      const blockchain = {
        section: 'blockchain',
        value,
        appear: () => this.$t(`Market.FilterBlockchain${value[0].toUpperCase() + value.slice(1).toLowerCase()}`)
      }

      if (!event) {
        event = new Event('clickOutside');
        const parentElem = this.$refs['blockchain'];
        let curElem = null;
        for (const elem of parentElem.children) {
          if (JSON.parse(elem.children[0].dataset.obj).value.includes(value)) {
            curElem = elem.children[0];
            break;
          }
        }
        if (curElem) {
          curElem.children[0].dispatchEvent(event);
        }
      }

      const idx = this.filters.blockchain.findIndex(i => i.value === value);
      if (idx > -1) {
        this.filters.blockchain.splice(idx, 1);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('selected', 'disabled');
        }
      } else {
        this.filters.blockchain.push(blockchain);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('disabled', 'selected');
        }
      }
    },

    categoriesClicked(event, value) {
      const category = {
        section: 'categories',
        value,
        appear: () => this.$t(`Market.FilterCategories${value[0].toUpperCase() + value.slice(1).toLowerCase()}`)
      }

      if (!event) {
        event = new Event('clickOutside');
        const parentElem = this.$refs['categories'];
        let curElem = null;
        for (const elem of parentElem.children) {
          if (JSON.parse(elem.children[0].dataset.obj).value.includes(value)) {
            curElem = elem.children[0];
            break;
          }
        }
        if (curElem) {
          curElem.children[0].dispatchEvent(event);
        }
      }

      const idx = this.filters.categories.findIndex(i => i.value === value);
      if (idx > -1) {
        this.filters.categories.splice(idx, 1);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('selected', 'disabled');
        }
      } else {
        this.filters.categories.push(category);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('disabled', 'selected');
        }
      }
    },

    collectionsClicked(event, value, item) {
      const collection = {
        section: 'collections',
        value,
        appear: () => value,
        desc: item
      }

      if (!event) {
        event = new Event('clickOutside');
        const parentElem = this.$refs['collections'];
        let curElem = null;
        for (const elem of parentElem.children) {
          if (JSON.parse(elem.dataset.obj).value.includes(value)) {
            curElem = elem;
            break;
          }
        }

        if (curElem) {
          curElem.dispatchEvent(event);
        }

        collection.desc = _.find(this.getSupportNft, nft => {
          if (this.$wallet.isSameName(nft.name, value)) return true;
          return false;
        });
      }

      const idx = this.filters.collections.findIndex(i => i.value === value);

      if (this.filters.collections && idx > -1) {
        this.filters.collections.splice(idx, 1);
        event.target.className = event.target.className.replace('selected', 'disabled');
      } else {
        this.filters.collections.push(collection);
        event.target.className = event.target.className.replace('disabled', 'selected');
      }
    },

    currenciesClicked(event, value, item) {
      value = 'currency' + value;
      const currency = {
        section: 'currencies',
        value,
        appear: () => value.slice(8),
        desc: item
      }
      const idx = this.filters.currencies.findIndex(i => i.value === value);
      if (idx > -1) {
        this.filters.currencies.splice(idx, 1);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('selected', 'disabled');
        }
      } else {
        this.filters.currencies.push(currency);
        if (event.target.parentElement.hasChildNodes()) {
          const redDotNode = event.target.parentElement.childNodes[0];
          redDotNode.className = redDotNode.className.replace('disabled', 'selected');
        }
      }

      if (this.filters.currencies.length === 1) {
        this.$refs['price-select'].value = event.target.innerText ? event.target.innerText : '';
      }

    },

    priceClicked(event, value, item) {
      if (this.$refs['price-select'].selectedIndex === 0) {
        return;
      }

      let flag = false;
      let oldVal = _.cloneDeep(this.filters.price);

      const price = {
        section: 'price',
        value: item.value,
        appear: () => item.value
      }

      this.filters.price.splice(0);
      if ((oldVal.length > 0 && oldVal[0].value !== price.value) || oldVal.length === 0) flag = true;
      if (flag) this.filters.price.push(price);

      for (const node of this.$refs.priceItems) {
        const redDotNode = node.querySelector('.red-dot');
        if (redDotNode) redDotNode.className = redDotNode.className.replace('selected', 'disabled');
      }
      if (flag && event.target.parentElement.hasChildNodes()) {
        const redDotNode = event.target.parentElement.childNodes[0];
        redDotNode.className = redDotNode.className.replace('disabled', 'selected');
      }
    },

    publisherClicked(event, value) {
      const publisher = {
        section: 'publisher',
        value,
        appear: () => value,
      }

      if (!event) {
        this.publisherSubmitClicked(null, value);
        setTimeout(() => {
          const listElem = this.$refs['publisher-list'];
          for (const elem of listElem.children) {
            elem.className = elem.className.replace('disabled', 'selected');
          }
        }, 100);
      }

      const idx = this.filters.publisher.findIndex(i => i.value === value);

      if (idx > -1) {
        this.filters.publisher.splice(idx, 1);
      } else {
        this.filters.publisher.push(publisher);
      }
    },

    priceSearchClicked(event) {
      const minVal = this.$refs['priceMin'].value;
      const maxVal = this.$refs['priceMax'].value;

      if (minVal && maxVal) {
        const newVal = String(minVal) + '-' + String(maxVal);
        this.priceClicked(event, newVal,{
          name: newVal
        });
      }

      this.$refs['priceMin'].value = null;
      this.$refs['priceMax'].value = null;
    },

    priceKeyUpped(event) {
      if (event.keyCode === 13) {
        this.priceSearchClicked(event);
      }
    },

    resetClicked(event) {
      this.filterby = _.cloneDeep([]);
      this.filters = _.cloneDeep({
        status: [],
        categories: [],
        collections: [],
        currencies: [],
        price: [],
        order: []
      });

      const filterElem = document.querySelector('.marketplace-filter');
      if (filterElem) {
        this.nodeClassChangeDfs(filterElem);
      }
    },

    nodeClassChangeDfs(parent) {
      if (!parent.hasChildNodes()) return;
      const children = parent.childNodes;
      for (const child of children) {
        this.nodeClassChangeDfs(child);
        const className = child.className;
        if (className && className.includes('selected')) {
          child.className = child.className.replace('selected', 'disabled');
        }
      }
    },

    topClicked(event, value) {
      let lowerCase;
      if (value) lowerCase = value;
      else lowerCase = event.target.innerText ? event.target.innerText.toLowerCase() : event.target.parentElement.innerText.toLowerCase();
      this.itemsShows[lowerCase] = !this.itemsShows[lowerCase];
    },

    filterCloseClicked(event) {
      // TODO: 필터 삭제 구현
      if (!event.target || !event.target.dataset || !event.target.dataset.item) return;
      const item = JSON.parse(event.target.dataset.item);
      const idx = this.filterby.findIndex(i => i.section === item.section && i.value === item.value);
      if (idx > -1) {
        const idx2 = this.filters[item.section].findIndex(i => i.value === item.value);
        if (idx2 > -1) {
          this.filters[item.section].splice(idx2, 1);
          const elem = document.querySelector(`#market-sell-${item.section}`);
          if (elem) {
            const elem2 = elem.querySelector('.marketplace-filter-popover-item-title');
            if (elem2) {
              let cur = elem2;
              while (cur) {
                if (JSON.parse(cur.dataset.obj).section === "collections") {
                  // collections section
                  if (JSON.parse(cur.dataset.obj).value === item.value) cur.className = cur.className.replace('selected', 'disabled');
                  cur = cur.nextElementSibling;
                } else {
                  if (JSON.parse(cur.dataset.obj).value === item.value || 'currency' + JSON.parse(cur.dataset.obj).value === item.value) {
                    // status, categories, currencies section
                    const child = cur.hasChildNodes() ? cur.childNodes[0] : null;
                    if (child) {
                      child.className = child.className.replace('selected', 'disabled');
                    }
                    break
                  } else if (JSON.parse(cur.dataset.obj).name === item.value) {
                    // price section
                    const child = cur.hasChildNodes() ? cur.childNodes[0] : null;
                    if (child) child.className = child.className.replace('selected', 'disabled');
                  }

                  const parent = cur.parentElement;
                  cur = parent.nextElementSibling && parent.nextElementSibling.hasChildNodes() ? parent.nextElementSibling.childNodes[0] : null;
                }
              }
            }
          }
        }
      }
    },

    translateFilter(filter) {
      let ret = filter.value;
      if (filter.desc) {
        if (filter.section === 'collections') {
          ret = filter.desc.tokenAddress;
        }

        if (filter.section === 'currencies') {
          ret = filter.desc.tokenAddress;
        }
      } else {
        switch (filter.value) {
          case 'ETHEREUM':
            ret = 'ETH';
            break
          case 'KLAYTN':
            ret = 'KLAY';
            break
          case 'ART':
            ret = 'ART';
            break
          case 'COLLECTIBLES':
            ret = 'COL';
            break
          case 'ETC':
            ret = 'ETC';
            break

          case 'SALES':
            ret = 'SELL';
            break
          case 'AUCTIONS':
            ret = 'AUCTION';
            break
          case 'BUY':
            ret = 'BUY';
            break

          case '~ 5':
            ret = '0-5';
            break
          case '5 ~ 10':
            ret = '5-10';
            break
          case '10 ~ 20':
            ret = '10-20';
            break
          case '20 +':
            ret = '20~';
            break

          case 'currencyETH':
            ret = '';
            break
          case 'currencyUSDT':
            ret = '';
            break
          case 'currencyTRIX':
            ret = '';
            break
          case 'currencyKLAY':
            ret = '';
            break
        }
      }

      return ret;
    },

    setDataLoaded(flag) {
      this.dataLoaded = flag;
    },

    getNftCnt(name) {
      let key = '';
      if (this.page === 'sell') {
        key += 'sale';
        key += name;
      } else if (this.page === 'buy') {
        key += 'buy';
        key += name;
      }
      return this.nftCnt[key] || 0;
    },

    currencyInPriceChanged(event) {
      const newEvent = new Event('click');
      // filterby에서 section이 currencies면 모두 삭제
      for (const originFilterBy of this.filterby) {
        if (originFilterBy.section && originFilterBy.section === 'currencies') {
          for (const refFilterBy of this.$refs.filterby.children) {
            if (refFilterBy.dataset.obj && JSON.parse(refFilterBy.dataset.obj).value === originFilterBy.value) {
              if (refFilterBy.hasChildNodes() && refFilterBy.children.length >= 2) {
                const elem = refFilterBy.children[1];
                elem.dispatchEvent(newEvent);
              }
            }
          }
        }
      }

      // currencies에서 select 한 currency 선택
      const symbolSelected = event.target.value;
      for (const refCurrencies of this.$refs.currencies.children) {
        if (refCurrencies.hasChildNodes()) {
          const parentElem = refCurrencies.children[0];
          if (parentElem.hasChildNodes() && parentElem.children.length >= 2) {
            const elem = parentElem.children[1];
            if (JSON.parse(parentElem.dataset.obj).symbol === symbolSelected) {
              elem.dispatchEvent(newEvent);
            }
          }
        }
      }
    },

    selectBoxClicked() {
      this.showSelectBox = !this.showSelectBox;
    },

    optionClicked(event) {
      const value = event.target.dataset.value;
      const appear = event.target.dataset.appear;
      this.showSelectBox = false;
      this.selectedOption = appear;
      this.orderChanged(new Event('change'), value);
    },

    publisherSubmitClicked(event, value) {
      this.pubs = [value ? value : this.publisherInput];
      const listElem = this.$refs['publisher-list'];
      for (const elem of listElem.children) {
        elem.className = elem.className.replace('selected', 'disabled');
      }
      this.publisherInput = '';
    },

    getPublisherList() {
      return this.pubs;
    }
  },

  components: {

  }
}
</script>