<template>
  <section class="customer-faq-tab">
    <div class="customer-faq-tab__header">
      <div v-html="$t('Customer.FAQTotalCount', { count: itemCount })" />
    </div>
    <div class="customer-faq-tab__items">
      <div class="customer-faq-tab__item" v-for="(row, i) in items[$t('Customer.Language').toLowerCase()]">
        <div class="customer-faq-tab__item-title-container" :data-idx="i" @click="itemClicked">
          <span class="customer-faq-tab__item-title" :data-idx="i">{{ row.title }}</span>
          <img v-if="!itemShows[i]" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')" :data-idx="i" />
          <img v-if="itemShows[i]" :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')" :data-idx="i" />
        </div>
        <div class="customer-faq-tab__item-description" :style="{ height: itemShows[i] ? `${itemHeights[i]}px` : '0' }">
          <hr />
          <div class="customer-faq-tab__item-description-container" :ref="`item-description-${i}`">
            <p v-for="col in row.description" v-html="col"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
let $t, self;
import datas from '@/constants/data/faq.js';

export default {
  name: 'CustomerFaqMostPopularPage',

  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  beforeMount() {},

  mounted() {
    this.itemCount = this.items.eng.length;
    for (let i = 0; i < this.itemCount; i++) {
      this.itemShows.push(false);
      const offsetHeight = this.$refs[`item-description-${i}`][0].offsetHeight;
      this.itemHeights.push(offsetHeight);
    }
  },

  updated() {},

  beforeDestroy() {},

  data() {
    return {
      itemCount: 0,
      itemLanguage: '',
      itemShows: new Array(),
      itemHeights: new Array(),
      items: datas['popular'],
    };
  },

  computed: {},

  watch: {},

  methods: {
    itemClicked(event) {
      const idx = Number(event.target.dataset.idx);
      if (!isNaN(idx)) this.itemShows.splice(idx, 1, !this.itemShows[idx]);
    },
  },

  components: {},
};
</script>
