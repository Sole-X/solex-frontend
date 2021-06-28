<template>
  <section class="gen-modal dialog-modal share-content-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="share-content__options">
      <div
        v-for="channel in getSupportChannel"
        :key="channel.type"
        :class="channel.use ? '' : 'share-content__option__nouse'"
        class="share-content__option share-content__"
        @click="channel.onClick"
      >
        <img :src="$static.getFileURL(`img/icon/ic-sns-${channel.type}.svg`)" :alt="channel.type" />
        <p>{{ channel.name }}</p>
      </div>
    </article>

    <article class="share-content__url">
      <input type="text" disabled :value="data.url" />
      <button
        v-clipboard:copy="data.url || ''"
        class="text-lightblack"
        v-clipboard:success="$_GlobalValueMixin_showCopyTooltip"
      >
        {{ $t('General.CopyUrl') }}
      </button>
    </article>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'ShareContentModal',
  props: {
    data: Object,
    close: Function,
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
    getSupportChannel() {
      const $route = this.$route;
      return [
        {
          type: 'facebook',
          name: 'Facebook',
          use: true,
          onClick: function () {
            const baseURL = 'http://www.facebook.com';
            const pathURL = 'sharer/sharer.php';
            const curURL = `${process.env.VUE_APP_API_ENDPOINT}${$route.fullPath}`;
            const queryURL = `u=${curURL}`;
            const targetURL = `${baseURL}/${pathURL}?${queryURL}`;

            window.open(targetURL, 'facebook');
          },
        },
        {
          type: 'twitter',
          name: 'Twitter',
          use: true,
          onClick: function () {
            const baseURL = 'http://twitter.com';
            const pathURL = 'share';
            const curURL = `${process.env.VUE_APP_API_ENDPOINT}${$route.fullPath}`;
            const queryURL = `url=${curURL}`;
            const targetURL = `${baseURL}/${pathURL}?${queryURL}`;

            window.open(targetURL, 'twitter');
          },
        },
        {
          type: 'telegram',
          name: 'Telegram',
          use: true,
          onClick: function () {
            const baseURL = 'https://telegram.me';
            const pathURL = 'share/url';
            const curURL = `${process.env.VUE_APP_API_ENDPOINT}${$route.fullPath}`;
            const queryURL = `url=${curURL}`;
            const targetURL = `${baseURL}/${pathURL}?${queryURL}`;

            window.open(targetURL, 'telegram');
          },
        },
        {
          type: 'kakaotalk',
          name: 'Kakaotalk',
          use: true,
          onClick: ({ content }) => {
            const curURL = `${process.env.VUE_APP_API_ENDPOINT}${$route.fullPath}`;
            this.$kakao.Link.sendDefault({
              objectType: 'feed',
              content: {
                title: this.getKakaotalkTitle,
                description: curURL,
                imageUrl: this.getKakaotalkImage,
                link: {
                  webUrl: curURL,
                  mobileWebUrl: curURL,
                },
              },
            });
          },
        },
      ];
    },

    getKakaotalkTitle() {
      const title = `[Sole-X] ${this.data.item.nftInfo ? this.data.item.nftInfo.name : ''} ${
        this.data.item.metadata ? this.data.item.metadata.name : ''
      }`;
      return title;
    },

    getKakaotalkImage() {
      const url = this.data.item.metadata
        ? this.data.item.metadata.image
        : this.$static.getFileURL('img/logo/default-logo-no-text.svg');
      return url;
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
