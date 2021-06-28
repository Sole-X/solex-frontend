<template>
  <div class="connect-wallet-terms-modal">
    <header class="connect-wallet-terms-modal-header">
      <div class="connect-wallet-terms-modal-header-bar">
        <img :src="$static.getFileURL('img/icon/ic-modal-close.svg')" @click="handleClose" />
      </div>
    </header>
    <main class="connect-wallet-terms-modal-main">
      <div class="connect-wallet-terms-modal-header-title">
        <h4>{{ $t('General.TermModalTitle') }}</h4>
      </div>
      <div v-if="getLanguage === 'eng'" class="connect-wallet-terms-modal-main-content">
        Please take a few minutes to read and understand the Sole-X
        <span @click="usageTermsClicked">Terms of Service</span> and
        <span @click="privacyPolicyClicked">Privacy Policy</span> before checking the box below. By Continuing, you
        confirm that you accept the Terms of Service and Privacy Policy and are at least 13 years old.
      </div>
      <div v-else-if="getLanguage === 'kor'" class="connect-wallet-terms-modal-main-content">
        서비스 이용을 위해서는 Sole-X <span @click="usageTermsClicked">이용약관</span>과
        <span @click="privacyPolicyClicked">개인정보처리방침</span>에 동의하셔야 합니다. 이용약관과 개인정보처리방침에
        동의하시고, 만 14세 이상이시면 아래 항목을 체크한 후 확인 버튼을 클릭해주세요.
      </div>
      <div class="connect-wallet-terms-modal-footer-checkbox">
        <input type="checkbox" v-model="checked" value="agree" />{{ $t('General.TermModalInput') }}
      </div>
    </main>
    <footer class="connect-wallet-terms-modal-footer">
      <button ref="button" class="connect-wallet-terms-modal-footer-button disabled" @click="handleProceedClicked">
        {{ $t('General.TermModalSubmit') }}
      </button>
    </footer>
  </div>
</template>

<script>
const MAX_LENGTH = 1;

export default {
  name: 'ConnectWalletTermsModal',

  props: {
    data: Object,
    close: Function,
  },

  data() {
    return {
      checked: [],
    };
  },

  computed: {
    getLanguage() {
      return this.$t('General.Language').toLowerCase();
    },
  },

  watch: {
    checked: function (newVal, oldVal) {
      if (newVal && newVal.length == MAX_LENGTH) {
        this.$refs.button.className = this.$refs.button.className.replace('disabled', 'active');
      } else {
        this.$refs.button.className = this.$refs.button.className.replace('active', 'disabled');
      }
    },
  },

  methods: {
    handleClose() {
      this.close();
    },

    handleProceedClicked(event) {
      if (event.target.className.includes('active')) {
        this.$eventBus.$emit('connectWalletTermsModalProceed');
        this.close();
      }
    },

    usageTermsClicked() {
      const baseURL = process.env.VUE_APP_API_ENDPOINT;
      const pathURL = 'customer/usage-terms';
      const targetURL = `${baseURL}/${pathURL}`;
      window.open(targetURL, 'solex usage terms');
    },

    privacyPolicyClicked() {
      const baseURL = process.env.VUE_APP_API_ENDPOINT;
      const pathURL = 'customer/privacy-policy';
      const targetURL = `${baseURL}/${pathURL}`;
      window.open(targetURL, 'solex privacy policy');
    },
  },
};
</script>
