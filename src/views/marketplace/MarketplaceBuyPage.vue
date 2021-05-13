<template>
  <div ref="marketplace-sell" class="marketplace-sell">
    <marketplace-filter-market-place
      :sections="['filterBy', 'categories', 'collections', 'currencies', 'price']"
      :propItems="items"
      v-on:update:items="setData"
      :propCurrentPage="currentPage"
      v-on:update:currentPage="setData"
      :propMaxPage="maxPage"
      v-on:update:maxPage="setData"
      :propTotal="total"
      v-on:update:total="setData"
      :propDataLoaded="dataLoaded"
      v-on:update:dataLoaded="setData"
      :propOrder="order"
      :propCurStatus="curStatus"
      v-on:update:curStatus="setData"
      :page="'buy'"
    />

    <div class="marketplace-sell-items" ref="buyItemsContainer">
      <header class="marketplace-sell-items-header">
        <div class="marketplace-sell-items-header-top">
          {{ $t('Market.ResultNum', {total: total}) }}
        </div>
        <div class="marketplace-sell-items-header-bottom">
          <div class="marketplace-sell-items-header-bottom-select">
            <div class="marketplace-sell-items-header-bottom-select-box" ref="selectBox" @click="selectBoxClicked">
              {{ selectedOption() }}
            </div>
            <div class="marketplace-sell-items-header-bottom-select-options" ref="selectOption" v-show="showSelectBox">
              <ul>
                <li data-value='DATE' data-appear='Market.OrderByNewest' @click="optionClicked">{{ $t('Market.OrderByNewest') }}</li>
                <li data-value='POP' data-appear='Market.OrderByPopular' @click="optionClicked">{{ $t('Market.OrderByPopular') }}</li>
                <li data-value='PRICE~' data-appear='Market.OrderByLowestPrice' @click="optionClicked">{{ $t('Market.OrderByLowestPrice') }}</li>
                <li data-value='PRICE' data-appear='Market.OrderByHighestPrice' @click="optionClicked">{{ $t('Market.OrderByHighestPrice') }}</li>
              </ul>
            </div>
          </div>

          <button @click="registerClicked">
            <svg width="160px" height="40px" viewBox="0 0 160 40" class="border">
              <polyline points="159,1 159,39 1,39 1,1 159,1" class="bg-line" />
              <polyline points="159,1 159,39 1,39 1,1 159,1" class="hl-line" />
            </svg>
            <span>{{ $t('Market.RegisterOffer') }}</span>
          </button>
        </div>
      </header>
      <main class="marketplace-sell-items-contents">
        <template v-if="getDataLoaded">
          <asset-item-card-market-place
              class="marketplace-sell-items-contents-image"
              v-for="item in items"
              :item="item"
              :key="item.primaryKey"
              :type="'buy'"
          />
        </template>
        <template v-else>
          <common-loader />
        </template>
      </main>
      <footer ref="footer">
        <main-footer />
      </footer>
    </div>
  </div>
</template>

<script>
import AssetItemCardMarketPlace from '@/components/asset/item/AssetItemCardMarketPlace';
import MarketplaceFilterMarketPlace from "@/components/market/MarketplaceFilterMarketPlace";
import MarketplaceMixin from "@/mixins/marketplace/MarketplaceMixin";
import MainFooter from '@/components/menu/MainFooter'
import { mapGetters } from 'vuex';
import axios from "axios";

let $t, self
let scrollEvent;
let io;

