<template>
  <section class="explorer-main-history-page">
    <h1 class="explorer-main__title">
      <strong>{{ $t('Explorer.ActivityMenu') }}</strong>
    </h1>

    <section class="main-item-search">
      <div class="main-item-search__notice">
        <span class="text-gray">
          {{ $t('Explorer.ActivityMenuDescription') }}
        </span>
      </div>

      <div class="main-item-search__filter">
        <common-search-dropdown
          :list="getOrderByOptions"
          :selected="selectedOption"
          :defaultTitle="$t('Market.OrderByNewest')"
          @onSelect="(option) => (selectedOption = option)"
        />
      </div>
    </section>

    <section class="explorer-main__table">
      <div class="explorer-main__table__head">
        <div :class="$bem('explorer-main__table__col', '', [col.type])" v-for="(col, i) in getTableCols" :key="i">
          <span class="text-gray">{{ col.title }}</span>
        </div>
      </div>

      <div v-if="getLoadingStatus.getAllActivities">
        <common-loader />
      </div>

      <!-- TODO : nickname -->
      <div v-else class="explorer-main__table__body">
        <div v-for="activity in getAllActivities.list" :key="activity.id" class="explorer-main__table__row">
          <div :class="$bem('explorer-main__table__col', '', ['event'])">
            {{ activity.typeStr }}
          </div>

          <div :class="$bem('explorer-main__table__col', '', ['token'])">
            <div class="explorer-main__table__col__icon" @click="tokenClicked(activity)">
              <img :src="getItemImg(activity)" style="max-width: 100%; max-height: 100%" />
            </div>
            <div class="explorer-main__table__col__token-name">
              <p>
                <span @click="tokenClicked(activity)">{{ activity.tokenInfo.name }}</span>
              </p>
              <p v-if="activity.tokenId">
                <span @click="tokenClicked(activity)">#{{ activity.tokenId }}</span>
              </p>
            </div>
          </div>

          <div :class="$bem('explorer-main__table__col', '', ['price'])">
            {{ $bn.toMaxUnit(activity.amount, activity.currencyInfo.decimal, 4) | addComma }}
            {{ activity.currencyInfo.symbol }}
          </div>

          <div :class="$bem('explorer-main__table__col', '', ['user'])">
            <div
              :style="{
                'background-image': `url(${getItemFromProfile(activity)})`,
                'background-size': 'contain',
                'background-position': 'center center',
              }"
            />
            <div>
              <span v-clipboard:copy="activity.fromAddress">{{ getItemFromAccount(activity) }}</span>
            </div>
          </div>

          <div :class="$bem('explorer-main__table__col', '', ['user'])">
            <div
              :style="{
                'background-image': `url(${getItemToProfile(activity)})`,
                'background-size': 'contain',
                'background-position': 'center center',
              }"
            />
            <div>
              <span v-clipboard:copy="activity.toAddress">{{ getItemToAccount(activity) }}</span>
            </div>
          </div>

          <div :class="$bem('explorer-main__table__col', '', ['time'])">
            {{ $date.getFromNow(activity.createdAt) }}
            <a :href="$wallet.getTxUrl(activity.txHash)" target="_blank" rel="noopener noreferrer">
              <img class="v-m" :src="$static.getFileURL('img/icon/ic-link-pointer-blue.svg')" alt="pointer" />
            </a>
          </div>
        </div>

        <common-pager
          :pageList="getPageList"
          :pageInfo="getAllActivities"
          @onMovePage="(value) => $emit('onMovePage', value)"
        />
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import PagerMixin from '@/mixins/PagerMixin';
import CommonSearchDropdown from '@/components/common/CommonSearchDropdown';
import CommonPager from '@/components/common/CommonPager';

let $t, component;

export default {
  name: 'ExplorerMainHistoryPage',
  mixins: [PagerMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      selectedOption: {},
    };
  },

  computed: {
    ...mapGetters(['getAllActivities']),

    getTableCols() {
      return [
        {
          title: $t('Market.Event'),
          type: 'event',
        },
        {
          title: 'NFT/TOKEN',
          type: 'token',
        },
        {
          title: $t('Market.Price'),
          type: 'price',
        },
        {
          title: 'From',
          type: 'user',
        },
        {
          title: 'To',
          type: 'user',
        },
        {
          title: $t('General.Timestamp'),
          type: 'time',
        },
      ];
    },

    getOrderByOptions() {
      return [
        {
          name: $t('Market.OrderByNewest'),
          type: 'newest',
        },
        {
          name: $t('Market.OrderByOldest'),
          type: 'oldest',
        },
        {
          name: $t('Market.OrderByLowestPrice'),
          type: 'lowest',
        },
        {
          name: $t('Market.OrderByHighestPrice'),
          type: 'highest',
        },
      ];
    },

    getPageList() {
      const { page, maxPage } = this.getAllActivities;

      return this.$_PagerMixin_getPageList(page, maxPage);
    },
  },

  watch: {},

  methods: {
    tokenClicked(item) {
      const { tokenAddress, tokenId, tradeId, typeStr } = item;

      if (typeStr === 'BUY' || typeStr === 'SELL' || typeStr === 'AUCTION') {
        if (
          tokenAddress &&
          tokenAddress !== '' &&
          tokenId &&
          tokenId !== '' &&
          tradeId &&
          tradeId !== '' &&
          typeStr &&
          typeStr !== ''
        ) {
          this.$router.push({
            path: `/asset/item/${tokenAddress}/${tokenId}`,
            query: {
              type: typeStr === 'BUY' ? 'buy' : 'sell',
              tradeId: tradeId,
            },
          });
        }
      }
    },

    getItemImg(item) {
      let image = null;
      if (item.nftDesc) {
        image = item.nftDesc.image;
      }
      if (image) return image;
      return this.$static.getFileURL('img/logo/default-logo-no-text.svg');
    },

    getItemFromAccount(item) {
      let user;

      if (item.fromAddressDesc.username && item.fromAddressDesc.username !== '') {
        user = item.fromAddressDesc.username;
      } else if (item.fromAddress !== '') {
        user = item.fromAddress.slice(0, 8) + '...';
      } else {
        user = '-';
      }
      return user;
    },

    getItemFromProfile(item) {
      let image;

      if (item.fromAddressDesc && item.fromAddressDesc.profile !== '') {
        image = item.fromAddressDesc.profile;
      } else {
        image = this.$static.getFileURL('img/thumbnail/thumb-profile.jpg');
      }

      return image;
    },

    getItemToAccount(item) {
      let user;

      if (item.toAddressDesc.username && item.toAddressDesc.username !== '') {
        user = item.toAddressDesc.username;
      } else if (item.toAddress !== '') {
        user = item.toAddress.slice(0, 8) + '...';
      } else {
        user = '-';
      }
      return user;
    },

    getItemToProfile(item) {
      let image;

      if (item.toAddressDesc && item.toAddressDesc.profile !== '') {
        image = item.toAddressDesc.profile;
      } else {
        image = this.$static.getFileURL('img/thumbnail/thumb-profile.jpg');
      }

      return image;
    },
  },

  components: {
    CommonPager,
    CommonSearchDropdown,
  },
};
</script>
