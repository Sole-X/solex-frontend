<template>
  <div :class="$bem('user-history__table', '', ['item'])">
    <div class="user-history__thead">
      <div class="text-gray" v-for="col in getItemTableHeads" :key="col.type" :class="$bem('user-history__col', '', [col.type])">
        {{col.name}}
      </div>
    </div>

    <!-- TODO : API, 주문 있는 경우 해당 정보 로딩하기 -->
    <div class="user-history__tbody">
      <div class="user-history__row" v-for="row in list" :key="row.id">
        <div :class="$bem('user-history__col', '', ['date'])">
          {{$date.formatDate(row.createdAt, 'fff')}}
        </div>

        <div :class="$bem('user-history__col', '', ['event'])">
          {{row.eventToString}}
        </div>

        <div :class="$bem('user-history__col', '', ['nft'])">
          <div
              class="user-history__nft__thumbnail"
              :style="{'background-image': `url('${getImageUrl(row)}')`, 'background-size': 'contain', 'background-position': 'center center'}"
              @click="(event) => handleItemClicked(event, row)"
          >
          </div>

          <div class="user-history__nft__detail">
            <p class="user-history__nft__detail__item">
              {{row.tokenId}}
            </p>
            <p class="user-history__nft__detail__collection text-gray">
              {{getMaskedAddress(row.tokenAddress)}}
            </p>
            <p class="user-history__nft__detail__owner">
              Owner : <span>{{getMaskedAddress(row.nftInfo.ownerAddress)}}</span>
            </p>
          </div>
        </div>

        <div :class="$bem('user-history__col', '', ['price'])">
          <p> {{ getAmount(row) }} </p>
          <p>$ {{ getUsdPrice(row) }}</p>
        </div>

        <div :class="$bem('user-history__col', '', ['hash'])">
          <a :href="$wallet.getTxUrl(row.txHash, 'KLAYTN')" target="_blank" rel="noopener noreferrer">
            {{getMaskedAddress(row.txHash)}}
          </a>
        </div>

        <div :class="$bem('user-history__col', '', ['state'])">
          <div class="state-complete" v-if="getEventState(row) === 'success'">
            {{ $t('General.Success') }}
          </div>

          <div class="state-fail" v-else-if="getEventState(row) === 'cancel'">
            {{$t('General.Cancel')}}
          </div>

          <div class="state-fail state-reject" v-else-if="getEventState(row) === 'reject' || getEventState(row) === 'fail'">
            {{$t('General.Fail')}}
            <button class="text-lightblack" @click="handleShowDetail(row)">
              {{$t('General.ShowDetail')}}
            </button>
          </div>

          <div class="state-complete" v-else-if="getEventState(row) === 'complete'">
            {{ $t('General.Complete') }}
          </div>

          <div class="state-progress" v-else-if="getEventState(row) === 'progress'">
            {{$t('General.InProgress')}}
          </div>

          <div v-else>
            {{ row.eventState }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  let $t, component

  export default {
    name: 'UserHistoryItemTable',
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
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

      getItemTableHeads() {
        return [
          {
            name: $t('General.Date'),
            type: 'date'
          },
          {
            name: $t('Market.Event'),
            type: 'event'
          },
          {
            name: 'NFT',
            type: 'nft'
          },
          {
            name: $t('Market.Price'),
            type: 'price'
          },
          {
            name: 'Transaction Hash',
            type: 'hash'
          },
          {
            name: $t('General.State'),
            type: 'state'
          }
        ]
      },
    },

    watch: {},

    methods: {
      ...mapActions([
        'showActivityDetail'
      ]),

      async handleShowDetail(row) {
        const { typeStr } = row;
        /*
        if(row.eventState !== 'fail') {
          return
        }

         */

        this.showActivityDetail({
          type: 'item',
          event: row.realEventName,
          body: {
            offerId: row.tradeId,
            page: typeStr === 'BUY' ? 'buy' : 'sell'
          }
        })
      },

      getClassNameOfEventState(row) {
        const eventState = this.getEventState(row)

        if (eventState === 'fail') {
          return 'fail';
        } else if (row.isProgress) {
          return 'progress';
        } else {
          return 'success';
        }
      },

      handleItemClicked(event, row) {
        const { typeStr, tokenAddress, tokenId, tradeId } = row;

        this.$router.push({
          path: `/asset/item/${tokenAddress}/${tokenId}`,
          query: {
            tradeId,
            type: typeStr === 'BUY' ? 'buy' : 'sell'
          }
        })
      },

      getImageUrl(row) {
        if (row && row.nftInfo && row.nftInfo.desc) return row.nftInfo.desc.image;
        return '';
      },

      getEventState(row) {
        const eventState = row.eventState;
        const eventType = row.eventType;

        if (eventType === 1 || eventType === 2 || eventType === 3) {
          switch (eventState) {
            case 'pending':
            case 'start':
              return 'progress';
            case 'cancel':
              return 'cancel';
            case 'done':
              return 'complete';
            case 'fail':
              return 'fail';
            default:
              return eventState
          }
        } else if (eventType === 4 || eventType === 5) {
          switch (eventState) {
            case 'start':
              return 'progress';
            case 'cancel':
              return 'cancel';
            case 'reject':
              return 'reject';
            case 'done':
              return 'success';
            case 'fail':
              return 'fail';
            default:
              return eventState;
          }
        }
        return eventState;
      },

      getUsdPrice(row) {
        return row.nftInfo.usdPrice || '0';
      },

      getAmount(row) {
        if(!row.currencyInfo) {
          return '0';
        }

        return this.$bn.toMaxUnit(row.amount, row.currencyInfo.decimal, 4) + ' ' + row.currencyInfo.symbol;
      }
    },

    components: {}
  }
</script>
