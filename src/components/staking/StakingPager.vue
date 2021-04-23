<template>
  <div class="staking-pager">
    <svg class="staking-pager__first" @click="first" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
      <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#CCC" stroke-width="1.5">
          <g>
            <path d="M11.878 2L12 8 6 7.878" transform="translate(-399 -2037) translate(399 2037) scale(-1 1) rotate(-45 0 26.728)"/>
            <path d="M7.878 2L8 8 2 7.878" transform="translate(-399 -2037) translate(399 2037) scale(-1 1) rotate(-45 0 17.071)"/>
          </g>
        </g>
      </g>
    </svg>
    <svg class="staking-pager__prev" @click="prev" xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10">
      <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#CCC" stroke-width="1.5">
          <path d="M435.878 2039L436 2045 430 2044.878" transform="translate(-428 -2037) scale(-1 1) rotate(-45 0 3087.354)"/>
        </g>
      </g>
    </svg>
    <div class="staking-pager__pages">
      <span
          class="staking-pager__page"
          v-for="page in pages"
          @click="pageClicked"
          :data-idx="page"
      >
        {{ page }}
      </span>
    </div>
    <svg class="staking-pager__next" @click="next" xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
      <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#CCC" stroke-width="1.5">
          <path d="M682.635 2039L682.757 2045 676.757 2044.878" transform="translate(-678 -2037) scale(1 -1) rotate(-45 -4250.067 0)"/>
        </g>
      </g>
    </svg>
    <svg class="staking-pager__last" @click="last" xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10">
      <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#CCC" stroke-width="1.5">
          <g>
            <path d="M7.878 2L8 8 2 7.878" transform="translate(-703 -2037) translate(699.757 2037) scale(1 -1) rotate(-45 -7.071 0)"/>
            <path d="M11.878 2L12 8 6 7.878" transform="translate(-703 -2037) translate(699.757 2037) scale(1 -1) rotate(-45 -3.071 0)"/>
          </g>
        </g>
      </g>
    </svg>

  </div>
</template>

<script>
let $t, self
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'StakingPager',

  props: ['curPage', 'totalPage', 'prev', 'next', 'first', 'last', 'setCurPage', 'propOffset'],

  created() {
    self = this
    $t = this.$t.bind(this)
    this.pageSet();
  },

  mounted() {
    this.pageSelect(this.curPage);
  },

  updated() {

  },

  beforeDestroy() {

  },

  data() {
    return {
      pages: []
    }
  },

  computed: {
    offset: {
      get() {
        return this.propOffset;
      },

      set (newVal) {
        this.$emit('update:offset', 'offset', newVal);
      }
    }
  },

  watch: {
    curPage: function (newVal, oldVal) {
      this.pageSelect(newVal);
    },

    offset: function (newVal, oldVal) {
      this.pageSet();
      this.pageSelect(this.curPage);
    }
  },

  methods: {
    ...mapActions([
        'setIsSetPager'
    ]),

    pageClicked(event) {
      const idx = Number(event.target.dataset.idx) || null;
      if (idx && 0 < idx && idx <= this.totalPage) {
        this.setIsSetPager(false);
        this.setCurPage(idx);
      }
    },

    pageSelect(num) {
      const elems = document.getElementsByClassName('staking-pager__page');
      for (const elem of elems) {
        if (elem.className.includes('page-selected')) {
          elem.className = elem.className.replace(' page-selected', '');
        }
        if (Number(elem.dataset.idx) === num) {
          elem.className += ' page-selected';
        }
      }
    },

    pageSet() {
      this.pages = [];
      for (let i = this.offset; i < this.offset + 10; i++) {
        if (i > this.totalPage) break;
        this.pages.push(i);
      }
    }
  },

  components: {

  }
}
</script>
