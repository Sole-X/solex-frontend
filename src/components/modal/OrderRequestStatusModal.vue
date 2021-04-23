<template>
  <section :class="$bem('gen-modal order-request-status-modal', '', isMakerModal ? ['maker'] : '')">
    <!--
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>Bid on {{data.item.collectionName}} {{data.item.itemName}}</strong>
      </h6>
    </article>
    -->
    <header v-if="data.item.isAuction" class="order-request-status-modal__header">
      <span>{{ $t('Market.Bids0') }}</span>
      <span>:</span>
      <span>{{ getBasePrice }}</span>
    </header>

    <article class="gen-modal__content order-request-status-modal__table">
      <div class="order-request-status-modal__thead">
        <div :class="$bem('order-request-status-modal__tcol', '', [col.type])" v-for="col in getTableHeaders" :key="col.type">
          <strong>{{col.text}}</strong>
        </div>
      </div>

      <div class="order-request-status-modal__tbody">
        <div class="order-request-status-modal__trow" v-for="(request, i) in getRequestList" :key="request.id">
          <div :class="$bem('order-request-status-modal__tcol', '', ['id'])">
            {{i + 1}}
          </div>

          <div :class="$bem('order-request-status-modal__tcol', '', ['bidder'])">
            {{getMaskedAddress(request.account || request.accountAddress)}}
          </div>

          <div :class="$bem('order-request-status-modal__tcol', '', ['amount'])">
            {{$bn.toMaxUnit(request.price || request.negoPrice, getCurrencyInfo(request).decimal, 4) | addComma}} {{getCurrencyInfo(request).symbol}}
          </div>

          <div :class="$bem('order-request-status-modal__tcol', '', ['date'])">
            {{$date.formatDate(request.createdAt, 'ymd/hms')}}
          </div>

          <div v-if="isMakerModal" :class="$bem('order-request-status-modal__tcol', '', ['actions'])">
            <div v-if="request.status === 5 || request.status === 3 || request.status === 8"></div>
            <div v-else-if="request.status === 7"></div>
            <div v-else>
              <button :class="$bem('order-request-status-modal__tcol', '', ['accept'])" @click="handleAcceptRequest(request)">
                {{$t('General.Accept')}}
              </button>

              <button :class="$bem('order-request-status-modal__tcol', '', ['decline'])" @click="handleDeclineRequest(request)">
                {{$t('General.Decline')}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  let $t, component

  export default {
    name: 'OrderRequestStatusModal',
    props: {
      data: Object,
      close: Function
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
      return {}
    },

    computed: {
      ...mapGetters([
        'getMaskedAddress',
          'getSupportCurrency'
      ]),

      getModalTitle() {

      },

      getTableHeaders() {
        const result = [
          {
            type: 'id',
            text: $t('General.Number')
          },
          {
            type: 'bidder',
            text: $t('Market.Bidder')
          },
          {
            type: 'amount',
            text: $t('General.Amount')
          },
          {
            type: 'date',
            text: `${$t('General.Date')} (*GMT)`
          }
        ]

        if(this.isMakerModal) {
          result.push({
            type: 'actions',
            text: ''
          })
        }

        return result
      },

      // Sell Negotiation 모달인데, 내가 해당 아이템의 주인(=Sell 주문 Maker)인 경우
      isMakerModal() {
        const { type, item } = this.data

        return type === 1 && item.isMyWriting
      },

      getRequestList() {
        return this.data.requestList;
      },

      getBasePrice() {
        let basePrice = '0';
        if (this.data.item && this.data.item.auction)
          basePrice = this.data.item.auction.basePrice;

        return this.$bn.toMaxUnit(basePrice, this.data.item.currencyInfo.decimal, 4);
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'acceptNegotiation'
      ]),

      async handleAcceptRequest(request) {
        const { item } = this.data
        const res = await this.acceptNegotiation({
          tradeId: item.tradeId,
          negoMaker: request.accountAddress
        })

        if(!res.success) {
          return
        }

        return this.close()
      },

      handleDeclineRequest(request) {
        this.close()
        this.showModal({
          component: 'DeclineNegoModal',
          params: {
            item: this.data.item,
            negoInfo: request
          }
        })
      },

      getCurrencyInfo(request) {
        const supportCurrencies = this.getSupportCurrency;
        const currency = _.find(supportCurrencies, row => {
          if (row.tokenAddress === request.currency) return true;
          return false;
        })
        if (currency) return currency;
        return {
          decimal: 18,
          symbol: ''
        };
      }
    },

    components: {}
  }
</script>
