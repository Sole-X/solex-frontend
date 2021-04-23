<template>
  <div class="asset-item-card">
    <section class="asset-item-card__thumbnail" @click="handleClickItem" :style="$_AssetCardMixin_getImage(info)">
      <div class="asset-item-card__thumbnail__head">
        <slot name="leftLabel">
          <!--
          <label v-if="options.showLabel && info.isOnTrade" :class="$bem('asset-item-card__type', '', [info.isAuction ? 'buy' : 'sell'])">
            {{info.isAuction ? $t('Market.Auctions') + ' ' + (info.isEndedAuction ? $t('Market.LabelOnOffs')[1] : $t('Market.LabelOnOffs')[0] ) : $t('Market.BuyItNow')}}
          </label>
          -->
        </slot>

        <label v-if="options.showChain" class="asset-item-card__chain">
          <template v-if="info.chainIcon">
            <img :src="info.chainIcon" :alt="`symbol of ${info.chainName}`" />
          </template>
          <!-- 임시 -->
          <template v-else-if="chain === 'ethereum'">
            <img :src="$static.getFileURL('img/icon/ic-token-eth.svg')" >
          </template>
          <template v-else>
            <img :src="$static.getFileURL('img/icon/ic-token-klay.svg')" >
          </template>
          <!-- 임시 -->
        </label>

        <button v-if="options.showHeart" class="asset-item-card__bookmark" ref="heart">
          <img :src="$static.getFileURL(`img/icon/ic-heart-${info.like ? 'on.svg' : 'off.png'}`)" alt="heart" />
        </button>
      </div>
    </section>

    <section class="asset-item-card__detail">
      <div>
        <h6 class="asset-item-card__detail__collection">
          {{info.collectionName || getMaskedAddress(info.tokenAddress)}}
        </h6>
        <label class="asset-item-card__detail__name">
          {{info.itemName || info.tokenId}}
        </label>
      </div>

      <div>
        <p class="asset-item-card__detail__price">
          <strong>{{getPriceOfItem | addComma}}</strong> <span>{{info.currencyInfo ? info.currencyInfo.symbol : ''}}</span>
        </p>

        <p class="asset-item-card__detail__sub">
          <span class="asset-item-card__detail__sub__fiat">
            $ {{(info.usdPrice || '0').dprec(2) | addComma}}
            <span v-if="info.isAuction" class="asset-item-card__detail__sub__divider">
              •
            </span>
          </span>

          <slot name="subCount">
            <span v-if="info.isAuction" class="asset-item-card__detail__sub__orders">
              {{ info.auction.bids ? info.auction.bids.length : 0 }} bids
            </span>

            <span v-if="info.isSell" class="asset-item-card__detail__sub__orders">
              {{ info.exchange.negos ? info.exchange.negos.length : 0}} Negotiations
            </span>
          </slot>

          <span v-if="info.isAuction && !info.isEndedAuction">
            <span class="asset-item-card__detail__sub__divider">•</span>
            <span class="asset-item-card__detail__sub__timer">
              {{remainPeriod.days.setPadding(2)}}:{{remainPeriod.hours.setPadding(2)}}:{{remainPeriod.minutes.setPadding(2)}}
            </span>
          </span>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import AssetCardMixin from '@/mixins/asset/AssetCardMixin'
  import AssetAuctionMixin from '@/mixins/asset/AssetAuctionMixin'

  let $t, component

  export default {
    name: 'AssetItemCard',
    props: {
      info: {
        type: Object,
        default() {
          return {
            currencyInfo: {}
          }
        }
      },
      options: {
        type: Object,
        default() {
          return {
            showLabel: true,
            showChain: true,
            showHeart: true
          }
        }
      },

      chain: String
    },
    mixins: [AssetCardMixin, AssetAuctionMixin],
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.initCard()
    },

    beforeDestroy() {

    },

    data() {
      return {}
    },

    computed: {
      ...mapGetters([
        'getMaskedAddress'
      ]),

      getPriceOfItem() {
        const { info } = this
        const { currencyInfo } = info

        if(_.isEmpty(currencyInfo)) {
          return '0'
        }

        if(!info.auction && !info.exchange) {
          return '0'
        }

        if(info.isAuction) {
          return this.$bn.toMaxUnit(info.auction.currentPrice, currencyInfo.decimal, 4)
        }

        if(info.isExchange) {
          return this.$bn.toMaxUnit(info.exchange.basePrice, currencyInfo.decimal, 4)
        }

        return '0'
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'toggleNft'
      ]),

      async handleToggleNft() {
        const { info } = this
        const type = info.isLiked ? 'off' : 'on'

        const res = await this.toggleNft({
          type,
          tokenAddress: info.tokenAddress || '',
          tokenId: info.tokenId || '',
          tradeId: info.id || ''
        })

        if(!res.success) {
          return
        }

        this.$emit('onToggle', {
          id: info.id,
          value: !info.isLiked
        })
      },

      handleClickItem(e) {
        const { info } = this
        const { heart } = this.$refs

        // 하트 버튼 클릭 시 찜 API 호출
        if(heart && heart.contains(e.target)) {
          return this.handleToggleNft()
        }

        const toQuery = {}

        if(info.isAuction) {
          toQuery.tradeId = info.auction.id
        } else if(info.isExchange) {
          toQuery.tradeId = info.exchange.id

          if(info.isBuy) {
            toQuery.type = 'buy'
          }
        }

        this.$router.push({
          path: `/asset/item/${info.tokenAddress}/${info.tokenId}`,
          query: toQuery
        })
      },

      // TODO : 렌더링된 목록이 많은 경우 느려질 수 있음
      initCard() {
        const { info } = this

        if(info.isAuction && !info.isEndedAuction) {
          this.$_AssetAuctionTimer_initAuctionTimer(info)
        }
      }
    },

    components: {}
  }
</script>
