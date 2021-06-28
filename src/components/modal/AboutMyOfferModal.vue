<template>
  <div class="gen-modal dialog-modal" :class="getModalClass">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__content gen-modal__sub-title">
      <h4>{{ getTitle }}</h4>
    </article>
    <article class="gen-modal__content about-my-offer__notice">
      <ul>
        <li v-for="(notice, i) in getNoticeList" :key="i">
          <img :src="notice.icon" alt="icon" />
          <p v-html="notice.text">{{ notice.text }}</p>
        </li>
      </ul>
    </article>

    <article v-if="isAboutBid" class="gen-modal__content about-my-offer__item">
      <!-- TODO : My Activity 아이템 Column과 통일 -->
      <div class="about-my-offer__item__container">
        <div class="about-my-offer__item__thumbnail">
          <img :src="getItemInfo.image" width="80px" height="80px" />
        </div>
        <div class="about-my-offer__item__description">
          <div class="description-name">{{ getItemInfo.name }}</div>
          <div class="description-desc">{{ getItemInfo.description }}</div>
          <div class="description-time">{{ translateTimeFormat(data.info.startTime) }}</div>
        </div>
      </div>

      <div class="about-my-offer__item__reason">
        <span v-html="getOfferReason" />
      </div>

      <!-- TODO : 약관 페이지 -->
      <div v-if="data.event === 'BID_REMOVE'" class="about-my-offer__item__link">
        <a href="https://www.naver.com" target="_blank" rel="noopener norefferer">
          {{ $t('UserPage.SeeTermsOfService') }}
        </a>
      </div>
    </article>

    <article v-if="data.event === 'NEGO_REJECT'" class="gen-modal__content about-my-offer__decline-reason">
      <textarea
        class="decline-nego__message-box"
        :value="data.info.myNegoForReject && data.info.myNegoForReject.declineReason"
        disabled
      />
    </article>

    <article class="gen-modal__submit-wrap">
      <button :class="$bem('common-submit-button', '', ['outline-primary'])" @click="close()">
        {{ $t('General.Close') }}
      </button>

      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleSubmit()">
        {{ $t('General.ViewItem') }}
      </button>
    </article>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RejectNegoTypes from '@/constants/RejectNegoTypes';

let $t, component;

export default {
  name: 'AboutMyOfferModal',
  props: {
    data: Object,
    close: Function,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.setOfferItem({
      tokenAddress: this.data.info.tokenAddress,
      tokenId: this.data.info.tokenId,
    });
  },

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getOfferItem', 'getSupportCurrency']),

    getModalClass() {
      const options = this.isAboutBid ? '' : ['fail-nego'];

      return this.$bem('about-my-offer-modal', '', options);
    },

    getTitle() {
      const { event } = this.data;

      if (event === 'BID_FAIL') {
        return $t('UserPage.AboutOfferFailBid');
      }

      if (event === 'NEGO_REJECT') {
        return $t('UserPage.AboutOfferRejected');
      }

      if (event === 'BID_REMOVE') {
        return $t('UserPage.AboutOfferRemoved');
      }

      if (event === 'BUY_CANCEL' || event === 'SELL_CANCEL') {
        return $t('UserPage.AboutOfferCanceled');
      }
    },

    getNoticeList() {
      const { info, event } = this.data;
      const { getFileURL } = this.$static;

      if (event === 'BID_FAIL') {
        return [
          {
            icon: getFileURL('img/icon/ic-info-black.svg'),
            text: $t('UserPage.AboutOfferFailBidDesc1'),
          },
        ];
      }

      if (event === 'NEGO_REJECT') {
        const rejectNegoDetail = _.find(RejectNegoTypes, (row) => {
          if (info.myNegoForReject) return row.id === info.myNegoForReject.declineType;
        }) || { text: 'unknown reason' };

        let currencySymbol = 'Token';
        if (rejectNegoDetail) {
          const currency = _.find(this.getSupportCurrency, (supportCurrency) => {
            if (this.$wallet.isSameAddress(supportCurrency.tokenAddress, info.myNegoForReject.currency)) return true;
            return false;
          });
          if (currency) {
            currencySymbol = currency.symbol;
          }
        }

        return [
          {
            icon: getFileURL('img/icon/ic-info-black.svg'),
            /*
              text: $t('UserPage.AboutOfferRejectedDesc1', {
                reason: rejectNegoDetail.text($t)
              })
               */
            text:
              this.$t('UserPage.AboutOfferRejectedDesc1') +
              ' ' +
              (typeof rejectNegoDetail.text === 'function' ? rejectNegoDetail.text($t, currencySymbol) : ''),
          },
          {
            icon: getFileURL('img/icon/ic-mail-black.svg'),
            text: this.$t('UserPage.AboutOfferRejectedDesc2'),
          },
        ];
      }

      if (event === 'BID_REMOVE') {
        return [
          {
            icon: getFileURL('img/icon/ic-info-black.svg'),
            text: this.$t('UserPage.AboutOfferRemovedDesc1'),
          },
        ];
      }

      if (event === 'BUY_CANCEL' || event === 'SELL_CANCEL') {
        return [
          {
            icon: getFileURL('img/icon/ic-info-black.svg'),
            text: this.$t('UserPage.AboutOfferCanceledDesc1'),
          },
        ];
      }

      return [];
    },

    getOfferReason() {
      const { event } = this.data;

      if (event === 'BID_FAIL') {
        return $t('UserPage.AboutOfferFailBidDesc2');
      }

      if (event === 'NEGO_REJECT') {
        // TODO : API
        return '';
      }

      if (event === 'BID_REMOVED') {
        return $t('UserPage.AboutOfferRemovedDesc2');
      }
    },

    isAboutBid() {
      const { event } = this.data;

      return event !== 'NEGO_REJECT';
    },

    getItemInfo() {
      let item = this.getOfferItem.desc;

      return item;
    },
  },

  watch: {},

  methods: {
    ...mapActions(['setOfferItem']),

    handleSubmit() {
      const { tokenAddress, tokenId } = this.data.info;
      const tradeId = this.data.tradeId;

      this.$router.push({
        path: `/asset/item/${tokenAddress}/${tokenId}`,
        query: {
          type: this.data.page,
          tradeId: this.data.tradeId,
        },
      });
      this.close();
    },

    translateTimeFormat(time) {
      let newTime = '';
      const timeObj = new Date(time);
      let isAm = null;
      if (timeObj.getHours() <= 12) {
        isAm = true;
      } else {
        isAm = false;
      }
      if (this.$t('General.Language') === 'KOR') {
        newTime = `${timeObj.getFullYear()}년 ${timeObj.getMonth()}월 ${timeObj.getDate()}일`;
        newTime += ` ${isAm ? '오전' : '오후'} ${
          isAm ? timeObj.getHours() : timeObj.getHours() - 12
        }:${timeObj.getMinutes()}에 입찰`;
      } else {
        newTime = `Start from ${timeObj.toLocaleDateString()}`;
        newTime += ` ${timeObj.getHours()}:${timeObj.getMinutes()}`;
      }

      return newTime;
    },
  },

  components: {},
};
</script>
