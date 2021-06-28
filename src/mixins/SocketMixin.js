import { io } from 'socket.io-client';

export default {
  mounted() {
    this.socket = {};
    this.$_SocketMixin_initSocket();

    this.$eventBus.$on('emitTx', this.$_SocketMixin_subscribeTx);
  },

  beforeDestory() {
    this.$eventBus.$off('emitTx', this.$_SocketMixin_subscribeTx);
  },

  watch: {
    getUserInfo(newVal, oldVal) {
      if (newVal.address && !oldVal.address) {
        this.$_SocketMixin_subscribeUser();
      }
    },
  },

  methods: {
    $_SocketMixin_initSocket() {
      this.socket = io.connect(process.env.VUE_APP_API_ENDPOINT, {
        path: '/socket.io',
      });
    },

    $_SocketMixin_subscribeUser() {
      this.$_SocketMixin_unsubscribeUser();

      this.socket.on('pending', this.$_SocketMixin_handleTxPending);
      this.socket.on('result', this.$_SocketMixin_handleTxResult);
    },

    $_SocketMixin_unsubscribeUser() {
      this.socket.off('pending', this.$_SocketMixin_handleTxPending);
      this.socket.off('result', this.$_SocketMixin_handleTxResult);
    },

    $_SocketMixin_handleTxPending(e) {
      this.$eventBus.$emit('onReceiveTxPending', e);
    },

    $_SocketMixin_handleTxResult(e) {
      this.$eventBus.$emit('onReceiveTxResult', e);
    },

    $_SocketMixin_subscribeTx(hash) {
      this.socket.emit('send', hash);
    },
  },
};
