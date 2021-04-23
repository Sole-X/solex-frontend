<template>
  <section class="customer-faq-tab">
    <div class="customer-faq-tab__header">
      <div v-html="$t('Customer.FAQTotalCount', {count: itemCount})" />
    </div>

    <div v-if="isData" class="customer-faq-tab__items">
      <div
          class="customer-faq-tab__item"
          v-for="(row, i) in items[$t('Customer.Language').toLowerCase()]"
      >
        <div class="customer-faq-tab__item-title-container" :data-idx="i" @click="itemClicked">
          <span class="customer-faq-tab__item-title" :data-idx="i">{{ row.title }}</span>
          <img v-if="!itemShows[i]" :src="$static.getFileURL('img/icon/ic-chevron-bottom-faq.svg')" :data-idx="i">
          <img v-if="itemShows[i]" :src="$static.getFileURL('img/icon/ic-chevron-top-faq.svg')" :data-idx="i">
        </div>
        <div
            class="customer-faq-tab__item-description"
            v-show="itemShows[i]"
        >
          <hr>
          <div class="customer-faq-tab__item-description-container">
            <p v-for="col in row.description" v-html="col"></p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="customer-faq-tab__no-item">
      <hr>
      <img class="no-item-image" :src="$static.getFileURL('img/icon/ic-no-data.svg')" width="74px">
      <div>
        <p class="customer-faq-tab__no-item__title">{{ $t('General.NoDataTitle') }}</p>
        <p class="customer-faq-tab__no-item__description">{{ $t('General.NoDataDesc') }}</p>
      </div>
      <button @click="backButtonClicked">
        <img :src="$static.getFileURL('img/icon/ic-chevron-left-gray.svg')">
        <span>{{ $t('General.NoDataBack') }}</span>
      </button>
    </div>
  </section>
</template>

<script>
let $t, self
import datas from '@/constants/data/faq.js';

export default {
  name: 'CustomerFaqAccountPage',

  props: ['search'],

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {
    this.setDatas();
  },

  updated() {

  },

  beforeDestroy() {

  },

  data() {
    return {
      itemCount: 0,
      itemLanguage: '',
      itemShows: new Array(),
      itemHeights: new Array(),
      items: {
        eng: [],
        kor: []
      }
    }
  },

  computed: {
    isData() {
      if (this.itemCount > 0) {
        return true;
      }
      return false;
    }
  },

  watch: {
    search: function (newVal, oldVal) {
      this.setDatas();
    }
  },

  methods: {
    itemClicked (event) {
      const idx = Number(event.target.dataset.idx);
      if (!isNaN(idx))  this.itemShows.splice(idx, 1, !this.itemShows[idx]);
    },

    setDatas() {
      this.items.eng = [];
      this.items.kor = [];
      for (const key in datas) {
        if (key === 'popular') continue;
        const data = datas[key];
        const engDatas = data['eng'];
        for (const engData of engDatas) {
          if (engData.title.toLowerCase().includes(this.search.toLowerCase())) {
            this.items.eng.push(engData);
          }
        }
        const korDatas = data['kor'];
        for (const korData of korDatas) {
          if (korData.title.toLowerCase().includes(this.search.toLowerCase())) {
            this.items.kor.push(korData);
          }
        }
      }

      this.itemCount = this.items[$t('Customer.Language').toLowerCase()].length;
      for (let i=0; i < this.itemCount; i++) {
        this.itemShows.push(false);
        const offsetHeight = this.$refs[`item-description-${i}`] ? this.$refs[`item-description-${i}`][0].offsetHeight : 0;
        this.itemHeights.push(offsetHeight);
      }
    },

    backButtonClicked(event) {
      this.$router.go(-1);
    }
  },

  components: {

  }
}
</script>