<template>
  <section class="asset-item__chain">
    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t('Market.ChainContract') }}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value text-secondary">
        {{ getContractAddress }}
      </span>
    </div>

    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t('Market.ChainTokenId') }}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value">
        {{ info.tokenId }}
      </span>
    </div>

    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t('Market.ChainBlockchain') }}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value">
        {{ info.chainName }}
      </span>
    </div>

    <article class="asset-item__chain__about">
      {{ getChainDescription(info.chainName) }}
    </article>
  </section>
</template>

<script>
let $t, component;
import { mapGetters } from 'vuex';

export default {
  name: 'AssetItemChainPage',
  props: {
    info: Object,
    history: Object,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getSupportCurrency']),

    getContractAddress() {
      const chainName = this.info.chainName;
      const tokenObj = _.find(this.getSupportCurrency, (currency) => {
        if (currency.name === chainName) return true;
        return false;
      });
      if (tokenObj && tokenObj.tokenAddress) return tokenObj.tokenAddress;
      return '';
    },
  },

  watch: {},

  methods: {
    getChainDescription(chainName) {
      const ethEng =
        'Ethereum is a decentralized open-source blockchain system that features its own cryptocurrency,\n' +
        '      Ether. ETH works as a platform for numerous other cryptocurrencies, as well as for the execution of decentralized smart contracts.';
      const ethKor =
        "이더리움(Ethereum)은 자체 암호화 화폐인 '이더(Ether)'를 특징으로 하는 탈중앙화 오픈 소스 블록체인 시스템입니다. ETH는 수많은 다른 암호화의 플랫폼으로 작동하며 탈중앙화 스마트 계약도 해당 플랫폼에서 실행됩니다.";

      const klayEng =
        'Kakao’s global public blockchain project Klaytn is an enterprise-grade, service-centric platform that brings user-friendly blockchain experience to millions.';
      const klayKor =
        '클레이튼은 카카오의 글로벌 퍼블릭 블록체인 프로젝트로, 수많은 사람에게 사용자 친화적인 블록체인 경험을 제공하는 엔터프라이즈급 서비스 중심 플랫폼입니다.';

      const lang = $t('General.Language').toLowerCase();

      switch (lang) {
        case 'kor':
          switch (chainName) {
            case 'Klaytn':
              return klayKor;
            case 'Ethereum':
              return ethKor;
          }
        case 'eng':
          switch (chainName) {
            case 'Klaytn':
              return klayEng;
            case 'Ethereum':
              return ethEng;
          }
      }
    },
  },

  components: {},
};
</script>
