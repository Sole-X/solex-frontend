<template>
  <section class="market-home__popup" v-if="!popupClosed" @click="popupClick">
    <div class="market-home__popup-contents">
      <img :src="$static.getFileURL(`img/popup/popup_${$i18n.locale}_pc.jpg`)" alt="popup" class="is_pc" />
      <img :src="$static.getFileURL(`img/popup/popup_${$i18n.locale}_mo.jpg`)" alt="popup" class="is_mobile" />
    </div>
  </section>
</template>
<style>
.market-home__popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: rgba(0.3, 0.3, 0.3, 0.3);
}

.market-home__popup-contents {
  margin: calc(50vh - 400px) auto 0 auto;
  width: 600px;
  height: 800px;
}
.market-home__popup-contents .is_pc {
  display: block;
}
.market-home__popup-contents .is_mobile {
  width: 100%;
  max-width: 768px;
  display: none;
}

@media (max-width: 768px) {
  .market-home__popup-contents .is_pc {
    display: none;
  }
  .market-home__popup-contents .is_mobile {
    display: block;
  }

  .market-home__popup-contents {
    margin: 40px auto 40px auto;
    width: calc(100% - 40px);
    height: 1920px;
  }
}
</style>
<script>
let $t, self;

export default {
  name: 'MarketplacePopup',
  created() {
    self = this;
    $t = this.$t.bind(this);
    document.querySelector('body').style.overflow = 'hidden';
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      popupClosed: false,
    };
  },

  watch: {},

  methods: {
    popupClick(event) {
      this.popupClosed = true;
      document.querySelector('body').style.overflow = 'auto';
      console.log('banner clicked');
    },
  },

  components: {},
};
</script>
