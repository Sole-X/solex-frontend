<template>
  <section class="user-history__table_wrap">
    <div :class="$bem('user-history__table', '', ['asset'])">
      <div class="user-history__thead">
        <div
          class="text-gray"
          v-for="(col, i) in getAssetTableHeads"
          :key="i"
          :class="$bem('user-history__col', '', [col.type])"
        >
          {{ col.name }}
        </div>
      </div>

      <div class="user-history__tbody">
        <div class="user-history__row" v-for="row in list" :key="row.id">
          <div :class="$bem('user-history__col', '', ['date'])">
            {{ $date.formatDate(row.updatedAt, 'fff') }}
          </div>

          <div :class="$bem('user-history__col', '', ['event'])">
            {{ row.eventToString }}
          </div>

          <div :class="$bem('user-history__col', '', ['token'])">
            {{ row.currencyInfo.symbol }}
          </div>

          <div :class="$bem('user-history__col', '', ['amount'])">
            {{ $bn.toMaxUnit(row.amount, row.currencyInfo.decimal, 4) | addComma }}
          </div>

          <div :class="$bem('user-history__col', '', ['address'])">
            <a :href="$wallet.getAccountUrl(row.fromAddress)" target="_blank" rel="noopener noreferrer">
              {{ getMaskedAddress(row.fromAddressForAsset) }}
            </a>
          </div>

          <div :class="$bem('user-history__col', '', ['address'])">
            <a :href="$wallet.getAccountUrl(row.toAddress)" target="_blank" rel="noopener noreferrer">
              {{ getMaskedAddress(row.toAddressForAsset) }}
            </a>
          </div>

          <div :class="$bem('user-history__col', '', ['state', getClassNameOfEventState(row)])">
            <div v-if="row.eventState === 'fail'">
              {{ $t('General.Fail') }} <button class="text-lightblack" @click="handleShowDetails(row)">Details</button>
            </div>

            <div v-else-if="row.isProgress">
              {{ $t('General.InProgress') }}
            </div>

            <div v-else>
              {{ $t('General.Complete') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

let $t, component;

export default {
  name: 'UserHistoryTable',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
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
    ...mapGetters(['getMaskedAddress']),

    getAssetTableHeads() {
      return [
        {
          name: $t('General.Date'),
          type: 'date',
        },
        {
          name: $t('Market.Event'),
          type: 'event',
        },
        {
          name: `${$t('General.Coin')}/${$t('General.Token')}`,
          type: 'token',
        },
        {
          name: $t('General.Amount'),
          type: 'amount',
        },
        {
          name: 'From',
          type: 'address',
        },
        {
          name: 'To',
          type: 'address',
        },
        {
          name: $t('General.State'),
          type: 'state',
        },
      ];
    },
  },

  watch: {},

  methods: {
    handleShowDetails(row) {
      const params = {
        info: row,
      };

      this.showModal({
        component: 'AboutMyOfferModal',
        params,
      });
    },

    getClassNameOfEventState(row) {
      if (row.eventState === 'fail') {
        return 'fail';
      } else if (row.isProgress) {
        return 'progress';
      } else {
        return 'success';
      }
    },
  },

  components: {},
};
</script>
