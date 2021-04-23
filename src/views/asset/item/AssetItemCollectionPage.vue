<template>
  <div>
    <section class="asset-item__collection">
      <article class="asset-item__collection__thumbnail">
        <img :src="info.metadata.image" :alt="`${info.tokenId} of ${info.tokenAddress}`" />
      </article>

      <article class="asset-item__collection__description">
        <h5>
          <strong>{{info.collectionName || '-'}}</strong>
        </h5>
        <p>
          {{  }}
        </p>
      </article>
    </section>
    <section class="asset-item__collection">
      <article class="asset-item__collection__description">
        <div class="asset-item__collection__description__links">
          <button :class="$bem('asset-item__collection__description__link', '', ['primary'])" v-clipboard:copy="'collection url'" v-clipboard:success="$_GlobalValueMixin_showCopyTooltip">
            <img :src="$static.getFileURL('img/icon/ic-copy-wh.svg')" alt="copy" />
          </button>

          <button class="asset-item__collection__description__link" v-for="option in getItemExternalLinks" :key="option.type" @click="handleClickExternalLink(option)">
            <img :src="option.image" :alt="option.type" />
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
  let $t, component

  export default {
    name: 'AssetItemCollectionPage',
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
      getItemExternalLinks() {
        const { getFileURL } = this.$static

        return [
          {
            type: 'website',
            image: getFileURL('img/icon/ic-website-wh.svg')
          },
          {
            type: 'discord',
            image: getFileURL('img/icon/ic-sns-discord-wh.svg')
          },
          {
            type: 'medium',
            image: getFileURL('img/icon/ic-medium.svg')
          },
          {
            type: 'twitter',
            image: getFileURL('img/icon/ic-sns-twitter-wh.svg')
          }
        ]
      }
    },

    watch: {},

    methods: {
      handleClickExternalLink(option) {
        if(!option.url) {
          return
        }

        window.open(option.url)
      }
    },

    components: {}
  }
</script>
