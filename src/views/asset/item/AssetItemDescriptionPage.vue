<template>
  <section class="asset-item__description">
    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{$t('Market.OwnerTitle')}}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value text-secondary">
        {{ getOwnerAddress }}
      </span>
    </div>

    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{$t('Market.PublisherTitle')}}
      </span>
      <span class="divider"></span>
      <span :class="'asset-item__hypen-row__value text-secondary' + (havePublisher ? ' item-publisher' : '')" @click="publisherClicked">
        {{ getPublisherAddress }}
      </span>
    </div>

    <article class="asset-item__description__article">
      {{ info.metadata ? info.metadata.description : '' }}
    </article>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'AssetItemDescriptionPage',
    props: {
      info: Object,
      history: Object
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {}
    },

    computed: {
      getOwnerAddress() {
        const { info } = this;

        if (info && info.ownerAddress) return info.ownerAddress;
        if (info && info.isItemOnMyWallet) return $t('Market.OwnerIsMe');

        return '';
      },

      havePublisher() {
        // TODO: 아래 주석 제거.
        // if (작가 있으면) {
        //   return true;
        // }
        // else if (작가 없으면) {
        //   return false;
        // }


        // TODO: 위 주석 제거 시, 아래 문장 삭제.
        return true;
        //
      },

      getPublisherAddress() {
        // TODO : 작가 이름을 이 곳에 넣을 것.
        if (this.havePublisher) {
          // TODO : 실제 데이터 입력 시, 작가 이름을 동적 변경.
          // 홍길동과 미상은 더미 데이터.
          return '홍길동';
        }
        else {
          return '미상';
        }
      }
    },

    watch: {},

    methods: {
      publisherClicked(event) {
        if (!this.havePublisher) {
          return;
        }

        // TODO: targetURL에 작가 정보 페이지 링크를 넣을 것.
        const targetURL = "https://enftee.com/";
        window.open(targetURL, `publisher ${targetURL}`);
      }
    },

    components: {}
  }
</script>
