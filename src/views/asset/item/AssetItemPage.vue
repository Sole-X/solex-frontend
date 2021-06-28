<template>
  <div class="asset-item-page">
    <div class="asset-page__header">
      <section class="asset-page__category">
        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>Home</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{ getMenuTitle }}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{ getHeaderChainName }}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', ['current'])">
          <span>{{ getItemInfo.collectionName || '-' }}</span>
        </div>
      </section>

      <section class="asset-page__link">
        <div class="asset-page__link__share">
          <button @click="initPage(false)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="16"
              height="14"
              viewBox="0 0 16 14"
            >
              <defs>
                <path
                  id="h2vh2iq04a"
                  d="M3.956 2.282C6.057.184 9.292-.27 11.89 1.166c2.599 1.436 3.934 4.418 3.275 7.313-.659 2.896-3.153 5.006-6.117 5.177-2.965.17-5.684-1.64-6.671-4.44-.122-.348.06-.728.407-.85.347-.123.728.06.85.406.79 2.24 2.966 3.69 5.337 3.553 2.372-.137 4.367-1.825 4.894-4.141.527-2.317-.541-4.702-2.62-5.851-2.079-1.15-4.667-.786-6.363.907L3.017 4.993h2.316c.335 0 .612.248.66.57L6 5.66c0 .368-.298.666-.667.666H1.325c-.017 0-.035 0-.053-.003-.017-.001-.033-.003-.05-.006l-.048-.01-.043-.012c-.02-.007-.041-.014-.061-.023l-.028-.013c-.017-.008-.035-.017-.051-.027l-.046-.03c-.034-.025-.067-.054-.098-.086l.068.063-.05-.044-.018-.019-.008-.01c-.016-.017-.03-.035-.044-.053l-.018-.025c-.036-.055-.065-.116-.084-.18-.005-.019-.01-.037-.013-.055-.009-.043-.013-.087-.013-.133l.006.094C.67 5.728.667 5.7.667 5.672V1.661c0-.369.298-.667.666-.667.369 0 .667.298.667.667v2.457z"
                />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g>
                  <g transform="translate(-1156 -203) translate(1156 203)">
                    <use fill="#B2B2B2" fill-rule="nonzero" xlink:href="#h2vh2iq04a" />
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button v-clipboard:copy="currentUrl" v-clipboard:success="$_GlobalValueMixin_showCopyTooltip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="14"
              height="14"
              viewBox="0 0 14 14"
            >
              <defs>
                <path
                  id="c0r1rn751a"
                  d="M6.333 2.333c.369 0 .667.299.667.667 0 .368-.298.667-.667.667h-4c-.368 0-.666.298-.666.666v7.334c0 .368.298.666.666.666h7.334c.368 0 .666-.298.666-.666v-4c0-.369.299-.667.667-.667.368 0 .667.298.667.667v4c0 1.104-.896 2-2 2H2.333c-1.104 0-2-.896-2-2V4.333c0-1.104.896-2 2-2zm6.87-1.968l.013.004c.026.01.052.02.076.032.012.005.023.011.035.018l.046.029c.035.023.068.05.098.08l-.06-.053c.016.013.032.026.046.04l.014.014.018.018.03.035c.013.015.024.03.035.047l.023.037.024.045c.008.017.016.034.022.052l.014.04c.02.062.03.128.03.197v4c0 .368-.299.667-.667.667-.368 0-.667-.299-.667-.667V2.61L6.138 8.804c-.234.234-.6.257-.86.07l-.083-.07c-.26-.26-.26-.683 0-.943l6.195-6.196H9c-.335 0-.612-.246-.66-.567L8.334 1c0-.368.299-.667.667-.667h4c.048 0 .096.005.142.016.017.003.034.008.05.013l.01.003z"
                />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g>
                  <g transform="translate(-1185 -203) translate(1185 203)">
                    <use fill="#B2B2B2" fill-rule="nonzero" xlink:href="#c0r1rn751a" />
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button @click="handleReportArticle()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="14"
              height="14"
              viewBox="0 0 14 14"
            >
              <defs>
                <path
                  id="yl1hu36nga"
                  d="M2.333 4.992C2.333 2.419 4.423.333 7 .333s4.667 2.086 4.667 4.659v4.675h.666c.737 0 1.334.597 1.334 1.333v1.333c0 .737-.597 1.334-1.334 1.334H1.667c-.737 0-1.334-.597-1.334-1.334V11c0-.736.597-1.333 1.334-1.333h.666V4.992zm10 6.008H1.667v1.333h10.666V11zM7 3c.653 0 1.256.38 1.583.998C8.82 4.443 8.526 5 8.056 5H5.944c-.47 0-.763-.557-.527-1.002C5.744 3.38 6.347 3 7 3zm3.333 6.667V5.088c0-1.89-1.492-3.421-3.333-3.421-1.84 0-3.333 1.532-3.333 3.421v4.579h6.666z"
                />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g>
                  <g transform="translate(-1213 -203) translate(1213 203)">
                    <use fill="#B2B2B2" xlink:href="#yl1hu36nga" />
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button @click="handleShareArticle()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="14"
              height="16"
              viewBox="0 0 14 16"
            >
              <defs>
                <path
                  id="jf2sxnivla"
                  d="M11 .667c1.473 0 2.667 1.194 2.667 2.666C13.667 4.806 12.473 6 11 6c-.74 0-1.411-.302-1.894-.79L5.567 7.276c.065.23.1.473.1.724s-.035.494-.1.725l3.54 2.063C9.592 10.3 10.26 10 11 10c1.473 0 2.667 1.194 2.667 2.667 0 1.472-1.194 2.666-2.667 2.666-1.473 0-2.667-1.194-2.667-2.666 0-.253.035-.497.1-.728L4.895 9.877c-.483.488-1.153.79-1.894.79C1.527 10.667.333 9.473.333 8 .333 6.527 1.527 5.333 3 5.333c.74 0 1.411.302 1.894.79l3.539-2.065c-.065-.23-.1-.474-.1-.725C8.333 1.861 9.527.667 11 .667zm0 10.666c-.468 0-.88.241-1.117.606l-.027.057c-.011.019-.023.038-.036.055-.099.183-.153.393-.153.616 0 .736.597 1.333 1.333 1.333s1.333-.597 1.333-1.333c0-.737-.597-1.334-1.333-1.334zM3 6.667c-.736 0-1.333.597-1.333 1.333S2.264 9.333 3 9.333 4.333 8.736 4.333 8c0-.243-.065-.47-.178-.666l-.009-.012c-.23-.393-.658-.655-1.146-.655zM11 2c-.736 0-1.333.597-1.333 1.333 0 .737.597 1.334 1.333 1.334s1.333-.597 1.333-1.334C12.333 2.597 11.736 2 11 2z"
                />
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g>
                  <g transform="translate(-1241 -202) translate(1241 202)">
                    <use fill="#B2B2B2" fill-rule="nonzero" xlink:href="#jf2sxnivla" />
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
      </section>
    </div>

    <section class="asset-item__info">
      <article
        :class="'asset-item__thumbnail' + (hasVideo(getItemInfo) ? ' has-video' : '')"
        :style="$_AssetCardMixin_getImage(getItemInfo)"
        @click="playVideo(getItemInfo)"
      >
        <template v-if="loadingStatus"> </template>
        <template v-else>
          <div class="asset-item__thumbnail__icon">
            <img :src="getItemInfo.chainIcon" alt="platform" />
          </div>

          <div v-if="hasVideo(getItemInfo)" class="asset-item__thumbnail__video">
            <img :src="$static.getFileURL('img/icon/ic-play-video.svg')" alt="video" />
          </div>
          <button v-else class="asset-item__thumbnail__enlargement" @click="enlargementClicked">
            <img :src="$static.getFileURL('img/icon/ic-search-bk.svg')" alt="search" />
          </button>
        </template>
      </article>

      <article class="asset-item__profile__wrap">
        <div v-if="loadingStatus">
          <common-loader />
        </div>

        <div v-else>
          <asset-item-profile-exchange
            v-if="getItemInfo.isSell || getItemInfo.isBuy"
            :info="getItemInfo"
            :buttonProps="getButtonProps"
            @onClickLike="handleToggleItem"
            :walletConnected="$_GlobalValueMixin_showRouterView"
            :page="page"
            :like="getLike"
          />

          <asset-item-profile-auction
            v-else-if="getItemInfo.isAuction"
            :info="getItemInfo"
            :buttonProps="getButtonProps"
            @onClickLike="handleToggleItem"
            :walletConnected="$_GlobalValueMixin_showRouterView"
            :page="page"
            :like="getLike"
          />

          <!--v-else-if="!getItemInfo.isCollected || !getItemInfo.isOnTrade"-->
          <asset-item-profile-deposited
            v-else
            :info="getItemInfo"
            :buttonProps="getButtonProps"
            @onClickLike="handleToggleItem"
            :walletConnected="$_GlobalValueMixin_showRouterView"
            :page="page"
            :like="getLike"
          />
        </div>
      </article>
    </section>

    <section class="asset-item__related carousel-arrow">
      <h6>
        <strong>{{ $t('Market.RelatedItems') }}</strong>
      </h6>

      <div v-if="loadingStatus">
        <common-loader />
      </div>

      <div v-else>
        <swiper :options="swiperOptions">
          <swiper-slide v-for="item in getRelatedItems" :key="item.relatedId">
            <asset-item-card-market-place
              class="marketplace-sell-items-contents-image"
              :item="item"
              :type="getRelatedItemType"
              :page="'itemcard'"
            />
          </swiper-slide>
        </swiper>

        <button class="swiper-button-prev" />
        <button class="swiper-button-next" />
      </div>
    </section>

    <asset-item-detail :info="getItemInfo" :history="getItemHistory" :buttonProps="getButtonProps" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AssetCardMixin from '@/mixins/asset/AssetCardMixin';
