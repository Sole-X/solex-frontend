<template>
  <div class="asset-item__floating" ref="floating" :style="getFloatingStyle">
    <div class="asset-item__floating__card">
      <asset-item-card :info="info" :options="{ showChain: false, showHeart: false }" />

      <div class="asset-item__floating__note" v-if="note && note.length > 0">
        <h6>{{$t('Market.Note')}}</h6>
        <ul>
          <li v-for="(row, index) in note" :key="index">
            <span v-html="row.text" />
          </li>
        </ul>
      </div>
    </div>

    <slot name="submit"></slot>
  </div>
</template>

<script>
  import AssetItemCard from '@/components/asset/item/AssetItemCard'

  let $t, component

  export default {
    name: 'AssetItemFloating',
    props: {
      note: Array,
      info: {
        type: Object,
        default() {
          return {}
        }
      }
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

    // TODO : 애니메이션, 푸터 밑으로 말려들어가는듯한 느낌(ref : 티몬)
    computed: {
      getFloatingStyle() {
        const { height, scrollTop } = this.getWindowInfo

        if(!this.$refs.floating) {
          return {}
        }

        const navHeight = 150
        const asideMarginTop = 80

        const realHeight = height - navHeight

        if(this.$route.name.startsWith('AssetItem')) {
          return this.getItemDetailFloatingStyle(realHeight, scrollTop)
        }

        return this.getFormPageFloatingStyle(realHeight - asideMarginTop, scrollTop)
      }
    },

    watch: {},

    methods: {
      getFormPageFloatingStyle(height, scrollTop) {
        const parentRect = this.$parent.$el.getBoundingClientRect()
        const floatingRect = this.$refs.floating.getBoundingClientRect()

        const maxScrollY = height - floatingRect.height
        const translateY = Math.min(maxScrollY, scrollTop - parentRect.top)

        return {
          transform: `translate3d(0, ${translateY}px, 0)`
        }
      },

      getItemDetailFloatingStyle(height, scrollTop) {
        const $parent = this.$parent.$el
        const $view = this.$route.matched[0].instances.default.$el

        const viewHeight = $view.getBoundingClientRect().height
        const floatingRect = this.$refs.floating.getBoundingClientRect()

        // 실제 컨텐츠(router-view) 높이 - 상세 영역(하위 router-view) offsetTop - floating 영역 height
        const maxScrollY = viewHeight - $parent.offsetTop - floatingRect.height
        const translateY = Math.max(0, Math.min(maxScrollY, scrollTop - $parent.offsetTop + 150))

        return {
          transform: `translate3d(0, ${translateY}px, 0)`
        }
      }
    },

    components: {
      AssetItemCard
    }
  }
</script>
