import { mapActions } from 'vuex'
let keyEvent;

export default {
  mounted() {
    keyEvent = (event) => {
      const { keyCode } = event;
      this.command.push(keyCode);
      if (this.command.length > 5) {
        this.command = [...this.command.slice(1)];
      }
      if (this.command.length === 5) {
        let flag = true;
        for (let i = 0; i < this.command.length; i++) {
          const num = this.command[i];
          if (i === 0 || i === 1) {
            if (num !== 75) flag = false;
          } else if (i===2) {
            if (num !== 76) flag = false;
          } else if (i===3) {
            if (num !== 73) flag = false;
          } else if (i===4) {
            if (num !== 80) flag = false;
          }
        }
        if (flag) {
          this.isAvailConnectKlip = true;
        } else {
          this.isAvailConnectKlip = false;
        }
      }
    }
    window.addEventListener('keyup', keyEvent);
  },

  beforeDestroy() {
    window.removeEventListener('keyup', keyEvent);
  },

  data() {
    return {
      command: [],
      isAvailConnectKlip: false,
    }
  },

  methods: {
    ...mapActions([
        'login',
        'logout',
        'showModal'
    ]),

    async $_UserWalletMixin_handleConnect(service) {
      if (!this.isAvailConnectKlip) {
        if (service.className.includes('disabled')) {
          return;
        }
      }

      if(this.getUserInfo.address) {
        return
      }

      if (!window.localStorage.getItem(service.name) || window.localStorage.getItem(service.name) === 'false')
        window.localStorage.setItem(service.name, 'true');

      if (!window.localStorage.getItem('wallet') || window.localStorage.getItem('wallet') === 'disconnected') {
        this.$eventBus.$on('connectWalletTermsModalProceed', () => {
          window.localStorage.setItem('wallet', 'connected');
          this.$_UserWalletMixin_handleConnect(service);
          this.$eventBus.$off('connectWalletTermsModalProceed');
        })

        this.showModal({
          component: 'ConnectWalletTermsModal',
          params: {

          }
        })

        return;
      }

      const res = await this.login({
        chain: service.chain.toUpperCase(),
        service: service.type
      })

      const $t = this.$t.bind(this)

      if(!res.success) {
        this.showAlert({
          title: $t('General.ConnectWalletFailTitle'),
          content: $t('General.ConnectWalletFailDescription', {
            service: service.name,
            link: this.$wallet.getInstallURL()
          }),
          confirm: {
            cancel: {
              text: $t('General.Close')
            },
            accept: {
              text: $t('General.Retry'),
              callback: () => {
                return this.$_UserWalletMixin_handleConnect(service)
              }
            }
          }
        })
      } else {
        this.$eventBus.$emit('walletConnected');
      }

      return res
    },

    async $_UserWalletMixin_handleDisconnect(service) {
      await this.logout();
    },

    $_UserWalletMixin_getAvailableService() {
      return [
        {
          type: 'metamask',
          name: 'Metamask',
          chain: 'Ethereum',
          icon: this.$static.getFileURL('img/logo/logo-metamask.svg'),
          className: "select-wallet__option option-metamask",
          appear: 'Ethereum'
        },
        {
          type: 'kaikas',
          name: 'Kaikas',
          chain: 'klaytn',
          icon: this.$static.getFileURL('img/logo/logo-kaikas.svg'),
          className: "select-wallet__option option-kaikas",
          appear: 'Klaytn'
        },
        {
          type: 'klip',
          name: 'Klip',
          chain: 'klaytn',
          icon: this.$static.getFileURL('img/logo/logo-klip.svg'),
          className: "select-wallet__option option-klip",
          appear: 'Klaytn'
        },
      ]
    }
  }
}
