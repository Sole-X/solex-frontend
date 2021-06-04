<template>
  <div class="staking-activity-page">
    <div class="staking-activity__amount">
      <div class="staking-activity__amount-container">
        <div class="staking-activity__amount-item">
          <div class="left">
            <div class="left-top">
              {{ $t("Staking.CurrentlyStaked") }}
            </div>
            <div class="left-bottom">
              <template v-if="getIsSetAmount">
                <span>{{ this.$bn.toMaxUnit(getStakingAmount, 18, 4) }}</span>
                <span>{{ this.getCurrency(getTokenAddress).symbol }}</span>
              </template>
              <template v-else>
                <common-loader />
              </template>
            </div>
          </div>
          <div class="right">
            <!--<img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt='trix' />-->
          </div>
        </div>

        <div class="staking-activity__amount-item">
          <div class="left">
            <div class="left-top">
              {{ $t("Staking.UnstakingInProgress") }}
            </div>
            <div class="left-bottom">
              <template v-if="getIsSetAmount">
                <span>{{ this.$bn.toMaxUnit(getUnstakingAmount, 18, 4) }}</span>
                <span>{{ this.getCurrency(getTokenAddress).symbol }}</span>
              </template>
              <template v-else>
                <common-loader />
              </template>
            </div>
          </div>
          <div class="right">
            <!--<img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt='trix' />-->
          </div>
        </div>

        <div class="staking-activity__amount-item">
          <div class="left">
            <div class="left-top">
              {{ $t("Staking.EarnedRewardsByStaking") }}
            </div>
            <div class="left-bottom">
              <template v-if="getIsSetAmount">
                <span>{{ this.$bn.toMaxUnit(getRewardAmount, 18, 4) }}</span>
                <span>USD</span>
              </template>
              <template v-else>
                <common-loader />
              </template>
            </div>
          </div>
          <div class="right">
            <!-- <img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt='trix' />-->
          </div>
        </div>

        <div class="staking-activity__amount-item">
          <div class="left">
            <div class="left-top">
              {{ $t("Staking.EarnedRewardsByStakingLastWeek") }}
            </div>
            <div class="left-bottom">
              <template v-if="getIsSetAmount">
                <span>{{ $bn.toMaxUnit(getRewardAmountWeek, 18, 4) }}</span>
                <span>USD</span>
              </template>
              <template v-else>
                <common-loader />
              </template>
            </div>
          </div>
          <div class="right">
            <!-- <img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt='trix' />-->
          </div>
        </div>

      </div>
    </div>

    <div v-if="isItem">
      <section class="staking-activity__table">
        <div class="staking-activity__table__head">
          <div
              :class="$bem('staking-activity__table__col', '', [col.type])"
              v-for="(col, i) in getTableCols"
              :key="i"
          >
            <span class="text-gray">{{ translated(col.title) }}</span>
          </div>
        </div>

        <div v-if="getIsSetPager" class="staking-activity__table__body">
          <div
              v-for="(row, i) in getStakingItems"
              :key="i"
              class="staking-activity__table__row"
          >
            <div :class="$bem('staking-activity__table__col', '', ['idx'])">
              {{ getStartIdx() - i }}
            </div>

            <div :class="$bem('staking-activity__table__col', '', ['date'])">
              {{ convertDate(row.due || row.createdAt) }}
            </div>

            <div :class="$bem('staking-activity__table__col', '', ['coin_token'])">
              {{ convertCurrency(row.currency) }}
            </div>

            <div :class="$bem('staking-activity__table__col', '', ['amount'])">
              {{ convertAmount(row.amount) }}
            </div>

            <div :class="$bem('staking-activity__table__col', '', ['type'])">
              {{ convertTypeStr(row.type) }}
            </div>

            <div :class="$bem('staking-activity__table__col', '', ['state'])">
              <button
                  @click="(event) => row.type === 2 && Date(row.due) <= Date() ? claimButtonClicked(event, getCurrency(getTokenAddress)) : ''"
                  :data-index="row.index"
                  :data-amount="row.amount"
                  :class="convertState(row.type, row.due).className"
              >
                {{ convertState(row.type, row.due).state }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="staking-activity__table__body common-loader">
          <common-loader />
        </div>
      </section>

      <section class="staking-activity__footer">
        <staking-pager
            :cur-page="getCurPage"
            :total-page="getTotalPage"
            :prev="prevClicked"
            :next="nextClicked"
            :first="firstClicked"
            :last="lastClicked"
            :set-cur-page="setCurPage"
            :propOffset="offset"
            v-on:update:offset="setData"
        >
        </staking-pager>
      </section>
    </div>
    <div v-else>
      <staking-my-activity-no-data />
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import StakingMyActivityNoData from "@/views/staking/detail/activity/StakingMyActivityNoData";
  import StakingPager from '@/components/staking/StakingPager';

  let $t, component, intervalFunc;

  function getTableColState(date) {
    function dateDiff(date1, date2) {
      let diffDate1 = date1 instanceof Date ? date1 : new Date(date1);
      let diffDate2 = date2 instanceof Date ? date2 : new Date(date2);

      diffDate1 = new Date(diffDate1.getFullYear(), diffDate1.getMonth()+1, diffDate1.getDate());
      diffDate2 = new Date(diffDate2.getFullYear(), diffDate2.getMonth()+1, diffDate2.getDate());

      let diff = Math.abs(diffDate1.getTime() - diffDate2.getTime());
      diff = Math.ceil(diff / (1000 * 3600 * 24));

      return diff;
    }

    const diffDate = dateDiff(new Date(), date);

    const newDiff = 7 - diffDate;

    if (newDiff <= 0) {
      return false;
    }
    return String(Math.abs(7 - diffDate));
  }

  export default {
    name: 'StakingMyActivityPage',
    created() {
      component = this
      $t = this.$t.bind(this)
      this.setStakingItems();
      this.setCurPage(1);
    },

    mounted() {

    },

    beforeDestroy() {
      this.setCurPage(1);
    },

    data() {
      return {
        items: [],
        isItem: false,
        offset: 1
      }
    },

    computed: {
      ...mapGetters([
          'getSupportCurrency',
          'getStakingAmount',
          'getUnstakingAmount',
          'getRewardAmount',
          'getRewardAmountWeek',
          'getCurPage',
          'getTotalPage',
          'getNumOfActivities',
          'getStakingItems',
          'getIsSetAmount',
          'getIsSetPager'
      ]),

      getTableCols() {
        return [
          {
            title: 'idx',
            type: 'idx'
          },
          {
            title: 'date',
            type: 'date'
          },
          {
            title: 'coin_token',
            type: 'coin_token'
          },
          {
            title: 'amount',
            type: 'amount'
          },
          {
            title: 'type',
            type: 'type'
          },
          {
            title: 'state',
            type: 'state'
          }
        ]
      },

      getTableRows() {
        const newItems = _.cloneDeep(this.items);

        newItems.sort((a, b) => {
          const aDate = new Date(String(a.date));
          const bDate = new Date(String(b.date));

          if (aDate > bDate) {
            return 1;
          } else if (aDate === bDate) {
            return 0;
          } else {
            return -1;
          }
        })

        return newItems;
      },

      getTokenName() {
        return process.env.VUE_APP_TOKEN_NAME;
      },

      getTokenAddress() {
        return process.env.VUE_APP_TOKEN_ADDRESS;
      },

      getTokenSymbol() {
        return process.env.VUE_APP_TOKEN_SYMBOL;
      },
    },

    watch: {
      items: function () {
        if (this.items.length === 0) {
          this.isItem = false;
        } else {
          this.isItem = true;
        }
      },

      getStakingItems: function () {
        this.setIsSetPager(true);
        if (this.getStakingItems && this.getStakingItems.length === 0) {
          this.isItem = false;
        } else {
          this.isItem = true;
        }
      },
    },

    methods: {
      ...mapActions([
          'claimUnstakingToken',
          'setCurPage',
          'setTotalPage',
          'setStakingItems',
          'setIsSetPager'
      ]),

      getTranslateValue(val) {
        if (val in $t('Staking')){
          return $t('Staking')[val];
        }
        return val;
      },

      getKeyOfTranslate(val) {
        switch (val) {
          case "idx":
            return "TableIdx"
          case "date":
            return "TableDate"
          case "coin_token":
            return "TableCoinToken"
          case "amount":
            return "TableAmount"
          case "type":
            return "TableType"
          case "state":
            return "TableState"
          default:
            return val;
        }
      },

      translated(val) {
        return this.getTranslateValue(this.getKeyOfTranslate(val));
      },

      handleClaimUnstakingToken(row) {

      },

      claimButtonClicked(event, item) {
        const targetAddress = item.addressToReserve;
        const uid = Number(event.target.dataset.index);
        const amount = event.target.dataset.amount;

        this.claimUnstakingToken({
          token: item,
          currency: targetAddress,
          amount: amount,
          uid: uid
        });
      },

      setItem() {
        this.items = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const curRowKey = sessionStorage.key(i);
          if (!curRowKey.includes('staking')) {
            continue;
          }
          let curRowVal = JSON.parse(sessionStorage.getItem(curRowKey));

          curRowVal.state = getTableColState(curRowVal.date);
          this.items.push(curRowVal);
        }
      },

      getCurrency(tokenAddress) {
        return _.find(this.getSupportCurrency, currency => {
          if (this.$wallet.isSameAddress(currency.tokenAddress, tokenAddress)) return true;
          return false;
        }) || {
          symbol: 'TRIX'
        }
      },

      convertDate(date) {
        const d = this.$date.getFromISO(date);
        const monthStrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let retDate = `${monthStrs[d.month - 1]} ${d.day}, ${d.year}  ${d.hour > 9 ? d.hour : '0'+d.hour}:${d.minute > 9 ? d.minute : '0'+d.minute} GMT`;
        return retDate;
      },

      convertTypeStr(type) {
        if (type > 0 && type <= 4){
          return $t('Staking.TableTypes')[type - 1];
        }
        return type;
      },

      convertAmount(amount) {
        return this.$bn.toMaxUnit(amount, 18, 4);
      },

      convertCurrency(currency) {
        const tokens = this.getSupportCurrency;
        const tokenInfo = _.find(tokens, token => this.$wallet.isSameAddress(token.addressToReserve, currency));

        if (tokenInfo) {
          return tokenInfo.symbol;
        }

        return currency;
      },

      convertState(type, due) {
        if (type === 1) {
          return {
            state: $t('Staking.TableStates')[0],
            className: 'table-state-complete'
          };
        } else if (type === 2) {
          if (!due) {
            return {
              state: $t('Staking.TableStates')[0],
              className: 'table-state-complete'
            }
          }

          const dueDate = new Date(due);
          const nowDate = new Date();
          const diffDate = (dueDate - nowDate) / (1000 * 60 * 60 * 24);

          if (diffDate <= 0) {
            // 청구 가능
            return {
              state: $t('Staking.TableStates')[1],
              className: 'table-state-claimable'
            }
          } else {
            const restDate = Math.ceil(diffDate * 10) / 10;
            return {
              state: restDate + $t('Staking.TableStates')[2],
              className: 'table-state-left'
            }
          }
        } else if (type === 3) {
          return {
            state: $t('Staking.TableStates')[0],
            className: 'table-state-complete'
          }
        } else if (type === 4) {
          return {
            state: $t('Staking.TableStates')[0],
            className: 'table-state-complete'
          }
        }
      },

      nextClicked() {
        if ((this.offset + 10) <= this.getTotalPage) {
          this.offset += 10;
          this.setIsSetPager(false);
          this.setCurPage(this.offset);
        }
      },

      prevClicked() {
        if ((this.offset - 10) > 0) {
          this.offset -= 10;
          this.setIsSetPager(false);
          this.setCurPage(this.offset);
        }
      },

      firstClicked() {
        if (this.offset === 1) {
          return;
        }

        this.offset = 1;
        this.setIsSetPager(false);
        this.setCurPage(this.offset);
      },

      lastClicked() {
        if (this.getTotalPage === this.offset) {
          return;
        }

        while (this.offset + 10 <= this.getTotalPage) {
          this.offset += 10;
        }
        this.setIsSetPager(false);
        this.setCurPage(this.getTotalPage);
      },

      getStartIdx() {
        const firstPageStartIdx = this.getNumOfActivities;
        const curPageStartIdx = firstPageStartIdx - (this.getCurPage - 1) * 10;
        return curPageStartIdx;
      },

      setData(key, value) {
        this[key] = value;
      }
    },

    components: {
      StakingMyActivityNoData,
      StakingPager
    }
  }
</script>
