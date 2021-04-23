<template>
  <section class="request-success-page">
    <nav class="request-success__nav">
      <section class="asset-page__category">
        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Item')[0]}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', ['current'])">
          <span>{{getEventType}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Complete')}}</span>
        </div>
      </section>
    </nav>

    <article class="request-success__title">
      <h1>
        {{getEventItem.tokenAddress.slice(0, 10)}}
      </h1>
      <span class="text-secondary"># {{getEventItem.tokenId}}</span>
    </article>

    <article class="request-success__content">
      <div class="request-success__content__icon">
        <img :src="$static.getFileURL('img/icon/ic-modal-check.svg')" alt="check" />
      </div>

      <div class="request-success__content__title">
        <h4><strong>{{getSuccessTitle}}</strong></h4>
      </div>

      <div class="request-success__content__description">
        <p class="text-lightblack" v-html="getSuccessDescription" />
      </div>
    </article>

    <article class="request-success__submit">
      <router-link v-for="button in getSuccessSubmitButtons" :key="button.path" :to="{ path: button.path } ">
        <button :class="$bem('common-submit-button', '', [button.style])">
          {{button.title}}
        </button>
      </router-link>
    </article>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'RequestSuccessPage',
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

      }
    },

    computed: {
      getEventType() {
        const { type } = this.$route.query

        if(type === 'checkout') {
          return $t('Market.BuyItNow')
        }

        if(type === 'bid') {
          return $t('Market.DoBid')
        }

        if(type === 'negotiation') {
          return $t('Market.DoNego')
        }

        if(type === 'cancel') {
          return $t('Market.DoCancel')
        }

        if(type === 'retrieve') {
          return $t('Market.DoRetrieve')
        }

        return ''
      },

      getEventItem() {
        const { tokenAddress, tokenId } = this.$route.query

        return {
          tokenAddress,
          tokenId
        }
      },

      getSuccessTitle() {
        const { type } = this.$route.query

        if(type === 'checkout') {
          return $t('Market.RequestCheckoutSuccess')
        }

        if(type === 'bid') {
          return '입찰이 정상적으로 완료되었습니다'
        }

        if(type === 'negotiation') {
          return $t('Market.RequestNegoSuccess')
        }

        if(type === 'cancel') {
          return $t('Market.RequestCancelSuccess')
        }

        if(type === 'retrieve') {
          return '회수가 정상적으로 완료되었습니다'
        }

        return ''
      },

      getSuccessDescription() {
        return $t('Market.RequestTxSuccessDescription')
      },

      getSuccessSubmitButtons() {
        return [
          {
            title: $t('General.MarketPlace'),
            path: '/home',
            style: 'outline'
          },
          {
            title: $t('General.MyActivity'),
            path: '/user/history?tab=1',
            style: 'primary'
          }
        ]
      }
    },

    watch: {},

    methods: {},

    components: {}
  }
</script>
