<template>
  <section class="user-asset-page">
    <article class="user-detail__title">
      <h1>
        <strong>{{ $t('UserPage.MyAssets') }}</strong>
      </h1>
      <div class="user-detail__title-total">
        <strong>{{ getTotalAssetToFiat.dprec(4) | addComma }}</strong>
        <span>USD</span>
      </div>
    </article>

    <article class="user-collapsible user-asset__in-wallet">
      <ui-collapsible ref="inWallet">
        <user-collapsible-header
          slot="header"
          :title="$t('UserPage.ShowInWallet')"
          :total="getCount('inWalletItems')"
        />

        <section class="user-collapsible__content" ref="inWalletItems">
          <div
            class="user-asset__in-wallet__row"
            v-for="currency in getSupportCurrency"
            v-show="isAvailToken(currency)"
            :key="currency.symbol"
          >
            <section class="user-asset__col__wrap">
              <article class="user-asset__row__wrap">
                  <div class="user-asset__col__icon">
                  <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)" alt="eth" />
                </div>

                <div class="user-asset__col__name">
                  <p>
                    <strong>{{ currency.symbol }}</strong>
                  </p>
                  <p class="text-gray">{{ currency.name }}</p>
                </div>
              </article>
              <article class="user-asset__row__wrap">
                <div class="user-asset__in-wallet__link">
                  <a :href="$wallet.getTokenUrl(currency.currentAddress)" target="_blank" rel="noopener noreferrer">
                    {{ getMaskedAddress(currency.currentAddress) }}
                    <img :src="$static.getFileURL('img/icon/ic-link-pointer-blue.svg')" alt="pointer" class="v-m" />
                  </a>
                </div>

                <div class="user-asset__col__balance">
                  <p>
                    <strong>{{ currency.decBalance.dprec(4) | addComma }}</strong>
                    <span>{{ currency.symbol }}</span>
                  </p>

                  <p class="text-gray">
                    <strong>{{ currency.toFiat(currency.decBalance).dprec(4) | addComma }} USD</strong>
                  </p>
                </div>
              </article>
            </section>

            <div class="user-asset__in-wallet__action">
              <button
                :class="$bem('common-submit-button', '', [isAvailToken(currency) ? 'primary' : 'disabled'])"
                @click="handleDepositCurrency(currency)"
              >
                {{ $t('UserPage.DepositToReserveAsset') }}
              </button>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-asset__in-wallet">
      <ui-collapsible ref="inSolex">
        <user-collapsible-header
          slot="header"
          :title="$t('UserPage.ShowInReserve')"
          :total="getUserDeposited.tokens.length"
        />

        <section v-if="getUserDeposited.tokens.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" />
            <h5>{{ $t('UserPage.EmptyAssetsTitle') }}</h5>
            <p class="text-gray">{{ $t('UserPage.EmptyAssetsDescription') }}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div
            class="user-asset__in-wallet__row"
            v-for="currency in getUserDeposited.tokens"
            v-if="true || currency.tokenAddr[getChainInfo.chain] !== ''"
            :key="currency.symbol"
          >
            <section class="user-asset__col__wrap">
              <article class="user-asset__row__wrap">
                <div class="user-asset__col__icon">
                  <img
                    :src="$static.getFileURL(`img/icon/ic-token-${(currency.tokenInfo.symbol || '').toLowerCase()}.svg`)"
                    alt="eth"
                  />
                </div>

                <div class="user-asset__col__name">
                  <p>
                    <strong>{{ currency.tokenInfo.symbol }}</strong>
                  </p>
                  <p class="text-gray">{{ currency.tokenInfo.name }}</p>
                </div>
              </article>
              <article class="user-asset__row__wrap"> 
                <div class="user-asset__in-wallet__link">
                  <a
                    :href="$wallet.getTokenUrl(currency.tokenInfo.addressToReserve, getChainInfo.chain)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ getMaskedAddress(currency.tokenInfo.addressToReserve) }}
                    <img :src="$static.getFileURL('img/icon/ic-link-pointer-blue.svg')" alt="pointer" class="v-m" />
                  </a>
                </div>

                <div class="user-asset__col__balance">
                  <p>
                    <strong>{{ currency.getDecAmount(currency.depositAmount).dprec(4) | addComma }}</strong>
                    <span>{{ currency.tokenInfo.symbol }}</span>
                  </p>

                  <p class="text-gray">
                    <strong
                      >{{
                        currency.tokenInfo.toFiat(currency.getDecAmount(currency.depositAmount)).dprec(4) | addComma
                      }}
                      USD</strong
                    >
                  </p>
                </div>
              </article>
            </section>

            <div class="user-asset__in-wallet__action">
              <button
                v-if="isAvailToken(currency)"
                :class="$bem('common-submit-button', '', ['primary'])"
                @click="handleWithdrawCurrency(currency)"
              >
                {{ $t('UserPage.WithdrawToMyWalletAsset') }}
              </button>
              <button
                v-else
                :class="$bem('common-submit-button', '', ['primary'])"
                @click="handleWithdrawCurrencyToOther(currency)"
              >
                {{ $t('UserPage.TransferToOtherWallet') }}
              </button>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-asset__in-order">
      <ui-collapsible ref="onSale">
        <user-collapsible-header
          slot="header"
          :title="$t('UserPage.ShowOnOffer')"
          :total="getOnSaleOrAuctionAssets.length"
        />

        <section v-if="getOnSaleOrAuctionAssets.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" />
            <h5>{{ $t('UserPage.EmptyAssetsTitle') }}</h5>
            <p class="text-gray">{{ $t('UserPage.EmptyAssetsDescription') }}</p>
          </div>
        </section>

        <section class="user-collapsible__content">
          <div
            class="user-asset__in-order__row"
            v-for="(currency, i) in getOnSaleOrAuctionAssets"
            :key="currency.symbol"
          >
            <div class="user-asset__col__icon">
              <img
                :src="$static.getFileURL(`img/icon/ic-token-${(currency.tokenInfo.symbol || '').toLowerCase()}.svg`)"
                alt="eth"
              />
            </div>

            <div class="user-asset__col__name">
              <p>
                <strong>{{ currency.symbol }}</strong>
              </p>
              <p class="text-gray">{{ currency.name }}</p>
            </div>

            <div :class="$bem('user-asset__col__balance', '', ['nft'])">
              <p>
                <strong>{{ currency.sellOrders.length }}</strong>
              </p>

              <p class="text-gray">Nfts</p>
            </div>

            <div :class="$bem('user-asset__col__balance', '', '')">
              <p>
                <strong>{{ currency.getDecAmount(currency.onOrderAmount).dprec(4) | addComma }}</strong>
                <span>{{ currency.symbol }}</span>
              </p>

              <p class="text-gray">
                <strong
                  >{{
                    currency.tokenInfo.toFiat(currency.getDecAmount(currency.onOrderAmount)).dprec(4) | addComma
                  }}
                  USD</strong
                >
              </p>
            </div>

            <div class="user-asset__in-order__card-list">
              <section>
                <div
                  class="user-asset__in-order__card"
                  v-for="order in currency.sellOrders"
                  :key="order.nftInfo.id"
                  @click="handleClickSellCard(order.nftInfo)"
                  :style="{
                    'background-image': `url('${getImageUrl(order.nftInfo)}')`,
                    'background-size': 'contain',
                    'background-position': 'center center',
                  }"
                >
                  <ui-tooltip class="user-asset__in-order__tooltip" position="top">
                    <p>{{ order.nftInfo.tokenId }} ({{ order.nftInfo.tokenAddress.slice(0, 8) }})</p>

                    <p>
                      <strong>
                        {{ $bn.toMaxUnit(order.nftInfo.currentPrice, currency.tokenInfo.decimal, 4) | addComma }}
                        {{ currency.tokenInfo.symbol }}
                      </strong>
                      ($ {{ order.nftInfo.usdPrice.dprec(4) | addComma }})
                    </p>
                  </ui-tooltip>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible" :class="$bem('user-asset__in-order', '', ['buy'])">
      <ui-collapsible ref="onBuy">
        <user-collapsible-header slot="header" :title="$t('UserPage.ShowOnBuy')" :total="getOnBuyAssets.length" />

        <section v-if="getOnBuyAssets.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" />
            <h5>{{ $t('UserPage.EmptyBuyItemsTitle') }}</h5>
            <p class="text-gray">{{ $t('UserPage.EmptyBuyItemsDescription') }}</p>

            <button
              :class="$bem('common-submit-button-empty', '', ['primary']) + ' buy-section'"
              @click="handleMakeBuyOffer()"
            >
              {{ $t('Market.RegisterOffer') }}
            </button>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div class="user-asset__in-order__row" v-for="currency in getOnBuyAssets" :key="currency.symbol">
            <div class="user-asset__col__icon">
              <img
                :src="$static.getFileURL(`img/icon/ic-token-${(currency.tokenInfo.symbol || '').toLowerCase()}.svg`)"
                alt="eth"
              />
            </div>

            <div class="user-asset__col__name">
              <p>
                <strong>{{ currency.tokenInfo.symbol }}</strong>
              </p>
              <p class="text-gray">{{ currency.tokenInfo.name }}</p>
            </div>

            <div :class="$bem('user-asset__col__balance', '', ['nft'])">
              <p>
                <strong>{{ currency.buyOrders.length }}</strong>
              </p>

              <p class="text-gray">Nfts</p>
            </div>

            <div :class="$bem('user-asset__col__balance', '', '')">
              <p>
                <strong>{{ currency.getDecAmount(currency.lockBuyAmount).dprec(4) | addComma }}</strong>
                <span>{{ currency.symbol }}</span>
              </p>

              <p class="text-gray">
                <strong
                  >{{
                    currency.tokenInfo.toFiat(currency.getDecAmount(currency.lockBuyAmount)).dprec(4) | addComma
                  }}
                  USD</strong
                >
              </p>
            </div>

            <div class="user-asset__in-order__card-list">
              <section>
                <div
                  class="user-asset__in-order__card"
                  v-for="order in currency.buyOrders"
                  :key="order.id"
                  @click="handleClickBuyCard(order)"
                  :style="
                    order.desc
                      ? {
                          'background-image': `url('${getImageUrl(order)}')`,
                          'background-size': 'contain',
                          'background-position': 'center center',
                        }
                      : {}
                  "
                >
                  <ui-tooltip class="user-asset__in-order__tooltip" position="top">
                    <p>{{ order.tokenId }} ({{ order.tokenAddress.slice(0, 8) }})</p>

                    <p>
                      <strong>
                        {{ $bn.toMaxUnit(order.basePrice, currency.tokenInfo.decimal, 4) | addComma }}
                        {{ currency.tokenInfo.symbol }}
                      </strong>
                      ($ {{ order.usdPrice.dprec(4) | addComma }})
                    </p>
                  </ui-tooltip>
                </div>
              </section>
            </div>
          </div>
          <button :class="$bem('common-submit-button', '', ['primary']) + ' buy-section'" @click="handleMakeBuyOffer()">
            {{ $t('Market.RegisterOffer') }}
          </button>
        </section>
      </ui-collapsible>
    </article>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UserCollapsibleMixin from '@/mixins/user/UserCollapsibleMixin';
