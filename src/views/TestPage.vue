<template>
  <div>
    test paget

    <button @click="ethvaultClicked">eth vault test</button>
    <button @click="balanceClicked">balance Test</button>
    <button @click="supportCurrencyClicked">support Currency test</button>
    <div>가나다라마바사아자차카타파하</div>
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
    <div>abcdefghijklmnopqrstuvwxyz</div>
    <button @click="cancelNftClicked">cancel nft</button>
    <button @click="cancelNegoClicked">cancel Nego</button>
    <button @click="bidClicked">bid</button>
    <button @click="routeClicked">route</button>
    <br>
    <button @click="transactionFailTest">transaction fail</button>
    <button @click="klipSendKlay">sendklay</button>
    <br><br>
    <button @click="klipRequestModal">showrequestModalKlip</button>
    <br><br>
    <button @click='klipStakingTest'>klipStakingTest</button>
    <button @click="whiteListCurrency">supportCurrency</button>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import { prepare, request, getResult } from 'klip-sdk';
let $t, self

export default {
  name: 'TestPage',

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
    //
    const _ethvault = this.$tx.getEthVaultContract();
    // Log('test3', this.$tx.getKlayminterContract());
    //
  },

  beforeDestroy() {

  },

  data() {
    return {

    }
  },

  computed: {
    ...mapGetters([
        'getSupportCurrency'
    ])
  },

  watch: {

  },

  methods: {
    async cancelNftClicked() {
      const _buyOffer = this.$tx.getBuyOfferContract();
      Log('sellOffer', _buyOffer);
    },

    async ethvaultClicked() {
      const _ethvault = this.$tx.getEthVaultContract();
      const _reserve = this.$tx.getReserveContract();

      const data = await _ethvault.methods.depositToken(
        '0x0000000000000000000000000000000000000000',
        'KLAYTN',
        '0x7EE83d789817Bb1582dbb3544eA70B759A2D90Af',
        100,
        '0x000000000000000000000000d759a88b0a5b3c3d189b9d9029e1551af660005334d24b921a6c9409fd1f59a3f4f96a6185612fd30d3cf38ef5aeff4472255299'
      ).encodeABI();

      const methodParams = [
        '0x0000000000000000000000000000000000000000',
        'KLAYTN',
        '0x7EE83d789817Bb1582dbb3544eA70B759A2D90Af',
        100,
        '0x000000000000000000000000d759a88b0a5b3c3d189b9d9029e1551af660005334d24b921a6c9409fd1f59a3f4f96a6185612fd30d3cf38ef5aeff4472255299'
      ];

      const res2 = await this.$tx.sendTransaction({
        method: 'depositToken',
        sendParams: {
          to: _reserve._address,
          data,
          value: '100'
        },
        methodParams
      })

      /*
      const res = await this.$tx.sendTransaction({
        method: 'deposit',
        sendParams: {
          toChain: "KLAYTN",
          toAddr: "0x7EE83d789817Bb1582dbb3544eA70B759A2D90Af",
          data: "0x000000000000000000000000d759a88b0a5b3c3d189b9d9029e1551af6600053ff0bc60cbe0ef020bf589329b82de50b6aeca12c2388628ffa03ff59073b5edb\n"
        }
      })
       */
    },

    async balanceClicked() {
      const _erc20test = this.$tx.getERC20TestContract();

      const res = await _erc20test.methods.balanceOf(this.getUserInfo.address).call();
    },

    async supportCurrencyClicked() {

    },

    cancelNegoClicked() {
      const _sellOffer = this.$tx.getBuyOfferContract();
      Log('sellOffer', _sellOffer.methods);
    },

    bidClicked() {
      const _auction = this.$tx.getAuctionContract();
      Log('_auction', _auction);
    },

    routeClicked() {
      this.$router.replace(`/render?path=${this.$route.fullPath}`);
    },

    async transactionFailTest() {
      const res = await this.$tx.cancelNegotiation('0xfc0ba2c8e42228bec0b8d1102a37a13bca6b12c505c5e422b59fac94606ed0a5', {
        type: 'cancelNegotiation'
      });
    },

    async klipAuth() {
      const bappName = 'Sole-X';
      const res = await prepare.auth({bappName});
    },

    async klipSendKlay() {
      const _reserve = this.$tx.getReserveContract();
      const bappName = 'Sole-X';
      const to = _reserve._address;
      const amount = '0.0001';
      const executor = this.$tx.getExecutorContract();
      const resPrepare = await prepare.sendKLAY({bappName, to, amount});
      const {expiration_time, request_key, status} = resPrepare;
      if (request_key) {
        this.showModal({
          component: 'KlipLoginModal',
          params: {
            requestKey: request_key
          }
        })

        this.$eventBus.$on('klipRequestFinished', async (payload) => {
          const resRequest = await request(request_key, () => alert("error"));
          const resGetResult = await getResult(request_key);
        });

      }
    },

    klipRequestModal(requestKey) {
      this.showModal({
        component: 'KlipRequestModal',
        params: {
          requestKey: requestKey
        }
      });
    },

    async klipStakingTest() {
      const stakingContractAddress = this.$tx.getContractAddress('StakingContract');
      const reserveContractAddress = this.$tx.getContractAddress('ReserveContract');
      const value = "0";
      const abi = JSON.stringify(this.$tx.getContractFunctionAbi('deposit'));
      const params = "[]";

      Log('d detail', stakingContractAddress, abi, params);

      const resPrepare = await prepare.executeContract({
        bappName: 'SoleX',
        to: reserveContractAddress,
        value,
        abi: abi,
        params: params
      });
      Log('d res', resPrepare);
      if (resPrepare.request_key) {
        this.klipRequestModal(resPrepare.request_key);
        setInterval(async () => {
          const result = await getResult(resPrepare.request_key);
          Log('d result', result);
        }, 3000);
      }
    },

    async whiteListCurrency() {
      const supportCurrencies = await this.getSupportCurrency;
      Log('d sc', supportCurrencies);
    }
  },

  components: {

  }
}
</script>
