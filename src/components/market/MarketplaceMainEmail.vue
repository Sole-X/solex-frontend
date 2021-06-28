<template>
  <div>
    <section class="market-home-email-container">
      <div class="market-home-email">
        <section class="market-home-email-title">
          <article class="market-home-email-title-main">
            {{ $t('Market.MarketHomeEmailTitleMain') }}
          </article>
          <article class="market-home-email-title-sub">
            {{ $t('Market.MarketHomeEmailTitleSub') }}
          </article>
        </section>
        <section class="market-home-email-input">
          <div v-if="didSubmit === 'idle'" class="market-home-email-input-container idle">
            <input type="email" v-model="email" placeholder="Email address" @keyup.enter="submitButtonClicked" />
            <button :class="'btn' + (isAvailableEmail(email) ? '' : '-disabled')" @click="submitButtonClicked">
              SUBMIT
            </button>
          </div>
          <div v-else-if="didSubmit === 'pending'" class="pending">
            <common-loader />
          </div>
          <div v-else class="complete">
            {{ $t('Market.MarketHomeEmailThanks') }}
          </div>
        </section>
      </div>
    </section>
    <div class="market-home-email-container-area" />
  </div>
</template>

<script>
let $t, self;

export default {
  name: 'MarketplaceMainEmail',

  mixins: [],

  props: [],

  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      email: '',
      didSubmit: 'idle',
    };
  },

  computed: {},

  watch: {},

  methods: {
    async submitButtonClicked() {
      if (!this.isAvailableEmail(this.email)) {
        return;
      }
      this.didSubmit = 'pending';
      try {
        const result = await this.$http.post('setNewLetterEmail', {
          body: {
            email: this.email,
          },
        });

        if (result.success) {
          // TODO: 성공했을 때의 동작.
          this.didSubmit = 'complete';
        }
      } catch (e) {
        this.didSubmit = 'idle';
        console.error(e);
      } finally {
        this.email = '';
      }
    },

    isAvailableEmail(str) {
      const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

      if (!reg_email.test(str)) {
        return false;
      } else {
        return true;
      }
    },
  },

  components: {},
};
</script>