import UserCollapsibleHeader from '@/components/user/detail/UserCollapsibleHeader';
import CurrencyTokenAddress from '@/constants/CurrencyTokenAddress';

let $t, component;

export default {
  name: 'UserDetailAssetPage',
  mixins: [UserCollapsibleMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initPage();
    this.$nextTick(this.initCollapsibleStatus);
  },

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      'getChainInfo',
      'getSupportCurrency',
      'getUsedChain',
      'getUserBalance',
      'getUserDeposited',
      'getUserInfo',
      'getMaskedAddress',
      'getUserBuyOrders',
      'getUserSellOrders',
    ]),

    getOnSaleOrAuctionAssets() {
      return _.filter(this.getUserDeposited.tokens, (row) => {
        row.sellOrders = this.getUserSellOrdersEachCurrency(row);
        return row.lockAuctionAmount.dcomp('0') === 1 || row.lockSellAmount.dcomp('0') === 1;
      });
    },

    getOnBuyAssets() {
      return _.filter(_.cloneDeep(this.getUserDeposited.tokens), (row) => {
        row.buyOrders = this.getUserBuyOrdersEachCurrency(row);

        return row.lockBuyAmount.dcomp('0') === 1;
      });
    },

    getTotalAssetToFiat() {
      let result = this.$bn.toBN('0');

      for (const currency of this.getSupportCurrency) {
        result = this.$bn.addBN(result, currency.toFiat(currency.decBalance));
        result = this.$bn.addBN(result, currency.toFiat(currency.decTotalDeposit));
      }

      return String(result);
    },
  },

  watch: {},

  methods: {
    ...mapActions(['setUserDeposited', 'depositToken', 'withdrawToken', 'setUserBuyOrders', 'setUserSellOrders']),

    initPage() {
      this.setUserDeposited();
      this.setUserBuyOrders();
      this.setUserSellOrders();
    },

    initCollapsibleStatus() {
      const { $refs } = this;

      this.$_UserCollapsibleMixin_initCollapsible([$refs.inWallet, $refs.inSolex, $refs.onSale, $refs.onBuy]);
    },

    handleDepositCurrency(row) {
      const targetAddress = row.currentAddress;

      if (!targetAddress) {
        return;
      }

      this.showModal({
        component: 'ReserveInputModal',
        params: {
          action: 'deposit',
          currency: targetAddress,
          onSubmit: (input) => {
            return this.depositToken({
              token: row,
              amount: this.$bn.toMinUnit(input, row.decimal),
            });
          },
        },
      });
    },

    handleWithdrawCurrency(row, toAddress) {
      if (!toAddress) {
        toAddress = this.getUserInfo.address;
      }
      const targetAddress = row.currentAddress;

      if (!targetAddress) {
        return;
      }

      this.showModal({
        component: 'ReserveInputModal',
        params: {
          action: 'withdraw',
          currency: targetAddress,
          onSubmit: (input) => {
            return this.withdrawToken({
              token: row.tokenInfo,
              amount: this.$bn.toMinUnit(input, row.tokenInfo.decimal),
              toAddress: toAddress,
              action: 'withdraw',
            });
          },
        },
      });
    },

    handleWithdrawCurrencyToOther(row) {
      const targetAddress = row.tokenAddress;

      if (!targetAddress) {
        return;
      }

      this.showModal({
        component: 'ReserveInputModal',
        params: {
          currency: targetAddress,
          action: 'transfer',
          onSubmit: (amount, toAddress) => {
            return this.withdrawToken({
              token: row.tokenInfo,
              amount: this.$bn.toMinUnit(amount, row.tokenInfo.decimal),
              toAddress: toAddress,
              action: 'transfer',
            });
          },
        },
      });
    },

    getUserBuyOrdersEachCurrency(currency) {
      return _.filter(this.getUserBuyOrders, (order) => {
        return this.$wallet.isSameAddress(order.currency, currency.tokenInfo.addressToReserve);
      });
    },

    getUserSellOrdersEachCurrency(currency) {
      return _.filter(this.getUserSellOrders, (order) => {
        return this.$wallet.isSameAddress(order.currency, currency.tokenInfo.addressToReserve);
      });
    },

    handleClickBuyCard(order) {
      this.$router.push({
        path: `/asset/item/${order.tokenAddress}/${order.tokenId}`,
        query: {
          type: 'buy',
          tradeId: order.id,
        },
      });
    },

    handleClickSellCard(order) {
      this.$router.push({
        path: `/asset/item/${order.tokenAddress}/${order.tokenId}`,
        query: {
          type: 'sell',
          tradeId: order.tradeId,
        },
      });
    },

    handleMakeBuyOffer() {
      this.$router.push({
        path: `/asset/make-offer/normal`,
        query: {
          type: 'buy',
        },
      });
    },

    getImageUrl(row) {
      if (row.desc && row.desc.image !== '') return row.desc.image;
      if (row.nftInfo && row.nftInfo.desc && row.nftInfo.desc.image !== '') return row.nftInfo.desc.image;
      if (row.nftInfoObject && row.nftInfoObject.desc && row.nftInfoObject.desc.image !== '')
        return row.nftInfoObject.desc.image;
      return '';
    },

    isSupportCurrency(currency) {
      const supportCurrencies = CurrencyTokenAddress;
      for (const key in supportCurrencies) {
        const supportCurrency = supportCurrencies[key];
        const supportCurrencyAddress = supportCurrency[this.getChainInfo.chain];
        if (this.$wallet.isSameAddress(supportCurrencyAddress, currency.tokenAddress)) {
          return true;
        }
        return false;
      }
    },

    isAvailToken(currency) {
      const supportCurrencies = CurrencyTokenAddress;
      const klayAddress = supportCurrencies['KLAY']['KLAYTN'];

      if (this.$wallet.isSameAddress(klayAddress, currency.tokenAddress)) {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          return false;
        }
        return true;
      }
      return true;
    },

    getCount(value) {
      let cnt = 0;
      const curRef = this.$refs[value] ? this.$refs[value] : null;
      if (curRef) {
        for (const row of curRef.children) {
          if (row.style.display !== 'none') {
            cnt += 1;
          }
        }
      }
      return cnt;
    },
  },

  components: {
    UserCollapsibleHeader,
  },
};
</script>
