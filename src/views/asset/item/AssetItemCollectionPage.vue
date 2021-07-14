<template>
  <div>
    <section class="asset-item__collection">
      <article class="asset-item__collection__thumbnail">
        <img :src="info.metadata.image" :alt="`${info.tokenId} of ${info.tokenAddress}`" />
      </article>

      <article class="asset-item__collection__description">
        <h5>
          <strong @click="collectionClicked">{{info.collectionName || '-'}}</strong>
        </h5>
        <p>
          {{  }}
        </p>
      </article>
    </section>
    <section class="asset-item__collection">
      <article class="asset-item__collection__description">
        <div class="asset-item__collection__description__links">
          <button class="asset-item__collection__description__link" v-for="option in getItemExternalLinks" :key="option.type" @click="handleClickExternalLink(option)">
            <img :src="option.image" :alt="option.type" @click="option.onclick" />
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
            type: 'link',
            image: getFileURL('img/icon/ic-copy-wh.svg'),
            onclick: () => {
              // TODO: Link to collection url
            }
          },
          {
            type: 'website',
            image: getFileURL('img/icon/ic-website-wh.svg'),
            onclick: () => {
              // TODO: Link to website
            }
          },
          {
            type: 'discord',
            image: getFileURL('img/icon/ic-sns-discord-wh.svg'),
            onclick: () => {
              // TODO: Link to triumphx's discord channel. (about this collection.)
            }
          },
          {
            type: 'medium',
            image: getFileURL('img/icon/ic-medium-collection.svg'),
            onclick: () => {
              // TODO: Link to tirumphx's Medium post. (about this collection.)
            }
          },
          {
            type: 'twitter',
            image: getFileURL('img/icon/ic-sns-twitter-wh.svg'),
            onclick: () => {
              // TODO: Link to triumphx's twitter message. (about this collection.)
            }
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
      },

      collectionClicked() {
        const collectionName = this.info.collectionName;
        const collectionTokenAddress = this.info.tokenAddress;

        if (collectionName && collectionTokenAddress) {
          this.$router.push({
            path: '/collection',
            query: {
              collection: collectionName,
              collectionAddress: collectionTokenAddress,
            }
          });
        }
      }
    },

    components: {}
  }
</script>
