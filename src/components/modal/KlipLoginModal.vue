<template>
  <div class="klip-login-modal">
    <div class="klip-login-modal__header">
      <div class="klip-login-modal__header__title">
        Scan to Connect
      </div>
    </div>

    <div class="klip-login-modal__content">
      <section>
        <article class="klip-login-modal__content-QR">
          <canvas id="klip-login-modal__content-QR-image"></canvas>
        </article>
      </section>
      <section>
        <div class="klip-login-modal__content__logo">
          <img :src="$static.getFileURL('img/logo/logo-klip.svg')" width="40px">
        </div>
        <div class="klip-login-modal__content__explain">
          QR코드 리더기 혹은 카카오톡 앱 > 더보기 > 우측 상단의 스캔 아이콘을 눌러 QR코드를 스캔해 주세요.
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Store from "@/store";

let $t, self
import { mapGetters, mapActions } from 'vuex';
import QRCode from 'qrcode';

export default {
  name: 'KlipLoginModal',

  props: {
    data: Object,
    close: Function
  },

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
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
  },

  beforeDestroy() {
    this.closeModal();
  },

  data() {
    return {

    }
  },

  computed: {
    ...mapGetters([
        'getRequestKey',
        'getIsAccessing'
    ])
  },

  watch: {
    getRequestKey: function (newVal, oldVal) {

    },

    getIsAccessing: function (newVal, oldVal) {
      if (newVal === false) {
        this.close();
      }
    }
  },

  methods: {
    ...mapActions([
        'closeModal'
    ])
  },

  components: {

  }
}
</script>