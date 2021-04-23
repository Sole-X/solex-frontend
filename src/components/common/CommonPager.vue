<template>
  <div class="common-pager">
    <div class="common-pager">
      <button
        class="common-pager__button__first"
        v-if="pageInfo.page !== 1"
        @click="handleMovePage('first')"
      />
      <button
        class="common-pager__button__prev"
        @click="handleMovePage('prev')"
      />

      <div>
        <button
          v-for="page in pageList"
          :key="page"
          :class="$bem('common-pager__button', '', page === pageInfo.page ? ['current'] : '')"
          @click="handleMovePage('select', page)"
        >
          {{page}}
        </button>
      </div>

      <button
        class="common-pager__button__next"
        @click="handleMovePage('next')"
      />
      <button
        class="common-pager__button__last"
        v-if="pageInfo.page !== pageInfo.maxPage"
        @click="handleMovePage('last')"
      />
    </div>
  </div>
</template>

<script>
  let $t, component

  export default {
    name: 'CommonPager',
    props: {
      pageList: Array,
      pageInfo: Object
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

    computed: {},

    watch: {},

    methods: {
      handleMovePage(type, value) {
        const { page, maxPage } = this.pageInfo

        if(type === 'select') {
          return this.$emit('onMovePage', value)
        }

        if(type === 'first') {
          return this.$emit('onMovePage', 1)
        }

        if(type === 'last') {
          return this.$emit('onMovePage', maxPage)
        }

        if(type === 'prev' && page > 1) {
          return this.$emit('onMovePage', page - 1)
        }

        if(type === 'next' && page < maxPage) {
          return this.$emit('onMovePage', page + 1)
        }
      }
    },

    components: {}
  }
</script>
