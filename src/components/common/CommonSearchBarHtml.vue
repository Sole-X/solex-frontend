<template>
  <div class="common-search-bar-html-container">
    <div ref="searchType" @click="typeButtonClicked" class="type-section">
      {{ $t(getSearchType) }}
      <img :src="$static.getFileURL('img/icon/ic-chevron-bottom-gray.svg')" alt="type" width="10px" />
      <div ref="searchTypePopOver" class="type-popover" v-if="getIsSearchTypeChanging">
        <button @click="sellButtonClicked">{{ $t('General.SellMenu') }}</button>
        <button @click="buyButtonClicked">{{ $t('General.BuyMenu') }}</button>
      </div>
    </div>
    <div class="input-section">
      <input
        :placeholder="$t('General.SearchPlaceholder')"
        @focus="inputFocused"
        @keyup="inputKeyUpped"
        ref="searchVal"
      />
      <div class="input-popover" v-if="getIsSearching" ref="searchInputPopOver">
        <div class="input-section-item">
          <h4 class="input-section-item-title">{{ $t('General.SearchItems')[0] }}</h4>
          <div class="input-section-item-content-container" v-for="(item, i) in getItems.items">
            <img :src="getItemImage(item)" width="20px" />
            <div
              class="input-section-item-content"
              @click="itemClicked"
              :data-valueFragment0="item[0]"
              :data-valueFragment1="item[1]"
              :data-valueFragment2="item[2]"
            >
              <span>{{ item[0] }}</span>
              <span class="input-section-item-content-highlighted">{{ item[1] }}</span>
              <span>{{ item[2] }}</span>
            </div>
          </div>
        </div>
        <div class="input-section-item">
          <h4 class="input-section-item-title">{{ $t('General.SearchItems')[1] }}</h4>
          <div class="input-section-item-content-container" v-for="(collection, j) in getItems.collections">
            <img
              v-if="collection[3].toLowerCase() === 'ktj333'"
              :src="$static.getFileURL('img/icon/ic-token-eth.svg')"
              width="20px"
            />
            <img
              v-else-if="collection[3].toLowerCase() === 'klaytest'"
              :src="$static.getFileURL('img/icon/ic-token-klay.svg')"
              width="20px"
            />
            <div
              class="input-section-item-content"
              @click="collectionClicked"
              :data-valueFragment0="collection[0]"
              :data-valueFragment1="collection[1]"
              :data-valueFragment2="collection[2]"
            >
              <span>{{ collection[0] }}</span>
              <span class="input-section-item-content-highlighted">{{ collection[1] }}</span>
              <span>{{ collection[2] }}</span>
            </div>
          </div>
        </div>
        <div class="input-section-item">
          <h4 class="input-section-item-title">{{ $t('General.SearchItems')[2] }}</h4>
          <div class="input-section-item-content-container" v-for="(account, k) in getItems.accounts">
            <img :src="$static.getFileURL('img/thumbnail/thumb-profile.jpg')" width="20px" />
            <div
              class="input-section-item-content"
              @click="accountClicked"
              :data-valueFragment0="account[0]"
              :data-valueFragment1="account[1]"
              :data-valueFragment2="account[2]"
              :data-account="account[3]"
            >
              <span>{{ account[0] }}</span>
              <span class="input-section-item-content-highlighted">{{ account[1] }}</span>
              <span>{{ account[2] }}</span>
            </div>
          </div>
        </div>
        <div class="input-section-item">
          <h4 class="input-section-item-title">{{ $t('General.SearchItems')[3] }}</h4>
          <div class="input-section-item-content-container" v-for="(publisher, k) in getItems.publishers">
            <div
              class="input-section-item-content"
              @click="(event) => publisherClicked(event, publisher[3])"
              :data-valueFragment0="publisher[0]"
              :data-valueFragment1="publisher[1]"
              :data-valueFragment2="publisher[2]"
              :data-publisher="publisher[3]"
            >
              <span>{{ publisher[0] }}</span>
              <span class="input-section-item-content-highlighted">{{ publisher[1] }}</span>
              <span>{{ publisher[2] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit-section">
      <button @click="submitButtonClicked">
        <img :src="$static.getFileURL('img/icon/ic-search-bk.svg')" alt="submit" />
      </button>
    </div>
  </div>
</template>

<script>
let $t, self;
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
let handleTypeEvent = null;
let handleInputEvent = null;
let handleInputEvent2 = null;
import axios from 'axios';

export default {
  name: 'CommonSearchBarHtml',
  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.searching({ word: '__init__' });

    handleTypeEvent = (function handleEvent() {
      function curEvent(event) {
        if (!self.$refs.searchType.contains(event.target) && event.target !== self.$refs.searchTypePopOver) {
          self.setIsSearchTypeChanging({ isSearchTypeChanging: false });
        }
        if (event.target === self.$refs.searchTypePopOver) {
        }
      }

      return function () {
        if (self.$store.state && self.$store.state.search.isSearchTypeChanging === true) {
          window.addEventListener('click', curEvent);
        } else {
          window.removeEventListener('click', curEvent);
        }
      };
    })();

    handleInputEvent = function (event) {
      self.inputBlured();
    };
    handleInputEvent2 = function (event) {
      if (self.$refs.searchInputPopOver) {
        if (self.$refs.searchInputPopOver.contains(event.target)) {
          event.preventDefault();
        }
      }
    };

    self.$refs.searchVal.addEventListener('blur', handleInputEvent);
    window.addEventListener('mousedown', handleInputEvent2);
  },

  updated() {
    if (handleTypeEvent !== null) {
      handleTypeEvent();
    }
  },

  beforeDestroy() {
    this.setIsSearching({ isSearching: false });
    this.setIsSearchTypeChanging({ isSearchTypeChanging: false });
    window.removeEventListener('click', handleTypeEvent);
    self.$refs.searchVal.removeEventListener('blur', handleInputEvent);
    window.removeEventListener('mousedown', handleInputEvent2);
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      'getSearchType',
      'getIsSearchTypeChanging',
      'getIsSearching',
      'getItems',
      'getResponseData',
      'getSearchFilter',
      'getSupportNft',
      'getSearchQuery',
    ]),

    getTypeForHttp() {
      let type = this.getSearchType;
      if (type === 'General.SellMenu') {
        type = 'SALE';
      } else if (type === 'General.BuyMenu') {
        type = 'BUY';
      }
      return type;
    },
  },

  watch: {},

  methods: {
    ...mapActions([
      'setIsSearchTypeChanging',
      'setSearchType',
      'setIsSearching',
      'searching',
      'searchNft',
      'setSearchFilter',
      'clearSearchFilter',
      'refreshTokenFilter',
    ]),

    ...mapMutations(['SET_RESPONSE_DATA', 'SET_SEARCHED_NFT']),

    typeButtonClicked(event) {
      this.setIsSearchTypeChanging({ isSearchTypeChanging: !this.getIsSearchTypeChanging });
    },

    sellButtonClicked(event) {
      this.setSearchType({ searchType: 'General.SellMenu' });
    },

    buyButtonClicked(event) {
      this.setSearchType({ searchType: 'General.BuyMenu' });
    },

    inputFocused(event) {
      if (this.$refs.searchVal.value.length > 0) {
        this.setIsSearching({ isSearching: true });
      }
    },

    inputBlured(event) {
      this.setIsSearching({ isSearching: false });
    },

    inputKeyUpped(event) {
      // 13 === 엔터
      if (event.keyCode === 13) {
        this.submitButtonClicked();
      } else {
        if (this.$refs.searchVal && this.$refs.searchVal.value && this.$refs.searchVal.value.length > 0) {
          this.setIsSearching({ isSearching: true });
          const word = event.currentTarget.value;
          const type = this.getTypeForHttp;
          this.searching({ word, type });
        } else {
          this.setIsSearching({ isSearching: false });
        }
      }
    },

    async itemClicked(event) {
      const parent = event.target.parentElement;
      let type = this.getTypeForHttp;
      type = type === 'BUY' ? 'buy' : 'sell';
      const val = parent.dataset.valuefragment0 + parent.dataset.valuefragment1 + parent.dataset.valuefragment2;

      const resData = this.getResponseData.nftItems;

      const itemInfo = _.find(resData, (item) => {
        return item.tokenName === val;
      });

      if (itemInfo) {
        const tokenAddress = itemInfo.tokenAddress;
        const tokenId = itemInfo.tokenId;
        const tradeId = itemInfo.id;

        const baseURL = process.env.VUE_APP_PUBLIC_PATH;
        const endPoint = 'asset/item/';
        let targetURL = `${baseURL}${endPoint}${tokenAddress}/${tokenId}/description`;

        this.$router.push({
          path: targetURL,
          query: {
            tradeId: tradeId,
            type: type,
          },
        });
      }

      this.setIsSearching({ isSearching: false });
      this.$refs.searchVal.value = '';
    },

    async collectionClicked(event) {
      const parent = event.target.parentElement;
      let type = this.getTypeForHttp;
      switch (type) {
        case 'SALE':
          type = 'sell';
          break;
        case 'BUY':
          type = 'buy';
          break;
      }
      const val = parent.dataset.valuefragment0 + parent.dataset.valuefragment1 + parent.dataset.valuefragment2;
      const resData = this.getResponseData.nftInfos;
      const itemInfo = _.find(resData, (item) => item.name === val);

      if (itemInfo) {
        let collectionName = itemInfo.name;

        this.$router.push({
          path: `/${type}`,
          query: {
            collections: collectionName,
            collectionsObj: JSON.stringify(itemInfo),
          },
        });
      }

      this.setIsSearching({ isSearching: false });
      this.$refs.searchVal.value = '';
    },

    async accountClicked(event) {
      const parent = event.target.parentElement;
      const type = this.getTypeForHttp;
      const val = parent.dataset.account;

      const resData = this.getResponseData.accounts;

      const itemInfo = _.find(resData, (item) => item.accountAddress === val);

      if (itemInfo) {
        const accountInfo = this.$wallet.getAccountUrl(itemInfo.accountAddress);
        const win = window.open(accountInfo);
      }

      this.setIsSearching({ isSearching: false });
      this.$refs.searchVal.value = '';
    },

    async publisherClicked(event, publisher) {
      let type = this.getTypeForHttp;
      type = type === 'BUY' ? 'buy' : 'sell';

      this.$router.push({
        path: `/${type}`,
        query: {
          publisher: publisher,
        },
      });

      this.setIsSearching({ isSearching: false });
      this.$refs.searchVal.value = '';
    },

    async submitButtonClicked(event) {
      let type = this.getTypeForHttp;
      switch (type) {
        case 'SALE':
          type = 'sell';
          break;
        case 'BUY':
          type = 'buy';
          break;
      }
      const val = this.$refs.searchVal.value;

      const curUrl = `${process.env.VUE_APP_PUBLIC_PATH}${type}?search=${val}`;

      this.$router.push({
        path: '/render',
        query: {
          path: curUrl,
        },
      });

      this.setIsSearching({ isSearching: false });
      this.$refs.searchVal.value = '';
    },

    async httpRequestGet(endPoint, payload) {
      const type = payload.type || null;
      const val = payload.val || null;

      const baseURL = `${process.env.VUE_APP_API_ENDPOINT}`;
      let requestURL = `${baseURL}${endPoint}?`;
      if (type) {
        requestURL += `type=${type}&`;
      }
      if (val) {
        requestURL += `search=${val}&`;
      }
      return await axios.get(requestURL);
    },

    getAccountImageSrc(account) {
      const baseURL = process.env.VUE_APP_API_ENDPOINT;
      const pathURL = 'images';
      const targetURL = `${baseURL}/${pathURL}/${account}.png`;

      return targetURL;
    },

    getItemImage(item) {
      const obj = JSON.parse(item[3]);
      if (obj.desc && obj.desc.image && obj.desc.image !== '') return obj.desc.image;
      return this.$static.getFileURL('img/logo/default-logo-primary.svg');
    },
  },

  components: {},
};
</script>
