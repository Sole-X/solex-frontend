<template>
  <aside class="main-page__sidebar">
    <div :class="$bem('main-page__filter', '', ['status'])" v-show="getSelectedFilter.length > 0">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.SelectedFilter') }}</strong>
        </h5>

        <button class="main-page__filter__reset" @click="clearSearchFilter()">
          {{ $t('Market.Reset') }}
          <img :src="$static.getFileURL('img/icon/ic-refresh-gray.svg')" />
        </button>
      </div>

      <div class="main-page__selected-filter">
        <button
          v-for="selected in getSelectedFilter"
          :key="`${selected.filter}-${selected.option}`"
          @click="handleRemoveFilter(selected)"
        >
          <strong>{{ selected.option.toUpperCase() }}</strong>
          <img :src="$static.getFileURL('img/icon/ic-close-gray.svg')" alt="X" class="v-m" />
        </button>
      </div>
    </div>

    <div class="main-page__filter" v-if="showStatusFilter">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Status') }}</strong>
        </h5>

        <button></button>
      </div>

      <div class="main-page__filter__options">
        <ul>
          <li
            v-for="(value, index) in getSearchFilter.status"
            :key="value.name"
            :class="value.flag ? 'selected' : ''"
            @click="handleUpdateSearchFilter('status', { value, optionIndex: index })"
          >
            <p>{{ $t(value.name) }}</p>
            <p v-if="$route.name === 'AssetMainPage'">
              {{ getTotalCount('status', value) }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-page__filter">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Blockchain') }}</strong>
        </h5>
        <button></button>
      </div>
      <div class="main-page__filter__options">
        <ul>
          <li
            v-for="(value, index) in getSearchFilter.blockchain"
            :key="value.name"
            :class="value.flag ? 'selected' : ''"
            @click="handleUpdateSearchFilter('blockchain', { value, optionIndex: index })"
          >
            <p>{{ $t(value.name) }}</p>
            <p v-if="$route.name === 'AssetMainPage'">
              {{ getTotalCount('blockchain', value) }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-page__filter">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Categories') }}</strong>
        </h5>
        <button></button>
      </div>
      <div class="main-page__filter__options">
        <ul>
          <li
            v-for="(value, index) in getSearchFilter.category"
            :key="value.name"
            :class="value.flag ? 'selected' : ''"
            @click="handleUpdateSearchFilter('category', { value, optionIndex: index })"
          >
            <p>{{ $t(value.name) }}</p>
            <!-- TODO : Explorer -->
            <p v-if="$route.name === 'AssetMainPage'">
              {{ getTotalCount('category', value) }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-page__filter">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Collections') }}</strong>
        </h5>

        <button></button>
      </div>

      <div class="main-page__filter__collection">
        <button
          v-for="(value, index) in getSearchFilter.collection"
          :key="value.name"
          :class="value.flag ? 'selected' : ''"
          @click="handleUpdateSearchFilter('collection', { value, optionIndex: index })"
        >
          {{ value.name }}
        </button>
      </div>
    </div>

    <div class="main-page__filter" v-if="isAboutNft">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Currencies') }}</strong>
        </h5>

        <button></button>
      </div>

      <div class="main-page__filter__options">
        <ul>
          <li
            v-for="(value, index) in getSearchFilter.currency"
            :key="value.name"
            :class="value.flag ? 'selected' : ''"
            @click="handleUpdateSearchFilter('currency', { value, optionIndex: index })"
          >
            <p>{{ value.name }}</p>
            <!-- TODO : Explorer -->
            <p v-if="$route.name === 'AssetMainPage'">
              {{ getTotalCount('currency', value) }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-page__filter" v-if="isAboutNft">
      <div class="main-page__filter__title">
        <h5>
          <strong>{{ $t('Market.Price') }}</strong>
        </h5>
      </div>

      <div class="main-page__filter__price">
        <div class="main-page__filter__options">
          <ul>
            <li
              v-for="(info, index) in getSearchFilter.price.preset"
              :key="index"
              :class="info.selected ? 'selected' : ''"
              @click="handleUpdateSearchFilter('pricePreset', { value: info.selected, optionIndex: index })"
            >
              <span v-if="info.min === null"> ~ {{ info.max }} </span>

              <span v-else-if="info.max === null"> {{ info.min }}+ </span>

              <span v-else>{{ info.min }} ~ {{ info.max }}</span>
            </li>
          </ul>
        </div>

        <div class="main-page__filter__price__input">
          <div class="main-page__filter__price__input__box">
            <input type="text" v-model="customFilter.price.min" placeholder="min" />
          </div>

          <div class="divider">
            <strong>~</strong>
          </div>

          <div class="main-page__filter__price__input__box">
            <input type="text" v-model="customFilter.price.max" placeholder="max" />
            <button @click="handleSubmitCustomPrice()">
              <img :src="$static.getFileURL('img/icon/ic-market-search-gray.svg')" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CommonSearchDropdown from '@/components/common/CommonSearchDropdown';

let $t, component;

export default {
  name: 'MainSidebar',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  updated() {},

  beforeDestroy() {},

  data() {
    const { getSearchFilter } = this.$store.getters;

    return {
      selectedToken: {},
      customFilter: {
        price: _.cloneDeep(getSearchFilter.price.custom),
      },
    };
  },

  computed: {
    ...mapGetters(['getSearchFilter', 'getSupportCurrency', 'getMarketSideInfo']),

    getSelectedFilter() {
      const result = [];

      for (const filter in this.getSearchFilter) {
        if (filter === 'price') {
          continue;
        }

        const filterInfos = this.getSearchFilter[filter];

        for (const filterInfo of filterInfos) {
          if (filterInfo.flag) {
            result.push({
              filter,
              option: this.$t(filterInfo.name),
            });
          }
        }
      }

      return result;
    },

    showStatusFilter() {
      const { name, query } = this.$route;
      const isSellSearch = name === 'AssetMainPage' && query.type === 'sell';

      return isSellSearch || name === 'ExplorerHistoryPage';
    },

    isAboutNft() {
      return this.$route.name === 'AssetMainPage';
    },

    getCurrencyList() {},
  },

  watch: {},

  methods: {
    ...mapActions(['setSearchFilter', 'clearSearchFilter']),

    getTotalCount(infoType, value) {
      const { getMarketSideInfo } = this;

      if (infoType === 'status') {
        switch (value.type) {
          case 'Sales': {
            return getMarketSideInfo.nftCntSell;
          }
          case 'Auctions': {
            return getMarketSideInfo.nftCntAuction;
          }
        }
      }

      if (infoType === 'blockchain') {
        switch (value.type) {
          case 'Ethereum': {
            return getMarketSideInfo.nftCntCateETH;
          }
          case 'Klaytn': {
            return getMarketSideInfo.nftCntCateKLAY;
          }
        }
      }

      if (infoType === 'category') {
        switch (value.type) {
          case 'Collectible': {
            return getMarketSideInfo.nftCntCateCOLLECT;
          }
          case 'Art': {
            return getMarketSideInfo.nftCntCateART;
          }
          case 'ETC': {
            return getMarketSideInfo.nftCntCateETC;
          }
          default: {
            return '-';
          }
        }
      }

      return '-';
    },

    handleUpdateSearchFilter(type, { name, value, optionIndex }) {
      let newValue = _.cloneDeep(this.getSearchFilter);

      switch (type) {
        case 'priceInput': {
          // 가격 직접 입력 시 프리셋 선택 지우기
          newValue.price.preset = _.map(newValue.preset, (type) => {
            return {
              ...type,
              selected: false,
            };
          });
          newValue.price.custom = value;

          break;
        }
        case 'pricePreset': {
          // 프리셋에서 가격 선택 시 직접 입력한 것 지우기
          newValue.price.preset[optionIndex].selected = !newValue[name][optionIndex].selected;
          newValue.price.custom = { min: '0', max: '0' };

          this.customFilter.price = { min: '0', max: '0' };

          break;
        }
        default: {
          newValue[type][optionIndex].flag = !value.flag;
          break;
        }
      }

      this.setSearchFilter(newValue);
    },

    handleRemoveFilter({ filter, option }) {
      this.handleUpdateSearchFilter(filter, {
        name: option,
        value: true,
      });
    },

    handleSubmitCustomPrice() {
      this.handleUpdateSearchFilter('priceInput', {
        name: '',
        value: this.customFilter.price,
        optionIndex: -1,
      });
    },
  },

  components: {
    CommonSearchDropdown,
  },
};
</script>
