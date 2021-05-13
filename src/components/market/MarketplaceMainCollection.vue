<template>
  <section class="market-home__collection" v-if="getNumOfCollections > 0">
    <header class="market-home__collection__header">
      <h2>{{title}}</h2>
      <button v-if="category !== 'recentlyView'" @click="handleShowAll()">
        {{$t('Market.ShowAll')}}
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
          <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
            <g stroke="#CCC" stroke-width="1.5">
              <path d="M682.635 2039L682.757 2045 676.757 2044.878" transform="translate(-678 -2037) scale(1 -1) rotate(-45 -4250.067 0)"/>
            </g>
          </g>
        </svg>
      </button>
    </header>

    <div v-if="loading">
      <common-loader />
    </div>

    <div v-else-if="collections.length > 0" class="market-home__collection__list">
      <swiper :options="swiperOptions">
        <swiper-slide v-for="(collection, i) in collections" :key="i">
          <!--<asset-item-card :info="item" :chain="chain" />-->
          <asset-item-card-home :item="collection" :category="category"/>
        </swiper-slide>
      </swiper>

      <button :id="`swiper-button-prev-${category}`" class="swiper-button-prev" />
      <button :id="`swiper-button-next-${category}`" class="swiper-button-next" />
    </div>

    <div v-else class="market-home__collection__list">

    </div>
  </section>
</template>

<script>
  import { mapActions } from 'vuex'
  import AssetItemCard from '@/components/asset/item/AssetItemCard'
  import AssetItemCardMarketPlace from "@/components/asset/item/AssetItemCardMarketPlace";
  import AssetItemCardHome from '@/components/asset/item/AssetItemCardHome';

  let $t, component

  export default {
    name: 'MarketplaceMainCollection',
    props: {
      category: String,
      title: String,
      loading: Boolean,
      collections: {
        type: Array,
        default() {
          return []
        }
      },
      chain: String
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
      return {
        swiperOptions: {
          spaceBetween: 24,
          slidesPerView: 'auto',
          allowTouchMove: false,
          navigation: {
            nextEl: `#swiper-button-next-${this.category}`,
            prevEl: `#swiper-button-prev-${this.category}`,
          }
        }
      }
    },

    computed: {
      getNumOfCollections() {
        let cnt = 0;
        if (this.collections && this.collections.length) {
          cnt = this.collections.length;
        }
        return cnt;
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'setSearchFilter'
      ]),

      handleShowAll() {
        const newState = {}
        const { category } = this

        switch(category) {
          case 'recently': {
            this.$router.push({
              path: '/sell'
            })
            break
          }
          case 'popular': {
            this.$router.push({
              path: '/sell',
              query: {
                order: 'POP'
              }
            });
            break
          }
          case 'ethereum': {
            newState.ETHEREUM = true;
            this.$router.push({
              path: '/sell',
              query: {
                blockchain: 'ETHEREUM'
              }
            })
            break
          }
          case 'klaytn': {
            newState.KLAYTN = true
            this.$router.push({
              path: '/sell',
              query: {
                blockchain: 'KLAYTN'
              }
            })
            break
          }
          case 'collectibles': {
            newState.COLLECTIBLES = true
            this.$router.push({
              path: '/sell',
              query: {
                categories: 'COLLECTIBLES'
              }
            })
            break
          }
          case 'recentlyView': {
            break
          }
          default: {
            break
          }
        }

        /*
        this.setSearchFilter({
          type: 'category',
          newValue: newState
        }).then(() => {
          this.$router.push({
            path: '/assets?type=sell'
          })
        })
        */

      }
    },

    components: {
      AssetItemCard,
      AssetItemCardMarketPlace,
      AssetItemCardHome
    }
  }
</script>
