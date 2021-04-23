<template>
  <section :class="$bem('asset-item__profile', '', ['auction'])">
    <article v-if="info.isEndedAuction" class="asset-item__profile__ended">
      <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="info" />
      <span>{{getMessageForEndedAuction}}</span>
    </article>

    <article class="asset-item__profile__title">
      <div class="asset-item__profile__collection">
        <h6>{{info.collectionName || '-'}}</h6>
        <button :class="$bem('asset-item__profile__collection__label', '', !info.isEndedAuction ? ['progress'] : '')">
          <strong>{{ !info.isEndedAuction ? $t('Market.LabelAuctionOn') : $t('Market.LabelAuctionOff') }}</strong>
        </button>
      </div>

      <h1>{{info.itemName}}</h1>
      <div class="asset-item__hypen-row">
        <span class="asset-item__hypen-row__label">{{$t('Market.OwnerTitle')}}</span>
        <span class="divider"></span>
        <span v-if="info.isMyItem" class="asset-item__hypen-row__value text-secondary">{{ $t('Market.OwnerIsMe') }}</span>
        <span v-else v-clipboard:copy="info.ownerAddress" class="asset-item__hypen-row__value text-secondary writer-copy" v-clipboard:success="handleWriterClicked">{{ info.ownerAddress }}</span>
        <div class="writer-copied" v-if="isCopy">copied</div>
      </div>
    </article>

    <article class="asset-item__profile__detail">
      <ul>
        <li>
          <div>{{info.isEndedAuction ? $t('Market.FinalBid') : (isNotBidder ? $t('Market.Bids0') : $t('Market.CurrentBid') ) }}</div>
          <div class="asset-item__profile__detail__bids">
            <div class="asset-item__profile__detail__bids__latest">
              <p>
                <strong class="text-black">{{$bn.toMaxUnit(info.auction.currentPrice, info.currencyInfo.decimal, 4) | addComma}} </strong> {{info.currencyInfo.symbol}}
              </p>

              <p class="text-gray">
                $ {{ info.currencyInfo ? info.currencyInfo.toFiat($bn.toMaxUnit(info.auction.currentPrice, info.currencyInfo.decimal)).dprec(4) : info.usdPrice | addComma}}
              </p>
            </div>

            <div class="asset-item__profile__detail__bids__others">
              <button class="asset-item__request__more" @click="handleOpenBids()">
                <img :src="$static.getFileURL(`img/icon/ic-message-${info.auction.bids.length > 0 ? 'black' : 'gray'}.svg`)" />
                <span v-html="$t('Market.BidCount', { total: info.auction.bids.length })" />
              </button>
            </div>
          </div>
        </li>

        <li>
          <div>{{$t('Market.TimeRemaining')}}</div>
          <div class="asset-form__price">
            <div class="asset-form__price__timer">
              <strong>{{remainPeriod.days.setPadding(2)}}</strong>{{ $t('Market.AuctionDay') }} : <strong>{{remainPeriod.hours.setPadding(2)}}</strong>{{ $t('Market.AuctionHour') }} : <strong>{{remainPeriod.minutes.setPadding(2)}}</strong>{{ $t('Market.AuctionMinute') }} : <strong>{{ remainPeriod.seconds.setPadding(2) }}</strong>{{ $t('Market.AuctionSecond') }}
            </div>

            <div class="asset-form__price__ended">
              {{$t('Market.EndedAt')}} <span class="divider">|</span> {{$date.formatDate(info.auction.endTime, 'fff')}}
            </div>
          </div>
        </li>
      </ul>

      <ul>
        <li class="asset-item__profile__detail__price">
          <div>{{$t('Market.Price')}}</div>
          <div>
            <p>
              <strong class="text-secondary">
                {{ !this.info.isEndedAuction ? getStraightPrice('token') : getFinalPrice('token') | addComma }}
              </strong> {{ info.currencyInfo.symbol}}
            </p>

            <p>
              $ {{ !this.info.isEndedAuction ? getStraightPrice('usd') : getFinalPrice('usd') | addComma}}
            </p>
          </div>
        </li>
      </ul>
    </article>

    <article v-if="walletConnected" class="asset-item__profile__action">
      <button v-if="" :class="$route.query.tradeId ? 'asset-item__profile__action__bookmark' : 'asset-item__profile__action__bookmark disabled'" @click="handleLikeClicked">
        <img :src="$static.getFileURL(`img/icon/ic-heart-asset-${likeLocal ? 'on' : 'off'}.svg`)" />
      </button>
      <template v-if="loadingRemainPeriod">
        <button v-if="buttonProps.leftButton" :class="$bem('common-submit-button', '', buttonProps.leftButton.classes)" @click="buttonProps.leftButton.click">
          {{buttonProps.leftButton.title}}
          <ui-tooltip v-if="buttonProps.leftButton.tooltip" position="bottom">
            {{buttonProps.leftButton.tooltip}}
          </ui-tooltip>
        </button>
        <button v-if="buttonProps.rightButton" :class="$bem('common-submit-button', '', buttonProps.rightButton.classes)" @click="buttonProps.rightButton.click">
          {{buttonProps.rightButton.title}}
          <ui-tooltip v-if="buttonProps.rightButton.tooltip" position="bottom">
            {{buttonProps.rightButton.tooltip}}
          </ui-tooltip>
        </button>
      </template>
      <template v-else>
        <common-loader />
      </template>
    </article>
  </section>
