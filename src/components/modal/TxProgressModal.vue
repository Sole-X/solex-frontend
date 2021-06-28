<template>
  <section class="gen-modal dialog-modal tx-progress-modal">
    <!-- TODO : 다른 트랜잭션 타입 대응 -->
    <article class="gen-modal__content gen-modal__sub-title" v-if="data.type === 'trade'">
      <div>
        <h4>{{ getModalTitle }}</h4>
        <div class="gen-modal__desc" v-html="getModalDescription" />
      </div>
    </article>

    <article class="gen-modal__content tx-progress-modal__anim">
      <common-loader />
    </article>

    <article class="gen-modal__content tx-progress-modal__notice">
      <p>{{ $t('Market.ProgressingTxConfirm') }}</p>
      <p class="text-gray">{{ $t('Market.AboutProgressTxConfirm') }}</p>
    </article>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'TxProgressModal',
  props: {
    data: Object,
    close: Function,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.$eventBus.$on('onReceiveTxPending', this.handlePending);
    this.$eventBus.$on('onReceiveTxResult', this.handleResult);

    // TODO : 메시지 등 사후 대응
    this.closeTimer = setTimeout(() => {
      if (!this._isDestroyed) {
        this.close();
        clearTimeout(this.closeTimer);
      }
    }, 1000 * 60);
  },

  beforeDestroy() {
    this.$eventBus.$off('onReceiveTxPending', this.handlePending);
    this.$eventBus.$off('onReceiveTxResult', this.handleResult);
  },

  data() {
    return {
      closeTimer: null,
    };
  },

  computed: {
    getModalTitle() {
      const { type } = this.data;

      return !type
        ? $t('Market.ProgressingTxConfirm')
        : $t('Market.CompletingAction', {
            type: $t(`Market.${type.toCamelCase()}`),
          });
    },

    getModalDescription() {
      const { type, token, amount, cate } = this.data;

      if (type !== 'trade') {
        return '';
      }

      let actionType = null;
      if (cate === 'buy') {
        actionType = $t('General.Language') === 'KOR' ? '판매' : 'sell';
      } else if (cate === 'sell') {
        actionType = $t('General.Language') === 'KOR' ? '구매' : 'buy';
      } else if (cate === 'auction') {
        actionType = $t('General.Language') === 'KOR' ? '구매' : 'buy';
      } else {
        actionType = $t('General.Language') === 'KOR' ? '거래' : 'trade';
      }

      return $t('Market.CompletingActionDescription', {
        value: this.$bn.toMaxUnit(amount, token.decimal, 4),
        token: token.symbol,
        type: actionType,
      });
    },
  },

  watch: {},

  methods: {
    handlePending(e) {
      if (e.hash !== this.data.hash) {
        return;
      }

      e.result === 'fail' && this.close();
    },

    handleResult(e) {
      if (e.hash !== this.data.hash) {
        return;
      }

      this.close();
    },
  },

  components: {},
};
</script>
