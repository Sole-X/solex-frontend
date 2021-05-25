<template>
  <section class="user-item-page">
    <article class="user-detail__title">
      <h1>
        <strong>{{$t('UserPage.MyItems')}}</strong>
      </h1>
      <div class="user-detail__title-count">{{ getNumOfMyItems }}</div>
    </article>

    <article class="user-collapsible user-item__in-wallet">
      <ui-collapsible ref="inWallet">
        <user-collapsible-header slot="header" :title="$t('UserPage.ShowInWallet')" :total="getSearchedItems.wallet.length" />

        <section v-if="getSearchedItems.wallet.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')">
            <h5>{{$t('UserPage.EmptyItemsTitle')}}</h5>
            <p class="text-gray">{{$t('UserPage.EmptyItemsDescription')}}</p>
          </div>
        </section>

        <!-- TODO : 예치 진행 중 -->
        <section v-else class="user-collapsible__content">
          <div class="user-item__list">
            <div :class="$bem('asset-item-card', '', item.status === 'depositProgress' ? ['processing'] : '')" v-for="item in getSearchedItems.wallet" :key="item.id">
              <section class="asset-item-card__thumbnail" @click="handleClickItem(item)" :style="inwalletImages[item.tokenAddress + '_' + item.tokenId]">
                <div class="asset-item-card__thumbnail__head">
                  <label class="asset-item-card__chain">

                  </label>
                </div>
              </section>

              <section class="asset-item-card__detail">
                <div>
                  <h6 class="asset-item-card__detail__collection">
                    {{item.name}}
                  </h6>
                  <label class="asset-item-card__detail__name">
                    {{item.tokenId}}
                  </label>
                </div>
              </section>

              <section class="asset-item-card__modal">
                <div v-if="item.status === 'depositProgress'" :class="$bem('asset-item-card__modal__body', '', ['progress'])">
                  <div class="asset-item-card__modal__anim">

                  </div>

                  <div class="asset-item-card__modal__notice">
                    <h6>{{$t('UserPage.Processing')}}</h6>
                    <p class="text-gray" v-html="$t('UserPage.DepositWaitingMessage')" />
                  </div>
                </div>

                <div v-else :class="$bem('asset-item-card__modal__body', '', '')">
                  <div class="asset-item-card__modal__action">
                    <div>
                      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleDepositItem(item)">
                        {{$t('UserPage.DepositToReserve')}}
                      </button>

                      <button :class="$bem('common-submit-button', '', ['no-line'])" @click="goToItemDetailPage(item)">
                        {{$t('UserPage.ShowItem')}}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-item__in-wallet">
      <ui-collapsible ref="inSolex">
        <user-collapsible-header slot="header" :title="$t('UserPage.ShowInReserve')" :total="getSearchedItems.deposited.length" />

        <section v-if="getSearchedItems.deposited.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')">
            <h5>{{$t('UserPage.EmptyItemsTitle')}}</h5>
            <p class="text-gray">{{$t('UserPage.EmptyItemsDescription')}}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div class="user-item__list">
            <div :class="$bem('asset-item-card', '', item.status === 7 ? ['processing'] : '')" v-for="item in getSearchedItems.deposited" :key="item.id">
              <section class="asset-item-card__thumbnail" :style="$_AssetCardMixin_getImage(item)" @click="handleClickItem(item)">
                <div class="asset-item-card__thumbnail__head">
                  <label class="asset-item-card__chain">

                  </label>
                </div>
              </section>

              <section class="asset-item-card__detail">
                <div>
                  <h6 class="asset-item-card__detail__collection">
                    {{item.collectionName}}
                  </h6>
                  <label class="asset-item-card__detail__name">
                    {{item.itemName}}
                  </label>
                </div>
              </section>

              <section class="asset-item-card__modal">
                <div v-if="item.status === 7" :class="$bem('asset-item-card__modal__body', '', ['progress'])">
                  <div class="asset-item-card__modal__anim">

                  </div>

                  <div class="asset-item-card__modal__notice">
                    <h6>{{$t('UserPage.Processing')}}</h6>
                    <p class="text-gray" v-html="$t('UserPage.WithdrawWaitingMessage')" />
                  </div>
                </div>

                <div v-else :class="$bem('asset-item-card__modal__body', '', '')">
                  <div class="asset-item-card__modal__action">
                    <div>
                      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleSellItem(item)">
                        {{$t('Market.MakeSell')}}
                      </button>

                      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleAuctionItem(item)">
                        {{$t('Market.MakeAuction')}}
                      </button>

                      <template v-if="isAvailWithdraw(item)">
                        <button :class="$bem('common-submit-button', '', ['no-line'])" @click="handleWithdrawItem(item)">
                          {{$t('UserPage.WithdrawToMyWallet')}}
                        </button>
                      </template>
                      <template v-else>
                        <button :class="$bem('common-submit-button', '', ['no-line'])" @click="handleWithdrawItemToOther(item)">
                          {{ $t('UserPage.TransferToOtherWallet') }}
                        </button>
                      </template>

                      <button :class="$bem('common-submit-button', '', ['no-line'])" @click="goToItemDetailPage(item)">
                        {{$t('UserPage.ShowItem')}}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-item__in-order">
      <ui-collapsible ref="onSale">
        <user-collapsible-header slot="header" :title="$t('UserPage.ShowOnOffer')" :total="getSearchedItems.onTrade.length" />

        <section v-if="getSearchedItems.onTrade.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')">
            <h5>{{$t('UserPage.EmptyItemsTitle')}}</h5>
            <p class="text-gray">{{$t('UserPage.EmptyItemsDescription')}}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div class="user-item__list">
            <div :class="$bem('asset-item-card', '', item.type === 1 ? ['processing'] : '')" v-for="item in getSearchedItems.onTrade" :key="item.id">
              <section class="asset-item-card__thumbnail" :style="$_AssetCardMixin_getImage(item)" @click="handleClickItem(item)">
                <div class="asset-item-card__thumbnail__head">
                  <label class="asset-item-card__chain">

                  </label>
                </div>
              </section>

              <section class="asset-item-card__detail">
                <div>
                  <h6 class="asset-item-card__detail__collection">
                    {{item.collectionName}}
                  </h6>
                  <label class="asset-item-card__detail__name">
                    {{item.itemName}}
                  </label>
                </div>
              </section>

              <section class="asset-item-card__modal">
                <div :class="$bem('asset-item-card__modal__body', '', '')">
                  <div class="asset-item-card__modal__action">
                    <div>
                      <button :class="$bem('common-submit-button', '', ['no-line'])" @click="goToItemDetailPage(item, true)">
                        {{$t('UserPage.ShowItem')}}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import UserCollapsibleMixin from '@/mixins/user/UserCollapsibleMixin'
  import AssetCardMixin from '@/mixins/asset/AssetCardMixin'
  import UserSearchMixin from '@/mixins/user/UserSearchMixin'
  import UserDetailSearch from '@/components/user/detail/UserDetailSearch'
  import UserCollapsibleHeader from '@/components/user/detail/UserCollapsibleHeader'

  let $t, component
  let inwalletImageCnt = 0;

  export default {
    name: 'UserDetailMyItemPage',
    mixins: [UserSearchMixin, AssetCardMixin, UserCollapsibleMixin],
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.initPage()
      this.$nextTick(this.initCollapsibleStatus)
    },

    beforeDestroy() {
      this.clearUserItems()
    },

    data() {
      return {
        getImageFlag: false,
        inwalletImages: {

        }
      }
    },

    computed: {
      ...mapGetters([
        'getSupportCurrency',
        'getUserItems',
        'getUserBalance',
        'getUserItemFilters',
        'getUserInfo',
        'getChainInfo'
      ]),

      getSearchedItems() {
        const { getUserItemFilters, getUserItems, getUserBalance } = this
        const { searchedKeyword } = getUserItemFilters

        return {
          wallet: _.filter(getUserBalance.nft, item => {
            return this.$_UserSearchMixin_searchItem(item, searchedKeyword)
          }),
          deposited: _.filter(getUserItems.deposited, item => {
            return this.$_UserSearchMixin_searchItem(item, searchedKeyword)
          }),
          onTrade: _.filter(getUserItems.onTrade, item => {
            return this.$_UserSearchMixin_searchItem(item, searchedKeyword)
          })
        }
      },

      getNumOfMyItems() {
        const { wallet, deposited, onTrade } = this.getSearchedItems;

        return wallet.length + deposited.length + onTrade.length;
      }
    },

    watch: {
      'getSearchedItems.wallet'(newVal, oldVal) {
        if (inwalletImageCnt < 2) {
          this.setInwalletStyle(this.getSearchedItems.wallet);
          inwalletImageCnt += 1;
        }
      }
    },

    methods: {
      ...mapActions([
        'setUserItems',
        'clearUserItems',
        'setUserItemFilters',
        'depositNft',
        'withdrawNft',
        'showModal'
      ]),

      initPage() {
        this.setUserItems()
        this.setInwalletStyle(this.getSearchedItems.wallet);
      },

      initCollapsibleStatus() {
        const { $refs } = this

        this.$_UserCollapsibleMixin_initCollapsible([
          $refs.inWallet,
          $refs.inSolex,
          $refs.onSale
        ])
      },

      goToItemDetailPage(item, isTrade) {
        const query = {}

        if(isTrade) {
          query.type = 'sell'
          query.tradeId = item.tradeId
        }

        this.$router.push({
          path: `/asset/item/${item.tokenAddress}/${item.tokenId}`,
          query
        })
      },

      handleSellItem(item) {
        this.$router.push({
          path: '/asset/make-offer/normal',
          query: {
            tokenAddress: item.tokenAddress,
            tokenId: item.tokenId,
            type: 'sell'
          }
        })
      },

      handleAuctionItem(item) {
        this.$router.push({
          path: '/asset/make-offer/auction',
          query: {
            tokenAddress: item.tokenAddress,
            tokenId: item.tokenId
          }
        })
      },

      async handleDepositItem(item) {
        return await this.depositNft({
          tokenAddress: item.tokenAddress,
          tokenId: item.tokenId
        })
      },

      async handleWithdrawItem(item, toAddress) {
        if (!toAddress) {
          toAddress = this.getUserInfo.address;
        }
        return await this.withdrawNft({
          action: 'withdrawNft',
          token: item,
          toAddress: toAddress
        })
      },

      async handleWithdrawItemToOther(item) {
        if (!item) {
          return;
        }

        this.showModal({
          component: 'ReserveInputModal',
          params: {
            action: 'transferNft',
            token: item,
            onSubmit: (toAddress) => {
              return this.withdrawNft({
                action: 'transferNft',
                token: item,
                toAddress: toAddress
              })
            }
          }
        })
      },

      isAvailWithdraw(item) {
        let flag = true;
        if (this.getChainInfo.chain === 'ETHEREUM') {
          if (item.nftInfo && item.nftInfo.chainName === 'Klaytn') flag = false;
        }
        return flag;
      },

      handleInputItemKeyword(keyword) {
        this.setUserItemFilters({
          keyword
        })
      },

      handleSearchUserItems() {
        const prevState = _.cloneDeep(this.getUserItemFilters)
        const alreadySearched = _.find(prevState.searchedKeyword, keyword => {
          return prevState.keyword === keyword.value
        })

        if(alreadySearched || !prevState.keyword) {
          return
        }

        this.setUserItemFilters({
          keyword: '',
          searchedKeyword: [{ value: prevState.keyword }, ...prevState.searchedKeyword]
        })
      },

      handleRemoveKeyword(filter) {
        this.setUserItemFilters({
          searchedKeyword: _.filter(this.getUserItemFilters.searchedKeyword, keyword => {
            return filter.value !== keyword.value
          })
        })
      },

      handleClickItem(item) {
        this.$router.push({
          path: `/asset/item/${item.tokenAddress}/${item.tokenId}`
        })
      },

      async setInwalletStyle(items) {
        for (const item of items) {
          const result = await this.$_AssetCardMixin_getImage_inwallet(item);
          this.inwalletImages = {
            ...this.inwalletImages,
            [item.tokenAddress+'_'+item.tokenId]: result
          }
        }
      }
    },

    components: {
      UserDetailSearch,
      UserCollapsibleHeader
    }
  }
</script>
