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
      }
    },

    watch: {},

    methods: {},

    components: {}
  }
</script>
