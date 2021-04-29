<template>
  <section :class="$bem('asset-item__profile', '', [info.isSell ? 'sell' : 'buy'])">
    <article v-if="info.isEndedExchange && page === 'sell'" class="asset-item__profile__ended">
      <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="info" />
      <span>{{getMessageForEndedExchange}}</span>
    </article>

    <article class="asset-item__profile__title">
      <div class="asset-item__profile__collection">
        <h6>{{info.collectionName || ''}}</h6>
        <button :class="$bem('asset-item__profile__collection__label', '', !info.isEndedExchange ? ['progress'] : '')">
          <strong v-if="info.isBuy">{{ !info.isEndedExchange ? $t('Market.PageLabelBuyOn') : $t('Market.PageLabelBuyOff') }}</strong>
          <strong v-else-if="info.isSell">{{ !info.isEndedExchange ? $t('Market.LabelSaleOn') : $t('Market.LabelSaleOff') }}</strong>
        </button>
      </div>

      <h1>{{info.metadata.name || `Item ${info.tokenId}`}}</h1>
      <div class="asset-item__hypen-row">
        <span class="asset-item__hypen-row__label">{{ info.isBuy ? $t('Market.WantedTitle') : $t('Market.OwnerTitle')}}</span>
        <span class="divider"></span>
        <template v-if="info.isBuy">
          <span v-if="info.isMyItem" class="asset-item__hypen-row__value text-secondary">{{ $t('Market.OwnerIsMe') }}</span>
          <span v-else v-clipboard:copy="info.ownerAddress" class="asset-item__hypen-row__value text-secondary writer-copy" v-clipboard:success="handleWriterClicked">{{ info.ownerAddress }}</span>
        </template>
        <template v-else-if="info.isSell">
          <span v-if="info.isMyItem" class="asset-item__hypen-row__value text-secondary">{{ $t('Market.OwnerIsMe') }}</span>
          <span v-else v-clipboard:copy="info.ownerAddress" class="asset-item__hypen-row__value text-secondary writer-copy" v-clipboard:success="handleWriterClicked">{{ info.ownerAddress }}</span>
        </template>
        <div class="writer-copied" v-if="isCopy">copied</div>
      </div>
    </article>

    <article class="asset-item__profile__detail">
      <ul v-if="info.statusStr === 'SELL'">
        <li>
          <div>{{$t('Market.CurrentNego')}}</div>
          <div class="asset-item__profile__nego">
            <div v-for="(nego, i) in [...info.exchange.currentNegos].slice(0, 8)" :key="nego.id" :style="getNegoUserStyle(nego, i)" class="asset-item__profile__nego__user">

            </div>

            <button class="asset-item__request__more" @click="$_AssetSellMixin_openNegoStatusModal(info)">
              <img :src="$static.getFileURL(`img/icon/ic-message-${info.exchange.currentNegos.length > 0 ? 'black' : 'gray'}.svg`)" />
              <span v-html="$t('Market.NegoCount', { total: info.exchange.negos.length })" />
            </button>
          </div>
        </li>

        <li>
          <div>{{$t('Market.AcceptedCurrency')}}</div>
          <div class="asset-item__profile__pay">
            <div v-for="currency in getSupportCurrency" v-if="isVisibleCurrency(currency)" :class="$bem('asset-item__profile__pay__option', '', ['selected'])">
              <button></button>
              <!--
              <span>{{info.currencyInfo.symbol}}</span>
              -->
              <span>{{ currency.symbol }}</span>
            </div>
          </div>
        </li>
      </ul>

      <ul v-if="Boolean(info.buy)">
        <li class="asset-item__profile__time">
          <div>
            {{$t('Market.ListingDate')}}
          </div>
          <div>
            <strong>{{$date.formatDate(info.exchange.createdAt, 'fff')}}</strong> ({{$date.getFromNow(info.exchange.createdAt)}})
          </div>
        </li>

        <li>
          <div>{{$t('Market.AcceptedCurrency')}}</div>
          <div class="asset-item__profile__pay">
            <div
                v-for="currency in getSupportCurrency"
                v-if="$wallet.isSameAddress(currency.tokenAddress, getCurrency.tokenAddress)"
                :class="$bem('asset-item__profile__pay__option', '', ['selected'])"
            >
              <button></button>
              <span>{{ currency.symbol }}</span>
            </div>
          </div>
        </li>
      </ul>

      <ul>
        <li class="asset-item__profile__detail__price">
          <div>{{$t('Market.Price')}}</div>
          <div>
            <p>
              <strong class="text-secondary">{{ getItemPrice | addComma }}</strong> {{info.currencyInfo.symbol}}
            </p>

            <p>$ {{info.currencyInfo.toFiat($bn.toMaxUnit(info.exchange.basePrice, info.currencyInfo.decimal, 4)).dprec(4) | addComma}}</p>
          </div>
        </li>
      </ul>
    </article>

    <article v-if="walletConnected" class="asset-item__profile__action">
      <button :class="$route.query.tradeId ? 'asset-item__profile__action__bookmark' : 'asset-item__profile__action__bookmark disabled'" @click="handleLikeClicked">
        <img :src="$static.getFileURL(`img/icon/ic-heart-asset-${likeLocal ? 'on' : 'off'}.svg`)" />
      </button>

      <button v-if="buttonProps.leftButton" :class="$bem('common-submit-button', '', buttonProps.leftButton.classes)" @click="buttonProps.leftButton.click">
        {{buttonProps.leftButton.title}}
        <ui-tooltip v-if="buttonProps.leftButton.tooltip" position="bottom">
          {{buttonProps.leftButton.tooltip}}
        </ui-tooltip>
      </button>

      <button v-if="buttonProps.rightButton" :class="$bem('common-submit-button', '', buttonProps.rightButton.classes)" @click="buttonProps.rightButton.click">
        {{buttonProps.rightButton.title}}
        <ui-tooltip v-if="buttonProps.rightButton.tooltip" position="bottom">
          {{buttonProps.leftButton.tooltip}}
        </ui-tooltip>
      </button>
    </article>
  </section>
