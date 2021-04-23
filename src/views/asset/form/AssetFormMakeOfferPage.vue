<template>
  <div class="asset-form-page">
    <section class="asset-form__body">
      <div class="asset-page__category">
        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Item')[0]}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', ['current'])">
          <span>{{isWithBid ? $t('Market.Auctions') : isSell ? $t('General.SellMenu') : $t('General.BuyMenu')}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Complete')}}</span>
        </div>
      </div>

      <div class="asset-form__title">
        <h1>
          <strong>{{isWithBid ? $t('Market.MakeOfferTitleAuction') : !isSell ? $t('Market.MakeOfferTitleBuy') : $t('Market.MakeOfferTitleSell')}}</strong>
        </h1>

        <p>{{getItemInfo.collectionName}} {{getItemInfo.itemName}}</p>
      </div>

      <!-- 경매 -->
      <div v-if="isWithBid">
        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('General.Currency')}}</h5>
          </div>

          <div class="asset-form__currency">
            <button
              v-for="currency in getSupportCurrency"
              v-if="isVisibleToken(currency)"
              :key="currency.symbol"
              :class="$bem('asset-form__currency__option', '', isVisibleToken(currency) ? usedCurrency.symbol === currency.symbol ? ['selected'] : [] : ['disabled'])"
              @click="isVisibleToken(currency) ? handleSelectCurrency(currency) : ''"
            >
              <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)">
              <strong>{{currency.symbol}}</strong>
            </button>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.StartPrice')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferStartPriceDesc')}}
            </span>
          </div>

          <div class="asset-form__price">
            <div class="asset-form__price__input">
              <input type="number" step="any" :placeholder="$t('Market.BidFormPlaceholder')" v-model="price" />
              <button>
                <img :src="$static.getFileURL(`img/icon/ic-token-${getUsedCurrencySymbol()}.svg`)">
                <span>{{usedCurrency.symbol}}</span>
              </button>
            </div>

            <!--
            <div class="asset-form__price__balance">
              <span>{{$t('Market.UserBalanceLabel', { token: usedCurrency.symbol })}} </span>
              <span><strong>{{usedCurrency.decDeposit.dprec(4) | addComma}}</strong> {{usedCurrency.symbol}} </span>
            </div>
            -->

            <!--오류 문구-->
            <div></div>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.BuyItNow')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferDirectBidDesc')}}
            </span>
          </div>

          <div class="asset-form__make-offer-nego">
            <button :class="$bem('asset-form__make-offer-select__option', '', isInstantTrade === true ? ['selected'] : '')" @click="isInstantTrade = true">
              {{$t('General.Set')}}
            </button>
            <button :class="$bem('asset-form__make-offer-select__option', '', isInstantTrade === false ? ['selected'] : '')" @click="isInstantTrade = false">
              {{$t('General.None')}}
            </button>
          </div>
        </div>

        <div class="asset-form__row" v-if="isInstantTrade === true">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.BuyItNowPrice')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferBuyItNowPriceDesc')}}
            </span>
          </div>

          <div class="asset-form__price">
            <div class="asset-form__price__input">
              <input
                type="number"
                step="any"
                :placeholder="$t('Market.BidFormPlaceholder')"
                v-model="endPrice"
              />
              <button>
                <img :src="$static.getFileURL(`img/icon/ic-token-${getUsedCurrencySymbol()}.svg`)">
                <span>{{usedCurrency.symbol}}</span>
              </button>
            </div>

            <!--
            <div class="asset-form__price__balance">
              <span>{{$t('Market.UserBalanceLabel', { token: usedCurrency.symbol })}} : </span>
              <span><strong>{{usedCurrency.decDeposit.dprec(4) | addComma}}</strong> {{usedCurrency.symbol}} </span>
            </div>
            -->
            <!--오류문구-->
            <div v-if="endPriceError" class="asset-form__price-error">
              {{ $t('Market.ErrorMessage1') }}
            </div>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.AuctionTime')}}</h5>
            <span class="asset-form__row__label__sub">{{$t('Market.MakeOfferAuctionTimeDesc')}}</span>
          </div>

          <div class="asset-form__row__auction">
            <div class="asset-form__row__auction__select">
              <common-search-dropdown
                :list="getPeriodOptions"
                :selected="selectedPeriod"
                :defaultTitle="$t('Market.SelectPeriod')"
                @onSelect="(option) => selectedPeriod = option"
              />
            </div>

            <div class="asset-form__row__auction__notice" v-html="$t('Market.MakeOfferSelectPeriodDesc')" />
          </div>
        </div>
      </div>

      <!-- 매도 거래 -->
      <div v-else-if="isSell">
        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('General.Currency')}}</h5>
          </div>

          <div class="asset-form__currency">
            <button
              v-for="currency in getSupportCurrency"
              v-if="isVisibleToken(currency)"
              :key="currency.symbol"
              :class="$bem('asset-form__currency__option', '', isVisibleToken(currency) ? usedCurrency.symbol === currency.symbol ? ['selected'] : [] : ['disabled'])"
              @click="isVisibleToken(currency) ? handleSelectCurrency(currency) : ''"
            >
              <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)">
              <strong>{{currency.symbol}}</strong>
            </button>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.BuyItNowPrice')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferBuyItNowPriceDesc')}}
            </span>
          </div>

          <div class="asset-form__price">
            <div class="asset-form__price__input">
              <input type="number" step="any" :placeholder="$t('Market.BidFormPlaceholder')" v-model="price" />
              <button>
                <img :src="$static.getFileURL(`img/icon/ic-token-${getUsedCurrencySymbol()}.svg`)">
                <span>{{usedCurrency.symbol}}</span>
              </button>
            </div>

            <!--
            <div class="asset-form__price__balance">
              <span>{{$t('Market.UserBalanceLabel', { token: usedCurrency.symbol })}} : </span>
              <span><strong>{{usedCurrency.decDeposit.dprec(4) | addComma}}</strong> {{usedCurrency.symbol}} </span>
            </div>
            -->
            <!--오류문구-->
            <div>

            </div>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.Negotiation')}}</h5>
            <span class="asset-form__row__label__sub">{{$t('Market.MakeOfferNegoDesc')}}</span>
          </div>

          <div class="asset-form__make-offer-nego">
            <button :class="$bem('asset-form__make-offer-select__option', '', isNegotiable ? ['selected'] : '')" @click="isNegotiable = true">
              {{$t('General.Available')}}
            </button>
            <button :class="$bem('asset-form__make-offer-select__option', '', !isNegotiable ? ['selected'] : '')" @click="isNegotiable = false">
              {{$t('General.UnAvailable')}}
            </button>
          </div>
        </div>
      </div>

      <!-- 매수 거래 -->
      <div v-else>
        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.Collection')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferCollectionDesc')}}
            </span>
          </div>

          <!--
          <common-search-bar
            :disabled="isModify"
            :keyword="collectionKeyword"
            :options="getSearchbarOptions"
            @onInput="handleSetCollectionKeyword"
          >
            <div class="common-search-bar__result__item" slot="resultBody">
              <div class="common-search-bar__result__list">
                <div class="common-search-bar__result__row" v-for="collection in getSupportNft" :key="collection.symbol" @click="handleSelectCollection(collection)">
                  <div></div>
                  <div>
                    {{$_SearchMixin_getHighlightedKeyword(collection.name)}}
                  </div>
                </div>
              </div>
            </div>
          </common-search-bar>
          -->
          <div class="asset-form__row-input-container">
            <input
                type="text"
                placeholder="search"
                v-model="collectionKeyword"
                ref="input"
                :disabled="isModify"
                :class="isModify ? 'disabled' : 'active'"
            >
            <div class="asset-form__row-input-result" v-show="!isModify && collectionInput" ref="inputResult">
              <ul>
                <li v-for="collection in getSupportNft" v-if="isVisibleChain(collection)">
                  <span @click="handleSelectCollection(collection)">{{ collection.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('General.TokenId')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferItemDesc')}}
            </span>
          </div>

          <common-search-bar
            :disabled="isModify"
            :searchDisabled="true"
            :keyword="itemKeyword"
            :options="{ ...getSearchbarOptions, hideResultBox: true }"
            @onInput="handleSetItemKeyword"
          />
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('General.Currency')}}</h5>
          </div>

          <div class="asset-form__currency">
            <button
                v-for="currency in getSupportCurrency"
                v-if="isVisibleToken(currency)"
                :key="currency.symbol"
                :class="$bem('asset-form__currency__option', '', isVisibleToken(currency) ? (usedCurrency.symbol === currency.symbol ? ['selected'] : []) : ['disabled'])"
                @click="isVisibleToken(currency) ? handleSelectCurrency(currency) : ''"
            >
              <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)">
              <strong>{{currency.symbol}}</strong>
            </button>
          </div>
        </div>

        <div class="asset-form__row">
          <div class="asset-form__row__label">
            <h5>{{$t('Market.BuyItNowPrice')}}</h5>
            <span class="asset-form__row__label__sub">
              {{$t('Market.MakeOfferBuyItNowPriceDesc')}}
            </span>
          </div>

          <div class="asset-form__price">
            <div class="asset-form__price__input">
              <input
                type="number"
                step="any"
                :placeholder="$t('Market.MakeOfferBuyPlaceholder')"
                v-model="price"
              />
              <button>
                <img :src="$static.getFileURL(`img/icon/ic-token-${getUsedCurrencySymbol()}.svg`)">
                <span>{{usedCurrency.symbol}}</span>
              </button>
            </div>

            <div class="asset-form__price__balance">
              <span>{{$t('Market.UserBalanceLabel', { token: usedCurrency.symbol })}} : </span>
              <span><strong>{{getUsedCurrencyDeposit() | addComma}}</strong> {{usedCurrency.symbol}} </span>
            </div>

            <div class="asset-form__price-error" v-if="priceError0">
              {{ $t('Market.ErrorMessage2', { token: usedCurrency.symbol }) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <aside class="asset-form__aside">
      <asset-item-floating :note="getRegisterNote" :info="getItemInfo">
        <div slot="submit" class="asset-item__floating__submit">
          <button :class="$bem('common-submit-button', '', [isActiveForm ? 'primary' : 'disabled'])" @click="handleMakeOffer()">
            {{isModify ? $t('Market.ModifyNow') : $t('Market.RegisterNow')}}
          </button>
        </div>
      </asset-item-floating>
    </aside>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import SearchMixin from '@/mixins/SearchMixin'
  import AssetSellMixin from '@/mixins/asset/AssetSellMixin'
  import AssetItemFloating from '@/components/asset/item/AssetItemFloating'
  import CommonSearchDropdown from '@/components/common/CommonSearchDropdown'
  import CommonSearchBar from '@/components/common/CommonSearchBar'

  let $t, component
  let eventFunction
  let eventFunction2

  export default {
    name: 'AssetFormRegisterPage',
    mixins: [SearchMixin, AssetSellMixin],
    props: ['itemInfo'],
    created() {
      component = this
      $t = this.$t.bind(this)

      eventFunction = function() {
        component.price = component.$_AssetSellMixin_limitMinPrice(component.price);
      }
      eventFunction2 = function (event) {
        if (!component.collectionInput && component.$refs['input'] && component.$refs['input'].contains(event.target)) {
          component.handleInputFocus(event);
        } else if (component.collectionInput && component.$refs['inputResult'] &&!component.$refs['inputResult'].contains(event.target) && !component.$refs['input'].contains(event.target)) {
          component.handleInputBlur(event);
        }
      }
    },

    mounted() {
      this.$nextTick(this.initPage)
      window._vm = this

      window.addEventListener('keyup', eventFunction);
      window.addEventListener('click', eventFunction2);
    },

    beforeDestroy() {
      window.removeEventListener('keyup', eventFunction);
      window.removeEventListener('click', eventFunction2);
    },

    data() {
      return {
        price: '0',
        endPrice: '0',
        usedCurrency: this.$store.getters.getChainInfo.chain === 'ETHEREUM' ? this.$store.getters.getSupportCurrency[1] : this.$store.getters.getSupportCurrency[0],
        collectionKeyword: '',
        itemKeyword: '',
        selectedPeriod: {},
        isInstantTrade: false,
        isNegotiable: true,
        selectedCollection: {},
        collectionInput: false,
        priceError: false,
        endPriceError: false,
        priceError0: false
      }
    },

    computed: {
      ...mapGetters([
          'getSupportCurrency',
          'getMaskedAddress',
          'getSupportNft',
          'getItemInfo',
          'getChainInfo'
      ]),

      isSell() { // buy or sell
        return this.$route.query.type === 'sell'
      },

      isWithBid() { // bid or normal
        return this.$route.params.howTo === 'auction'
      },

      getRegisterNote() {
        const { isWithBid, isSell } = this

        let result = []

        if(isWithBid) {
          result = [
            {
              text: $t('Market.MakeOfferAuctionWarning1')
            },
            {
              text: $t('Market.MakeOfferAuctionWarning2')
            }
          ]
        } else if(isSell) {
          result = [
            {
              text: $t('Market.MakeOfferSellWarning1')
            },
            {
              text: $t('Market.MakeOfferSellWarning2')
            }
          ]
        } else {
          result = [
            {
              text: $t('Market.MakeOfferBuyWarning1')
            },
            {
              text: $t('Market.MakeOfferBuyWarning2')
            }
          ]
        }

        return result.concat({
          text: $t('Market.WeHaveNoPowerForChangeOffer')
        })
      },

      getSearchbarOptions() {
        return {
          resultStyle: {
            width: '510px'
          }
        }
      },

      getPeriodOptions() {
        return [
          {
            name: $t('Market.PeriodOptionMinute', {
              num: 5
            }),
            value: 60*5
          },
          {
            name: $t('Market.PeriodOptionWeek', {
              num: 1
            }),
            value: 86400 * 7
          },
          {
            name: $t('Market.PeriodOptionDate', {
              num: 10
            }),
            value: 86400 * 10
          },
          {
            name: $t('Market.PeriodOptionWeeks', {
              num: 2
            }),
            value: 86400 * 14
          }
        ]
      },

      isModify() {
        return this.$route.query.action === 'modify'
      },

      isActiveForm() {
        // 경매
        if(this.$route.params.howTo === 'auction') {
          // 가격 미입력
          if(this.price && this.price.dcomp('0') !== 1) {
            return false
          }

          // 기간을 선택하지 않은 경우
          if(_.isEmpty(this.selectedPeriod)) {
            return false
          }

          // 즉시 체결 가능하다고 선택해놓고 값을 입력하지 않은 경우
          if(this.isInstantTrade && this.endPrice && this.endPrice.dcomp('0') !== 1) {
            return false
          }

          let priceNum = Number(this.price);
          let endPriceNum = Number(this.endPrice);
          if (this.endPrice === '' || priceNum && endPriceNum && (priceNum >= endPriceNum)) {
            this.endPriceError = true;
            return false;
          } else {
            this.endPriceError = false;
          }
        }

        // 매수
        if(this.$route.query.type === 'buy') {
          const priceToPeb = this.$bn.toMinUnit(this.price, this.usedCurrency.decimal)

          if(priceToPeb && this.usedCurrency.deposit && priceToPeb.dcomp(this.usedCurrency.deposit) === 1) {
            this.priceError0 = true;
            return false
          } else {
            this.priceError0 = false;
          }

          // 컬렉션(=NFT) 주소가 16진수가 아닌 경우, TODO : NFT 전용 주소 체크
          if(!this.$wallet.utils.isHex(this.collectionKeyword)) {
            return false
          }

          // 토큰 ID가 비어 있거나 숫자가 아닌 경우
          if(String(this.itemKeyword).trim().length === 0 || Number(Number.isNaN(this.itemKeyword))) {
            return false
          }
        }

        // 가격 미입력
        if(this.price && this.price.dcomp('0') !== 1) {
          return false
        }

        // 위 조건을 모두 통과했다면 Submit 활성화
        return true
      },
    },

    watch: {
      itemKeyword: _.debounce(function(newVal) {
        if(!newVal || _.isEmpty(this.selectedCollection)) {
          return
        }

        this.initPage({
          tokenAddress: this.selectedCollection.addressToReserve,
          tokenId: newVal
        })
      }, 150),

      selectedCollection: function (newVal, oldVal) {
        this.handleInputBlur();
      }
    },

    methods: {
      ...mapActions([
        'addAuction',
        'addNormalOffer',
        'setItemInfo',
        'editAuction',
        'editNormalOffer'
      ]),

      async initPage(info) {
        const { params, query } = this.$route
        const _info = info || query

        if(params.howTo === 'bid') {
          return
        }

        if(!_info.tokenAddress || !_info.tokenId) {
          return
        }

        const res = await this.setItemInfo({
          params: {
            tokenAddress: _info.tokenAddress,
            tokenId: _info.tokenId
          },
          query
        })
        const isNotOwner = !this.$wallet.isSameAddress(res.info.ownerAddress, this.getUserInfo.address)

        // 호출 실패 시 홈으로
        if(!res.success) {
          return this.$router.push({
            path: '/home'
          })
        }

        // 커스텀 매수 주문 생성이 아닌 경우
        if(!info) {
          // 매도, 경매 주문인데 Owner 유저가 아닌 경우
          // if(!res.info.isBuy && isNotOwner) {
          //   return this.$router.push({
          //     path: '/home'
          //   })
          // }
          // qa 진행을 위해 주석 처리

          // 매수 주문인데 내가 Owner 유저인 경우
          if(res.info.isBuy && !isNotOwner) {
            return this.$router.push({
              path: '/home'
            })
          }
        }

        // 매수 주문의 경우 주소와 ID가 쿼리로 넘어온 게 있다면 자동 입력
        if(query.type === 'buy') {
          this.collectionKeyword = res.info.tokenAddress
          this.selectedCollection = this.getItemInfo.nftInfo
          this.itemKeyword = res.info.tokenId
        }

        this.isModify && this.initModify()
      },

      // 주문 수정일 경우 받아온 itemInfo 상에서 정보 뽑아 자동 입력시켜주기
      initModify() {
        const { getItemInfo } = this
        const { isExchange, exchange, auction, currencyInfo } = getItemInfo

        this.usedCurrency = currencyInfo
        this.price = this.$bn.toMaxUnit(isExchange ? exchange.basePrice : auction.basePrice, currencyInfo.decimal, 4)

        // 매도 주문일 경우 Nego 허용 여부 설정
        // 경매 주문일 경우 즉시구매 가능 여부와 가격 및 경매 기간 설정
        if(getItemInfo.isExchange) {
          this.isNegotiable = getItemInfo.isNegotiable
        } else {
          this.isInstantTrade = getItemInfo.isInstantTrade
          this.endPrice = this.$bn.toMaxUnit(auction.straightPrice, currencyInfo.decimal, 4)
          this.selectedPeriod = _.find(this.getPeriodOptions, row => {
            return (row.value * 1000) === getItemInfo.auction.getPeriod.milliseconds
          }) || {}
        }
      },

      handleSelectCurrency(currency) {
        this.usedCurrency = currency
      },

      async handleMakeOffer() {
        if(!this.isActiveForm) {
          return
        }

        const {
          isModify,
          price,
          endPrice,
          isWithBid,
          getItemInfo,
          usedCurrency,
          selectedPeriod,
          isInstantTrade,
          isNegotiable,
          selectedCollection,
          itemKeyword
        } = this
        const { type } = this.$route.query
        const priceToPeb = this.$bn.toMinUnit(price, usedCurrency.decimal)

        // 수정
        if(isModify) {
          if(isWithBid) {
            return await this.editAuction({
              tokenAddress: getItemInfo.tokenAddress,
              tokenId: getItemInfo.tokenId,
              tradeId: getItemInfo.tradeId,
              biddingToken: usedCurrency.addressToReserve,
              minAmount: this.$bn.toMinUnit(price, usedCurrency.decimal),
              maxAmount: this.$bn.toMinUnit(isInstantTrade ? endPrice : price, usedCurrency.decimal),
              duration: selectedPeriod.value,
              isInstantTrade
            })
          }

          return await this.editNormalOffer({
            _type: type,
            tokenAddress: this.$route.query.tokenAddress || getItemInfo.tokenAddress,
            tokenId: this.$route.query.tokenId || getItemInfo.tokenId,
            // tradeId: getItemInfo.exchange.id,
            tradeId: this.$route.query.tradeId || getItemInfo.tradeId,
            currency: usedCurrency.addressToReserve,
            amount: priceToPeb,
            isNegotiable
          })
        }

        // 신규 등록

        if(isWithBid) {
          // price End price 오류 만들기
          let priceNum = Number(price);
          let endPriceNum = Number(endPrice);

          if (priceNum && endPriceNum && (priceNum >= endPriceNum)) {
            return;
          }

          return await this.addAuction({
            tokenAddress: getItemInfo.tokenAddress,
            tokenId: getItemInfo.tokenId,
            biddingToken: usedCurrency.addressToReserve,
            minAmount: this.$bn.toMinUnit(price, usedCurrency.decimal),
            maxAmount: this.$bn.toMinUnit(isInstantTrade ? endPrice : price, usedCurrency.decimal),
            duration: selectedPeriod.value,
            isInstantTrade
          })
        }

        return await this.addNormalOffer({
          _type: type,
          // tokenAddress: selectedCollection.addressToReserve,
          // tokenId: itemKeyword,
          tokenAddress: getItemInfo.tokenAddress,
          tokenId: getItemInfo.tokenId,
          currency: usedCurrency.addressToReserve,
          amount: priceToPeb,
          isNegotiable
        })
      },

      handleSetCollectionKeyword(value) {
        this.collectionKeyword = value
      },

      handleSetItemKeyword(value) {
        this.itemKeyword = value
      },

      handleSelectCollection(collection) {
        this.selectedCollection = collection
        this.collectionKeyword = collection.addressToReserve
      },

      getUsedCurrencyDeposit() {
        if (this.usedCurrency && this.usedCurrency.decDeposit) return this.usedCurrency.decDeposit.dprec(4);
        return '0';
      },

      getUsedCurrencySymbol() {
        if (this.usedCurrency && this.usedCurrency.symbol && typeof this.usedCurrency.symbol === 'string') return this.usedCurrency.symbol.toLowerCase();
        return '';
      },

      handleInputFocus() {
        this.collectionInput = true;
      },

      handleInputBlur() {
        this.collectionInput = false;
      },

      isVisibleChain(row) {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          if (row.platform === 'KLAY') {
            return false;
          }
        }
        return true;
      },

      isVisibleToken(row) {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          if (row.symbol.toLowerCase() === 'klay') {
            return false;
          }
        }
        return true;
      },

      whatNftPlatform(row) {
        
      }
    },

    components: {
      CommonSearchBar,
      AssetItemFloating,
      CommonSearchDropdown
    }
  }
</script>