</template>

<script>
  import AssetAuctionMixin from '@/mixins/asset/AssetAuctionMixin'
  import {mapGetters, mapActions} from 'vuex';

  let $t, component

  export default {
    name: 'AssetItemProfileAuction',

    props: {
      info: Object,
      buttonProps: Object,
      walletConnected: Boolean,
      page: String,
      like: Boolean
    },

    mixins: [AssetAuctionMixin],

    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.$_AssetAuctionTimer_initAuctionTimer(this.info)
    },

    beforeDestroy() {

    },

    data() {
      return {
        loadingRemainPeriod: false,
        likeLocal: this.like,
        isCopy: false
      }
    },

    computed: {
      ...mapGetters([
          'getItemInfo',
          'getSupportCurrency'
      ]),

      getMessageForEndedAuction() {
        const { info } = this
        const { auction } = info;
        const { isAuctionSeller, buyerAddress } = auction;

        // 경매 낙찰자
        if(info.isWillBeMine) {
          return $t('Market.FinishedAuctionMsgForBidder')
        }

        // 낙찰된 경매의 등록자
        if(info.isAuctionSeller) {
          if (buyerAddress && buyerAddress !== '') {
            return $t('Market.FinishedAuctionMsgForOwner')
          }
        }

        return $t('Market.FinishedAuctionMsgForOther')
      },

      isNotBidder() {
        if (this.info.auction) {
          const basePriceNum = Number(this.info.auction.basePrice);
          const currentPriceNum = Number(this.info.auction.currentPrice);

          if (basePriceNum && currentPriceNum && basePriceNum === currentPriceNum) {
            return true;
          }
        }
        return false;
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
        if (currency.symbol !== 'null') {
          return this.$bn.toMaxUnit(basePrice, currency.decimal, 4);
        }

        return basePrice;
      },

      getCurrency() {
        const supportCurrency = this.getSupportCurrency;
        const itemCurrencyAddress = this.item ? this.item.currency : null;

        if (itemCurrencyAddress) {
          const itemCurrency = _.find(supportCurrency, { tokenAddress: itemCurrencyAddress });
          if (itemCurrency) {
            return itemCurrency;
          }
        }
        return {
          decimal: 18,
          symbol: 'Symbol'
        }
      },

      getRemainPeriodMask() {

      }
    },

    watch: {
      remainPeriod: function () {
        if (!this.loadingRemainPeriod) this.loadingRemainPeriod = true;
      }
    },

    methods: {
      ...mapActions([
          'cancelAuction',
          'closeAuction'
      ]),

      handleOpenBids() {
        this.$_AssetAuctionMixin_openBidStatusModal(this.info)
      },

      isMyWriting() {
        if (this.info.ownerAddress && this.$wallet.isSameAddress(this.info.ownerAddress, this.getUserInfo.address)) {
          return true;
        }
        return false;
      },

      isAuctionSuccess() {
        if (this.info.auction && this.info.auction.bids && this.info.auction.bids.length > 0) return true;
        return false;
      },

      getStraightPrice(type) {
        if (type === 'token') {
          if (this.info.auction && this.info.auction.type === 2)
            return this.$bn.toMaxUnit(this.info.auction.straightPrice, this.info.currencyInfo.decimal, 4);
          else
            return this.$bn.toMaxUnit(this.info.auction.currentPrice, this.info.currencyInfo.decimal, 4);
        } else if (type === 'usd') {
          if (this.info.auction && this.info.auction.type === 2)
            return this.info.currencyInfo.toFiat(this.$bn.toMaxUnit(this.info.auction.straightPrice, this.info.currencyInfo.decimal)).dprec(4);
          else
            return this.info.currencyInfo.toFiat(this.$bn.toMaxUnit(this.info.auction.currentPrice, this.info.currencyInfo.decimal)).dprec(4);
        }
      },

      getFinalPrice(type) {
        if (type === 'token') {
          if (this.info.auction) {
            return this.$bn.toMaxUnit(this.info.auction.currentPrice, this.info.currencyInfo.decimal, 4);
          }
        } else if (type === 'usd') {
          if (this.info.auction && this.info.currencyInfo) {
            return this.info.currencyInfo.toFiat(this.$bn.toMaxUnit(this.info.auction.currentPrice, this.info.currencyInfo.decimal)).dprec(4);
          }
        }
        return '0';
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
      }
    },

    components: {}
  }
</script>