export default {
  name: 'MarketplaceBuyPage',

  mixins: [MarketplaceMixin],

  created() {
    self = this
    $t = this.$t.bind(this)

    io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          if (entry.target.hasChildNodes()) {
            const elem = entry.target.childNodes[0];
            const imgsrc = elem.dataset.imgsrc ? elem.dataset.imgsrc : '';
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

    this.scrollEvent = _.debounce(() => {
      const height = this.getWindowInfo.height;
      const scrollTop = this.getWindowInfo.scrollTop;
      if (this.$refs['marketplace-sell']) {
        const marketplaceSellHeight = this.$refs['marketplace-sell'].offsetHeight;

        if (height + scrollTop >= marketplaceSellHeight - 160) {
          this.moreClicked();
        }
      }
    }, 50);
    this.clickEvent = (event) => {
      if (!this.$refs.selectBox.contains(event.target) && !this.$refs.selectOption.contains(event.target)) {
        this.showSelectBox = false;
      }
    }
    window.addEventListener('scroll', this.scrollEvent);
    window.addEventListener('click', this.clickEvent);
  },

  updated() {
    if (this.items.length > 0) {
      this.imageLazyLoading();
    }
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
    window.removeEventListener('click', this.clickEvent);
  },

  data() {
    return {
      dataLoaded: false,
      currentPage: 1,
      maxPage: 1,
      total: 0,
      items: [],
      order: {
        section: 'order',
        value: 'POP'
      },
      curStatus: [],
      showSelectBox: false,
      selectedOption: () => $t('Market.SelectOrder'),
    }
  },

  computed: {
    ...mapGetters([
        'getItems',
    ]),

    getDataLoaded () {
      return this.dataLoaded;
    }
  },

  watch: {

  },

  methods: {
    async initPage() {
      const $query = this.$route.query;
      if (Object.keys($query).length === 0) {
        await this.firstItemLoaded();
        return;
      }
    },

    async firstItemLoaded() {
      this.$_MarketplaceMixin_setDataLoaded(false);

      let targetURL = `${process.env.VUE_APP_API_ENDPOINT}/v1/buys?limit=20`;
      const userAddress = this.getUserInfo ? this.getUserInfo.address : '';
      if (Boolean(userAddress)) {
        targetURL += `&connectAddr=${userAddress}`;
      }
      const res = await axios.get(targetURL);
      if (res.status === 200) {
        this.currentPage = res.data.currentPage;
        this.maxPage = res.data.maxPage;
        this.total = res.data.total;
        this.items = _.cloneDeep(res.data.items);

        this.$_MarketplaceMixin_setDataLoaded(true);
      }
    },

    setData(key, value) {
      this[key] = value;
    },

    orderChanged(event, val) {
      let value;
      if (val) {
        value = val;

        if (!event) {
          event = new Event('changeOutside');
          let curElem = null;
          const parentNode = this.$refs.orderOptions ? this.$refs.orderOptions : null;
          if (parentNode) {
            for (const elem of parentNode.children) {
              if (elem.value === value) {
                curElem = elem;
                break;
              }
            }
          }
          if (curElem) {
            curElem.dispatchEvent(event);
            curElem.selected = true;
          }
        }
      } else {
        value = event.target.value;
      }

      const sortBy = {
        section: 'order',
        value,
        appear: () => ''
      }
      this.order = sortBy;
    },

    moreClicked(event) {
      if (this.currentPage + 1 <= this.maxPage) {
        this.currentPage += 1;
      }
    },

    registerClicked(event) {

      this.$router.push({
        path: `/asset/make-offer/normal`,
        query: {
          type: 'buy'
        }
      })
    },

    imageLazyLoading() {
      const imageElemList = document.querySelectorAll('.marketplace-sell-items-contents-image');
      imageElemList.forEach((elem) => {
        io.observe(elem);
      })
    },

    selectBoxClicked() {
      this.showSelectBox = !this.showSelectBox;
    },

    optionClicked(event) {
      const value = event.target.dataset.value;
      const appear = event.target.dataset.appear;
      this.showSelectBox = false;
      this.selectedOption = () => $t(appear);
      this.orderChanged(new Event('change'), value);
    }
  },

  components: {
    AssetItemCardMarketPlace,
    MarketplaceFilterMarketPlace,
    MainFooter
  }
}
</script>