</template>

<script>
  import AssetSellMixin from '@/mixins/asset/AssetSellMixin'
  import { mapGetters } from 'vuex';

  let $t, component

  export default {
    name: 'AssetItemProfileExchange',

    mixins: [AssetSellMixin],

    props: {
      info: Object,
      buttonProps: Object,
      walletConnected: Boolean,
      page: String,
      like: Boolean
    },

    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {
        likeLocal: this.like,
        isCopy: false
      }
    },

    computed: {
      ...mapGetters([
          'getSupportCurrency'
      ]),

      getMessageForEndedExchange() {
        const { info } = this

        // 협상 제안 내역이 있는 경우
        if(info.exchange.myNego) {
          return info.isWillBeMine ? '축하합니다! 판매자가 사용자의 제안을 수락했습니다.' : '이 NFT의 판매가 종료되었습니다. 자산을 회수해주세요.'
        }

        return $t('Market.ThisItemOfferIsEnded')
      },

      getItemPrice() {
        let basePrice = "0";

        if (this.info.isBuy) {
          basePrice = this.info.buy.basePrice;
        } else if (this.info.isSell) {
          basePrice = this.info.sell.currentPrice;
        } else if (this.info.isAuction) {
          basePrice = this.info.auction.basePrice;
        }

        const currency = this.getCurrency;

        if (currency && currency.symbol && currency.symbol !== 'null') {
          return this.$bn.toMaxUnit(basePrice, currency.decimal, 4);
        }

        return this.$bn.toMaxUnit(basePrice, 18, 4);
      },

      getCurrency() {
        const supportCurrency = this.getSupportCurrency;
        const itemCurrencyAddress = this.info ? this.info.currency : null;

        if (itemCurrencyAddress) {
          const itemCurrency = _.find(supportCurrency, row => {
            if (this.$wallet.isSameAddress(row.tokenAddress, itemCurrencyAddress)) return true;
            return false;
          });
          if (itemCurrency) {
            return itemCurrency;
          }
        }
        return {
          decimal: 18,
          symbol: 'Symbol'
        }
      },
    },

    watch: {

    },

    methods: {
      getNegoUserStyle(nego, index) {
        const r = parseInt(Math.random(0, 255) * 100)
        const g = parseInt(Math.random(0, 255) * 100)
        const b = parseInt(Math.random(0, 255) * 100)

        return {
          zIndex: 8 - (index - 1),
          background: (index - 1) === (8 - 1) ? '#dee3eb' : `rgb(${r}, ${g}, ${b})`
        }
      },

      handleLikeClicked() {
        if (!this.$route.query.tradeId)
          return

        this.$emit('onClickLike');
        this.likeLocal = !this.likeLocal;
      },

      handleWriterClicked(event) {
        this.isCopy = true;
        setTimeout(() => {this.isCopy = false}, 500);
      },

      isVisibleToken(row) {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          if (row.symbol.toLowerCase() === 'klay') {
            return false;
          }
        }
        return true;
      },

      isVisibleCurrency(row) {
        if (this.info.nftInfo && this.info.nftInfo.platform === 'KLAY') {
          const currency = _.find(this.getSupportCurrency, {
            tokenAddress: row.tokenAddress
          });

          if (currency) {
            if (currency.symbol && currency.symbol.toLowerCase() === 'klay') {
              return false
            }
          }
        }
        return true;
      }
    },

    components: {

    }
  }
</script>