import AssetItemCard from '@/components/asset/item/AssetItemCard';
import AssetItemCardMarketPlace from '@/components/asset/item/AssetItemCardMarketPlace';
import AssetItemDetail from '@/components/asset/item/detail/AssetItemDetail';
import AssetItemProfileDeposited from '@/components/asset/item/profile/AssetItemProfileDeposited';
import AssetItemProfileExchange from '@/components/asset/item/profile/AssetItemProfileExchange';
import AssetItemProfileAuction from '@/components/asset/item/profile/AssetItemProfileAuction';
import GlobalValueMixin from '@/mixins/common/GlobalValueMixin';
import MainConnectWallet from '@/components/MainConnectWallet';

let $t, component;

export default {
  name: 'AssetItemPage',
  mixins: [AssetCardMixin, GlobalValueMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initPage();

    setTimeout(() => Log('item', this.getItemInfo), 2000);

    this.$eventBus.$on('retrievedAsset', this.initPage);
    this.$eventBus.$on('refreshPage', this.initPage);
  },

  beforeDestroy() {
    this.$eventBus.$off('retrievedAsset', this.initPage);
    this.$eventBus.$off('refreshPage', this.initPage);
  },

  data() {
    return {
      swiperOptions: {
        spaceBetween: 20,
        slidesPerView: 'auto',
        allowTouchMove: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      currentUrl: window.location.href,
      loadingStatus: true,
      page: this.$route.query.type || null,
    };
  },

  computed: {
    ...mapGetters([
      'getChainInfo',
      'getItemInfo',
      'getWritingInfo',
      'getRelatedItems',
      'getItemHistory',
      'getUserBalance',
      'getUserItem',
      'getMyItems',
      'getMyLocalItems',
      'getSupportNft',
      'getSupportCurrency',
      'getLike',
    ]),

    getButtonProps() {
      const { getItemInfo } = this;

      // getItemInfo가 아무것도 없는 상태에서 다음으로 진입하는 현상.
      if (getItemInfo.isBuy) {
        return this.getBuyButtons(getItemInfo);
      } else if (getItemInfo.isSell) {
        return this.getSellButtons(getItemInfo);
      } else if (getItemInfo.isAuction) {
        return this.getAuctionButtons(getItemInfo);
      } else if (!getItemInfo.isCollected || !getItemInfo.isOnTrade) {
        return this.getDepositedButtons(getItemInfo);
      }
    },

    getMenuTitle() {
      const { isAuction, isBuy, isSell } = this.getItemInfo;

      if (isAuction) {
        return $t('Market.Auctions');
      }

      if (isBuy) {
        return $t('Market.Buy');
      }

      if (isSell) {
        return $t('Market.Sales');
      }

      return 'Item';
    },

    getRelatedItemType() {
      const page = this.page;

      if (page === 'buy') {
        return 'buy';
      } else if (page === 'sell') {
        return 'sell';
      }
    },

    getHeaderChainName() {
      return this.getItemInfo ? this.getItemInfo.chainName : '';
    },
  },

  watch: {
    $route(newVal, oldVal) {
      const isChangedToken = newVal.params.tokenAddress !== newVal.params.tokenAddress;
      const isChangedId = newVal.params.tokenId !== oldVal.params.tokenId;

      if (isChangedToken || isChangedId) {
        this.initPage();
      }
    },
  },

  methods: {
    ...mapActions([
      'setItemInfo',
      'toggleNft',
      'updateItemInfo',
      'setItemReadLog',
      'cancelAuction',
      'retrieveAsset',
      'placeBid',
      'cancelNormalOrder',
      'directExchange',
      'setRelatedItems',
      'reportItem',
      'setItemHistory',
      'setMyItems',
      'setMyLocalItems',
      'closeAuction',
    ]),

    async initPage(isFirst = true) {
      const { params, query } = this.$route;

      await this.setItemInfo({
        params,
        query,
      });

      // 새로고침 버튼 클릭한 경우 로그는 남기지 않음
      if (isFirst && this.getUserInfo.address) {
        await this.setItemReadLog(query);
      }

      await this.setRelatedItems({ page: this.getRelatedItemType });
      await this.setItemHistory({
        tokenAddress: params.tokenAddress,
        tokenId: params.tokenId,
      });

      this.loadingStatus = false;

      return true;
    },

    handleShareArticle() {
      this.showModal({
        component: 'ShareContentModal',
        params: {
          url: this.currentUrl,
          item: this.getItemInfo,
        },
      });
    },

    async handleToggleItem() {
      if (this.getLoadingStatus.toggleNft) {
        return;
      }

      const { getItemInfo, getLike } = this;
      const type = getLike ? 'off' : 'on';

      const res = await this.toggleNft({
        type,
        tradeId: getItemInfo.tradeId,
      });

      if (!res.success) {
        return;
      }

      const newState = _.cloneDeep(getItemInfo);
      const newFlag = type === 'off' ? 0 : 1;

      if (newState.isExchange) {
        newState.exchange.liked = newFlag;
        if (newState.isBuy) {
          newState.buy.liked = newFlag;
        } else if (newState.isSell) {
          newState.sell.liked = newFlag;
        }
      } else if (newState.isAuction) {
        newState.auction.liked = newFlag;
      }

      this.updateItemInfo(newState);
    },

    async handleCancelOrder(type) {
      const { getItemInfo } = this;

      if (getItemInfo.isAuction) {
        return await this.cancelAuction({
          tokenAddress: getItemInfo.tokenAddress,
          tokenId: getItemInfo.tokenId,
          tradeId: getItemInfo.tradeId,
        });
      }

      return await this.cancelNormalOrder({
        _type: type,
        tokenAddress: getItemInfo.tokenAddress,
        tokenId: getItemInfo.tokenId,
        tradeId: type === 'buy' ? this.$route.query.tradeId : getItemInfo.tradeId,
      });
    },

    handleRequest() {
      const { getItemInfo } = this;
      const menu = getItemInfo.isAuction ? 'bid' : 'negotiation';

      this.$router.push({
        path: `/asset/${menu}/${getItemInfo.tokenAddress}/${getItemInfo.tokenId}`,
      });
    },

    handleEditOrder() {
      const { getItemInfo } = this;
      const toQuery = {
        tokenAddress: getItemInfo.tokenAddress,
        tokenId: getItemInfo.tokenId,
        tradeId: getItemInfo.tradeId,
        type: getItemInfo.isSell || getItemInfo.isAuction ? 'sell' : 'buy',
        action: 'modify',
      };

      // 기본 거래인 경우 매수인 지 매도인 지 쿼리에 달아서
      if (getItemInfo.isExchange) {
        toQuery.type = getItemInfo.isSell ? 'sell' : 'buy';
      }

      return this.$router.push({
        path: `/asset/make-offer/${getItemInfo.isExchange ? 'normal' : 'auction'}`,
        query: toQuery,
      });
    },

    handleDirectTrade() {
      const { getItemInfo } = this;
      const cate = getItemInfo.isAuction ? 'auction' : this.$route.query.type;
      const checkoutPrice = getItemInfo.isAuction ? getItemInfo.auction.straightPrice : getItemInfo.currentPrice;

      return this.showModal({
        component: 'CheckoutModal',
        params: {
          info: getItemInfo,
          checkoutPrice,
          userDeposited: getItemInfo.currencyInfo.deposit,
          submit: async (finalAmount) => {
            if (getItemInfo.isAuction) {
              return await this.placeBid({
                cate,
                tradeId: getItemInfo.tradeId,
                amount: finalAmount,
                token: getItemInfo.currencyInfo,
                isCheckout: true,
              });
            }

            if (getItemInfo.isExchange) {
              return await this.directExchange({
                cate,
                tradeId: getItemInfo.tradeId,
                tokenAddress: getItemInfo.tokenAddress,
                tokenId: getItemInfo.tokenId,
                token: getItemInfo.currencyInfo,
                amount: finalAmount,
              });
            }
          },
        },
      });
    },

    async handleRetrieve(cate) {
      const { getItemInfo } = this;

      let price = '';
      let symbol = '';
      if (getItemInfo.exchange && getItemInfo.exchange.myNego) {
        const currencyInfo = _.find(this.getSupportCurrency, (row) => {
          if (this.$wallet.isSameAddress(row.tokenAddress, getItemInfo.exchange.myNego.currency)) {
            return true;
          }
          return false;
        });
        price = this.$bn.toMaxUnit(getItemInfo.exchange.myNego.negoPrice, currencyInfo.decimal, 4);
        symbol = currencyInfo.symbol;
      }

      return await this.retrieveAsset({
        cate,
        tokenAddress: getItemInfo.tokenAddress,
        tokenId: getItemInfo.tokenId,
        tradeId: this.getItemInfo.tradeId,
        price: price,
        symbol: symbol,
      });
    },

    handleCancelRequest(type) {
      if (type === 'sell') {
        return this.showModal({
          component: 'RetractNegoModal',
          params: {
            info: this.getItemInfo,
            nego: this.getItemInfo.exchange.myNego,
          },
        });
      }
    },

    handleReportArticle() {
      this.showModal({
        component: 'ReportItemModal',
        params: {
          info: this.getItemInfo,
          submit: async (reason, callback) => {
            const { tokenAddress, tokenId } = this.getItemInfo;
            const res = await this.reportItem({
              tokenAddress,
              tokenId,
              reason,
            });

            callback(res.success);
          },
        },
      });
    },

    handleMakeExchange(isMyItem) {
      const { getItemInfo } = this;

      this.$router.push({
        path: '/asset/make-offer/normal',
        query: {
          type: isMyItem ? 'sell' : 'buy',
          tokenAddress: getItemInfo.tokenAddress,
          tokenId: getItemInfo.tokenId,
        },
      });
    },

    getDepositedButtons(info) {
      const { isMyItem, isCollected, isItemOnMyWallet } = info;

      // 수집되지 않은 아이템이고 내 지갑에 보유 중인 경우
      if (!isCollected && isItemOnMyWallet) {
        return {
          leftButton: {
            title: $t('Market.DoDeposit'),
            classes: ['primary'],
            click: () => {
              this.$router.push({
                path: '/user/item',
                query: {
                  tab: 1,
                },
              });
            },
          },
        };
      }

      if (isMyItem) {
        return {
          leftButton: {
            title: $t('Market.MakeSell'),
            classes: ['outline-primary'],
            click: () => {
              this.handleMakeExchange(true);
            },
          },
          rightButton: {
            title: $t('Market.MakeAuction'),
            classes: ['primary'],
            click: () => {
              this.handleMakeAuction();
            },
          },
        };
      }

      return {
        leftButton: {
          title: $t('Market.DoBuy'),
          classes: ['outline-primary', 'full'],
          click: () => {
            return this.handleMakeExchange(false);
          },
        },
      };
    },

    getSellButtons(info) {
      const { isEndedExchange, ownerAddress, sell, isMyItem, isNegotiable } = info;
      const { isMyNego } = sell;

      const isOwner = this.$wallet.isSameAddress(this.getUserInfo.address, ownerAddress);

      if (isEndedExchange) {
        // 판매가 끝난 경우
        if (isMyNego) {
          // 협상자인 경우
          if (isMyItem) {
            // 낙찰자인 경우
            return {
              leftButton: {
                title: $t('Market.Soldout'),
                classes: ['disabled', 'full'],
                click: () => {},
              },
            };
          } else {
            // 낙찰자가 아닌 경우
            return {
              leftButton: {
                title: $t('Market.Soldout'),
                classes: ['disabled'],
                click: () => {},
              },
              rightButton: {
                title: '자산 회수하기',
                classes: ['primary'],
                click: () => {
                  this.handleRetrieve('sell');
                },
              },
            };
          }
        } else {
          // 협상자가 아닌 경우
          return {
            leftButton: {
              title: $t('Market.Soldout'),
              classes: ['disabled', 'full'],
              click: () => {},
            },
          };
        }
      } else {
        // 판매가 진행중인 경우
        if (isOwner) {
          // 판매자인 경우
          return {
            leftButton: {
              title: $t('General.Edit'),
              classes: ['outline-primary'],
              click: () => {
                this.handleEditOrder();
              },
            },
            rightButton: {
              title: $t('General.Cancel'),
              classes: ['primary'],
              click: () => {
                this.handleCancelOrder('sell');
              },
            },
          };
        } else {
          // 판매자가 아닌 경우
          if (isMyNego) {
            // 협상자인 경우
            return {
              leftButton: {
                title: $t('Market.DoRejectNego'),
                classes: ['outline-primary'],
                click: () => {
                  this.handleCancelRequest('sell');
                },
              },
              rightButton: {
                title: $t('Market.BuyItNow'),
                classes: ['disabled'],
                click: () => {},
              },
            };
          } else {
            // 협상자가 아닌 경우
            return {
              leftButton: {
                title: $t('Market.DoNego'),
                classes: isNegotiable ? ['outline-primary'] : ['disabled'],
                click: () => {
                  if (!isNegotiable) {
                    return;
                  }
                  return this.handleRequest();
                },
                tooltip: isNegotiable ? '' : $t('General.NotNegotiableItem'),
              },
              rightButton: {
                title: $t('Market.BuyItNow'),
                classes: ['primary'],
                click: () => {
                  this.handleDirectTrade();
                },
              },
            };
          }
        }
      }
    },

    getBuyButtons(info) {
      const { isEndedExchange, buy, isMyItem, isSell, isBuy, isMyWriting } = info;

      const { isBuyer } = buy;

      if (!isEndedExchange) {
        // 구매가 진행 중인 경우
        if (isMyWriting) {
          // 구매자인 경우
          return {
            leftButton: {
              title: $t('General.Edit'),
              classes: ['outline-primary'],
              click: () => {
                this.handleEditOrder();
              },
            },
            rightButton: {
              title: $t('General.Cancel'),
              classes: ['primary'],
              click: () => {
                this.handleCancelOrder(isSell ? 'sell' : 'buy');
              },
            },
          };
        } else {
          // 구매자가 아닌 경우
          if (isMyItem) {
            // NFT 보유자인 경우
            return {
              leftButton: {
                title: $t('Market.NftFound'),
                classes: ['primary', 'full'],
                click: () => {
                  this.handleDirectTrade();
                },
              },
            };
          } else {
            // NFT 보유자가 아닌 경우
            return {
              leftButton: {
                title: $t('Market.NftNotFound'),
                classes: ['disabled', 'full'],
                click: () => {},
              },
            };
          }
        }
      } else {
        // 구매가 진행 중이 아닌 경우
        return {
          leftButton: {
            title: $t('Market.SoldoutBuy'),
            classes: ['disabled', 'full'],
            click: () => {},
          },
        };
      }
    },

    getExchangeButtons(info) {
      const { isMyItem, currentOfferState, isNegotiable, isSell, exchange, isBuy, myNego, isSoldout } = info;
      const isEnded = currentOfferState === 'cancel' || (exchange && exchange.isFinished);

      const directTradeButton = {
        title: $t('Market.BuyItNow'),
        classes: ['primary'],
        click: () => {
          this.handleDirectTrade();
        },
      };

      // 취소된 주문이나 아직 묶인 자산을 수령하지 않은 경우
      if (info.isEndedExchange && isSell && Boolean(info.exchange.myNego)) {
        return {
          leftButton: {
            title: $t('Market.Soldout'),
            classes: ['disabled'],
            click: () => {},
          },
          rightButton: {
            title: '자산 회수하기',
            classes: ['primary'],
            click: () => {
              this.handleRetrieve('sell');
            },
          },
        };
      }

      if (isSell && isSoldout) {
        return {
          leftButton: {
            title: $t('Market.Soldout'),
            classes: ['disabled', 'full'],
            click: () => {},
          },
        };
      }

      // 매수 주문이고 종료되었으나 내가 체결자는 아닌 경우
      if (isBuy && info.isEndedExchange && !info.isWillBeMine) {
        return {
          leftButton: {
            title: $t('Market.Soldout'),
            classes: ['disabled', 'full'],
            click: () => {},
          },
        };
      }

      // 내가 예치한 아이템에 대한 매수 글을 보게 된 경우 즉시 판매 가능
      if (isBuy) {
        if (exchange && exchange.isBuyer) {
          return {
            leftButton: {
              title: $t('General.Edit'),
              classes: ['outline-primary'],
              click: () => {
                this.handleEditOrder();
              },
            },
            rightButton: {
              title: $t('General.Cancel'),
              classes: ['primary'],
              click: () => {
                this.handleCancelOrder(isSell ? 'sell' : 'buy');
              },
            },
          };
        } else {
          let isHavingItem = Boolean(
            _.find(this.getMyItems, (row) => {
              if (
                this.$wallet.isSameAddress(this.$route.params.tokenAddress, row.tokenAddress) &&
                this.$route.params.tokenId === row.tokenId
              ) {
                return true;
              }
              return false;
            }),
          );
          if (isHavingItem) {
            return {
              leftButton: {
                title: $t('Market.NftFound'),
                classes: ['primary', 'full'],
                click: () => {
                  this.handleDirectTrade();
                },
              },
            };
          } else {
            return {
              leftButton: {
                title: $t('Market.NftNotFound'),
                classes: ['disabled', 'full'],
                click: () => {},
              },
            };
          }
        }
      }
      // 매도 중인 내 아이템 or 내가 매수 등록해놓은 아이템
      if ((isMyItem && isSell) || (isBuy && exchange.isBuyer)) {
        return {
          leftButton: {
            title: $t('General.Edit'),
            classes: ['outline-primary'],
            click: () => {
              this.handleEditOrder();
            },
          },
          rightButton: {
            title: $t('General.Cancel'),
            classes: ['primary'],
            click: () => {
              this.handleCancelOrder(isSell ? 'sell' : 'buy');
            },
          },
        };
      }

      // 내가 협상 등록한 내역이 있는 경우 협상에 대한 철회 기능 지원
      if (exchange.myNego && exchange.myNego.status === 2) {
        return {
          leftButton: {
            title: $t('Market.DoRejectNego'),
            classes: ['outline-primary'],
            click: () => {
              this.handleCancelRequest('sell');
            },
          },
          rightButton: directTradeButton,
        };
      }

      return {
        leftButton: !isSell
          ? null
          : {
              title: $t('Market.DoNego'),
              classes: isNegotiable ? ['outline-primary'] : ['disabled'],
              click: () => {
                if (!isNegotiable) {
                  return;
                }
                return this.handleRequest();
              },
              tooltip: isNegotiable ? '' : $t('Market.NotNegotiableItem'),
            },
        rightButton: directTradeButton,
      };
    },

    getAuctionButtons(info) {
      const { isMyItem, isInstantTrade } = info;

      // 종료된 경매
      if (info.isEndedAuction) {
        // 경매가 종료된 상태.
        return {
          leftButton: {
            title:
              info.auction.buyerAddress && info.auction.buyerAddress !== ''
                ? $t('Market.BidResultSuccess')
                : $t('Market.BidResultFail'),
            classes: ['disabled'],
            click: () => {},
          },
          rightButton: {
            title: $t('Market.EndedAuction'),
            classes: ['disabled'],
            click: () => {},
          },
        };
      }

      // 내 아이템이고 현재 주문이 진행중인 경우
      if (isMyItem) {
        const { bids } = info.auction;

        return {
          leftButton:
            bids.length === 0
              ? {
                  title: $t('General.Edit'),
                  classes: ['outline-primary'],
                  click: () => {
                    this.handleEditOrder();
                  },
                }
              : {
                  title: $t('General.Edit'),
                  classes: ['disabled'],
                  click: () => {},
                },
          rightButton:
            bids.length === 0
              ? {
                  title: $t('General.Cancel'),
                  classes: ['primary'],
                  click: () => {
                    this.handleCancelOrder();
                  },
                }
              : {
                  title: $t('General.Cancel'),
                  classes: ['disabled', 'primary'],
                  click: () => {},
                },
        };
      }

      const { enableBid, isLowerThanStraightPrice, isNormalAuction } = info.auction;

      // 주문이 진행 중이고 내가 아이템의 주인이 아닐 경우
      if (!isLowerThanStraightPrice) {
        // 다음 입찰가가 상한가보다 높아질 경우
        if (!isNormalAuction) {
          // 즉시구매 가능한 경매인 경우
          return {
            leftButton: {
              title: $t('Market.BiddingClosed'),
              disable: true,
              classes: ['disabled'],
              click: () => {},
            },
            rightButton: {
              title: $t('Market.BuyItNow'),
              classes: [isNormalAuction ? 'disabled' : 'primary'],
              click: () => {
                if (isNormalAuction) {
                  return;
                }
                return this.handleDirectTrade();
              },
            },
          };
        } else {
          // 즉시구매 불가능 경매인 경우
          return {
            leftButton: {
              title: $t('Market.BidNow'),
              disable: true,
              classes: ['outline-primary'],
              click: () => {
                return this.handleRequest();
              },
            },
            rightButton: {
              title: $t('Market.BuyItNow'),
              classes: [isNormalAuction ? 'disabled' : 'primary'],
              click: () => {
                if (isNormalAuction) {
                  return;
                }
                return this.handleDirectTrade();
              },
            },
          };
        }
      }
      if (this.getChainInfo.chain === 'ETHEREUM' && this.getItemInfo.nftInfo.platform === 'KLAY') {
        return {
          leftButton: {
            title: !enableBid ? $t('Market.ProgressingAuction') : $t('Market.BidNow'),
            classes: ['disabled'],
            click: () => {},
          },
          rightButton: {
            title: $t('Market.BuyItNow'),
            classes: ['disabled'],
            click: () => {},
          },
        };
      }

      return {
        leftButton: {
          title: !enableBid ? $t('Market.ProgressingAuction') : $t('Market.BidNow'),
          disable: !enableBid,
          classes: enableBid ? ['outline-primary'] : ['disabled'],
          click: () => {
            if (!enableBid) {
              return;
            }

            return this.handleRequest();
          },
        },
        rightButton: {
          title: $t('Market.BuyItNow'),
          disable: !isInstantTrade,
          classes: isInstantTrade ? ['primary'] : ['disabled'],
          tooltip: isInstantTrade ? '' : '',
          click: () => {
            if (!isInstantTrade) {
              return;
            }

            return this.handleDirectTrade();
          },
        },
      };
    },

    enlargementClicked() {
      const baseURL = this.$static.getFileURL('html/ItemEnlargementPopup.html');
      const queryURL = `img=${this.getItemInfo.metadata.image}`;
      const targetURL = `${baseURL}?${queryURL}`;
      const name = 'popup';
      const option = 'location = no, toolbars = no, status = no';
      window.open(targetURL, name, option);
    },

    handleMakeAuction() {
      this.$router.push({
        path: '/asset/make-offer/auction',
      });
    },

    hasVideo(item) {
      const videoUrl = item.metadata?.animationUrl;
      if (videoUrl) {
        return true;
      }
      return false;
    },

    playVideo(item) {
      if (!this.hasVideo(item)) return false;
      const videoUrl = item.metadata?.animationUrl;
      if (videoUrl) {
        this.showModal({
          component: 'PlayVideoModal',
          params: {
            videoUrl: videoUrl,
            closable: true,
          },
        });
      }
    },
  },

  components: {
    AssetItemCard,
    AssetItemCardMarketPlace,
    AssetItemDetail,
    AssetItemProfileDeposited,
    AssetItemProfileExchange,
    AssetItemProfileAuction,
    MainConnectWallet,
  },
};
</script>
