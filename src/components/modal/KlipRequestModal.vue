<template>
  <div class="klip-request-modal">
    <header class="klip-request-modal-header">
      <img :src="$static.getFileURL('img/icon/ic-close-gray.svg')" width="15px" @click="() => close()">
    </header>
    <main class="klip-request-modal-main">
      <div class="klip-request-modal-main-top">
        <div class="klip-request-modal-main-top-title">
          Scan to Request
        </div>
      </div>
      <div class="klip-request-modal-main-bottom">
        <div class="klip-request-modal-main-bottom-qr">
          <canvas id=klip-login-modal__content-QR-image></canvas>
        </div>
        <div class="klip-request-modal-main-bottom-info">
          <img :src="$static.getFileURL('img/logo/logo-klip.svg')" >
          <div class="klip-request-modal-main-bottom-info-desc">
            QR코드 리더기 혹은 카카오톡 앱 > 더보기 > 우측상단의 스캔 아이콘을 눌러 QR코드를 스캔해 주세요.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
let $t, self
import { mapGetters, mapActions } from 'vuex';
import QRCode from 'qrcode';

export default {
  name: 'KlipRequestModal',

  mixins: [],

  props: {
    data: Object,
    close: Function
  },

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {

  },

  data() {
    return {

    }
  },

  computed: {

  },

  watch: {

  },

  methods: {
    initPage() {
      this.$eventBus.$on('klipRequestFinished', (payload) => {
        this.close();
      });

      (function () {
        const requestKey = (self.data && self.data.requestKey) || self.getRequestKey || null;
        if (requestKey) {
          const webStr = `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
          const androidStr = `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${requestKey}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
          const iosStr = `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;

          const canvas = document.querySelector('#klip-login-modal__content-QR-image');
          QRCode.toCanvas(canvas, webStr, (err) => {
            if (err) console.error(err);
            // Log('success');
          })

        }
      })();
    }
  },

  components: {

  }
}
</script>