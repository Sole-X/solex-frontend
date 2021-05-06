import axios from 'axios';

export const getDefaultState = () => ({
    stakingQueue : [],
    stakingCommit: {},
    stakingAmount: 0,
    unstakingAmount: 0,
    rewardAmount: 0,
    isSetAmount: false,
    totalRewardAmount: 0,
    curPage: 1,
    totalPage: 1,
    numOfActivities: 0,
    isSetPager: true,
    stakingItems: [],
    totalSupply: 0,
    totalStaked: 0,
    rewardsDistributed: 0,
    trixPrice: 0,
    unstakingPeriod: 0,
    rewards: {},
})

export default {
    state() {
        return getDefaultState()
    },
    mutations: {
        SET_STAKING_COMMIT(state, payload) {
            state.stakingCommit = payload;
        },

        SET_STAKING_AMOUNT(state, payload) {
            state.stakingAmount = payload;
        },

        SET_UNSTAKING_AMOUNT(state, payload) {
            state.unstakingAmount = payload;
        },

        SET_REWARD_AMOUNT(state, payload) {
            state.rewardAmount = payload;
        },

        SET_IS_SET_AMOUNT(state, payload) {
            state.isSetAmount = payload;
        },

        SET_CUR_PAGE(state, payload) {
            state.curPage = payload;
        },

        SET_TOTAL_PAGE(state, payload) {
            state.totalPage = payload
        },

        SET_STAKING_ITEMS(state, payload) {
            state.stakingItems = _.cloneDeep(payload);
        },

        SET_TOTAL_SUPPLY(state, payload) {
            state.totalSupply = payload.totalSupply;
        },

        SET_TOTAL_STAKED(state, payload) {
            state.totalStaked = payload.totalStaked;
        },

        SET_REWARDS_DISTRIBUTED(state, payload) {
            state.rewardsDistributed = payload.rewardsDistributed;
        },

        SET_TRIX_PRICE(state, payload) {
            state.trixPrice = payload.trixPrice;
        },

        SET_UNSTAKING_PERIOD(state, payload) {
            state.unstakingPeriod = payload.unstakingPeriod;
        },

        SET_REWARDS(state, payload) {
            state.rewards = {
                ...state.rewards,
                [payload.currency]: payload.data
            }
        },

        SET_NUM_OF_ACTIVITIES(state, payload) {
            state.numOfActivities = payload;
        },

        SET_IS_SET_PAGER(state, payload) {
            state.isSetPager = payload;
        }
    },

    actions: {
        async stakingToken({commit, dispatch, getters}, payload) {
            const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

            let signResult;
            let sendResult;

            if (!isKlip) {
                signResult = await this.$app.$tx.stakingToken(payload.token.addressToReserve, payload.amount, {
                    type: 'stakingToken',
                    token: payload.token,
                    amount: payload.amount
                });

                if (!signResult.success) {
                    return signResult
                }

                sendResult = await dispatch('sendMessageTx', {
                    cate: 'stake',
                    message: signResult.data.message,
                    requestHash: signResult.data.requestHash,
                    signature: signResult.data.signature,
                    ...signResult.data
                });
            }
            else if (isKlip) {
                const { amount } = payload;
                const klipContractName = 'StakingContract';
                const klipMethodName = 'staking';
                const klipParams = [this.$app.$tx.getRandomHash(), amount];

                sendResult = await this.$app.$wallet.sendKlipTransaction({
                    to: this.$app.$tx.getContractAddress(klipContractName),
                    value: '0',
                    abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
                    params: JSON.stringify(klipParams)
                });
            }

            if (sendResult.success) {
                dispatch('openTxSuccessModal', {
                    action: 'staking',
                    success: sendResult.success,
                    txHash: sendResult.info.txHash,
                    amount: payload.amount,
                    currency: payload.token
                });

                const sessionKey = 'staking' + this.$app.$tx.getRandomHash();

                const date = new Date();
                const token = payload.token;
                const amount = payload.amount;
                const type = 'staking';
                const claimed = false;
                // backend db에 저장할 것

                commit('SET_STAKING_COMMIT', {
                    sessionKey, date, token, amount, type, claimed
                });

            } else {
                alert('서명 실패');
            }

            return sendResult;
        },

        async unstakingToken({commit, dispatch, getters}, payload) {
            const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

            let signResult;
            let sendResult;

            if (!isKlip) {
                signResult = await this.$app.$tx.unstakingToken(payload.token.currentAddress, payload.amount, {
                    type: 'unstakingToken',
                    token: payload.token,
                    amount: payload.amount
                });

                if (!signResult.success) {
                    return signResult;
                }

                sendResult = await dispatch('sendMessageTx', {
                    cate: 'stake',
                    message: signResult.data.message,
                    requestHash: signResult.data.requestHash,
                    signature: signResult.data.signature,
                    ...signResult.data
                });
            }
            else if (isKlip) {
                const { amount } = payload;
                const klipContractName = 'StakingContract';
                const klipMethodName = 'unstaking';
                const klipParams = [this.$app.$tx.getRandomHash(), amount];

                sendResult = await this.$app.$wallet.sendKlipTransaction({
                    to: this.$app.$tx.getContractAddress(klipContractName),
                    value: '0',
                    abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
                    params: JSON.stringify(klipParams)
                });
            }

            if (sendResult.success) {
                dispatch('openTxSuccessModal', {
                    action: 'unstaking',
                    success: sendResult.success,
                    txHash: sendResult.info.txHash,
                    amount: payload.amount,
                    currency: payload.token
                });

                const sessionKey = 'unstaking' + this.$app.$tx.getRandomHash();

                const date = new Date();
                const token = payload.token;
                const amount = payload.amount;
                const type = 'unstaking';
                const claimed = false;
                // backend db에 저장할 것

                commit('SET_STAKING_COMMIT', {
                    sessionKey, date, token, amount, type, claimed
                });
            } else {
                alert('서명 실패')
            }
        },

        async claimUnstakingToken({commit, dispatch, getters}, payload) {
            const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

            let signResult;
            let sendResult;

            if (!isKlip) {
                signResult = await this.$app.$tx.claimUnstakingToken(payload.token.currentAddress, payload.amount, {
                    type: 'claimUnstakingToken',
                    token: payload.token,
                    uid: payload.uid
                });

                if (!signResult.success) {
                    return signResult;
                }

                sendResult = await dispatch('sendMessageTx', {
                    cate: 'stake',
                    message: signResult.data.message,
                    requestHash: signResult.data.requestHash,
                    signature: signResult.data.signature,
                    ...signResult.data
                });
            }
            else if (isKlip) {
                const { uid } = payload;
                const klipContractName = 'StakingContract';
                const klipMethodName = 'claimUnstaking';
                const klipParams = [this.$app.$tx.getRandomHash(), uid];

                sendResult = await this.$app.$wallet.sendKlipTransaction({
                    to: this.$app.$tx.getContractAddress(klipContractName),
                    value: '0',
                    abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
                    params: JSON.stringify(klipParams)
                });
            }

            // Log('StakingStore/claimUnstakingToken sendResult', sendResult);
            // 동작은 가능, 프론트엔드 구현 예정.
        },

        async claimRewardToken({commit, dispatch, getters}, payload) {
            const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

            let signResult;
            let sendResult;

            if (!isKlip) {
                signResult = await this.$app.$tx.claimRewardToken(payload.token.currentAddress, payload.amount, {
                    type: 'claimRewardToken',
                    token: payload.token
                });

                if (!signResult.success) {
                    return signResult;
                }

                sendResult = await dispatch('sendMessageTx', {
                    cate: 'stake',
                    message: signResult.data.message,
                    requestHash: signResult.data.requestHash,
                    signature: signResult.data.signature,
                    ...signResult.data
                });
            }
            else if (isKlip) {
                const klipContractName = 'StakingContract';
                const klipMethodName = 'claimReward';
                const klipParams = [this.$app.$tx.getRandomHash()];

                sendResult = await this.$app.$wallet.sendKlipTransaction({
                    to: this.$app.$tx.getContractAddress(klipContractName),
                    value: '0',
                    abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
                    params: JSON.stringify(klipParams)
                });
            }

            return sendResult;
        },

        async setStakingTotalAmount(store, payload) {
            const baseURL = process.env.VUE_APP_API_ENDPOINT;
            const pathURL = `v1/account/${this.getters.getUserInfo.address}/staking`;
            const targetURL = `${baseURL}/${pathURL}`;

            const res = await axios.get(targetURL);
            if (res.status === 200) {
                const info = res.data.info;
                const rewards = res.data.rewards;

                store.dispatch('setStakingAmount', { info });
                store.dispatch('setUnstakingAmount', { info });
                store.dispatch('setRewardAmount', { rewards });

                for (const reward of rewards) {
                    store.commit('SET_REWARDS', {
                        currency: reward.currency,
                        data: reward
                    })
                }

                store.commit('SET_IS_SET_AMOUNT', true);
            }
        },

        setIsSetAmount(store, payload) {
            store.commit('SET_IS_SET_AMOUNT', payload);
        },

        async setStakingAmount({commit, dispatch, getters}, payload) {
            const { info } = payload;

            if (info) {
                let stakingAmount = "0";
                if (info.amount) {
                    stakingAmount = info.amount;
                } else {
                    console.log('error');
                }

                commit('SET_STAKING_AMOUNT', stakingAmount);
            }
        },

        async setUnstakingAmount({commit, dispatch, getters}, payload) {
            const { info } = payload;

            if (info) {
                let unstakingAmount = "0";
                if (info.unstakingAmount) {
                    unstakingAmount = info.unstakingAmount;
                } else {
                    console.log('error');
                }

                commit('SET_UNSTAKING_AMOUNT', unstakingAmount);
            }
        },

        async setRewardAmount({commit, dispatch, getters}, payload) {
            const { rewards } = payload;

            if (rewards) {
                let rewardAmount = '0';
                const rewardObject = _.find(rewards, (row, index) => {
                    return this.$app.$wallet.isSameAddress(row.currency, process.env.VUE_APP_TOKEN_ADDRESS);
                });

                if (rewardObject) {
                    rewardAmount = rewardObject.totalReward;
                }

                commit('SET_REWARD_AMOUNT', rewardAmount);
            }
        },

        async setCurPage({commit, dispatch, getters}, payload) {
            const userAddress = this.getters.getUserInfo.address;
            const baseURL = process.env.VUE_APP_API_ENDPOINT;
            const val = await axios.get(`${baseURL}/v1/account/${userAddress}/staking`);
            const activity = val.data.activity;
            const maxPage = activity.maxPage;
            const numOfActivities = activity.total;

            commit('SET_TOTAL_PAGE', maxPage);
            commit('SET_NUM_OF_ACTIVITIES', numOfActivities);
            if (payload > 0 && payload <= maxPage) {
                commit('SET_CUR_PAGE', payload);
                dispatch('setStakingItems', payload);
            }
        },

        setTotalPage({commit}, payload) {
            commit('SET_TOTAL_PAGE', payload);
        },

        async setStakingItems({commit, dispatch, getters}, payload) {
            const userAddress = this.getters.getUserInfo.address;
            const baseURL = process.env.VUE_APP_API_ENDPOINT;
            const val = await axios.get(`${baseURL}/v1/account/${userAddress}/staking?page=${payload}`);
            const activity = val.data.activity;
            const items = activity.items;

            commit('SET_STAKING_ITEMS', items);
        },

        async setTotalAmount(store, payload) {
            const baseURL = process.env.VUE_APP_API_ENDPOINT;
            const pathURL = 'v1/common/staking';
            const targetURL = `${baseURL}/${pathURL}`;
            const res = await axios.get(targetURL);

            if (res.status === 200) {
                let { totalReward, totalStaking, totalSupply, trixPrice } = res.data;

                store.commit('SET_TOTAL_SUPPLY', { totalSupply });
                store.commit('SET_TOTAL_STAKED', { totalStaked: totalStaking });
                store.commit('SET_REWARDS_DISTRIBUTED', { rewardsDistributed: totalReward });
                store.commit('SET_TRIX_PRICE', { trixPrice });
                store.commit('SET_UNSTAKING_PERIOD', { unstakingPeriod: 168 });
            }
            return [];
        },

        async setRewards(store) {
            const accountAddress = store.getters.getUserInfo.address;

            if (accountAddress) {
                const baseURL = process.env.VUE_APP_API_ENDPOINT;
                const pathURL = `v1/account/${accountAddress}/staking`;
                const targetURL = `${baseURL}/${pathURL}`;

                const res = await axios.get(targetURL);

                if (res.status === 200) {
                    const rewards = res.data.rewards;

                    for (const reward of rewards) {
                        store.commit('SET_REWARDS', {
                            currency: reward.currency,
                            data: reward
                        })
                    }
                }
            }
        },

        setIsSetPager(store, payload) {
            store.commit('SET_IS_SET_PAGER', payload);
        }
    },

    getters: {
        getStakingCommit(state) {
            return state.stakingCommit;
        },

        getStakingAmount(state) {
            return state.stakingAmount;
        },

        getUnstakingAmount(state) {
            return state.unstakingAmount;
        },

        getRewardAmount(state) {
            return state.rewardAmount;
        },

        getIsSetAmount(state) {
            return state.isSetAmount;
        },

        getCurPage(state) {
            return state.curPage;
        },

        getTotalPage(state) {
            return state.totalPage;
        },

        getStakingItems(state) {
            return state.stakingItems;
        },

        getTotalSupply(state, getters) {
            const rootVue = getters.getRootVue;
            const getSupportCurrency = getters.getSupportCurrency;
            const trix = _.find(getSupportCurrency, {name: 'TriumphX'});
            if (trix) {
                const totalSupply = rootVue.$bn.toMaxUnit(rootVue.$bn.toBN(state.totalSupply), trix.decimal, 4);
                return totalSupply;
            }
            return state.totalSupply;
        },

        getTotalStaked(state, getters) {
            const rootVue = getters.getRootVue;
            const getSupportCurrency = getters.getSupportCurrency;
            const trix = _.find(getSupportCurrency, {name: 'TriumphX'});
            if (trix) {
                const totalStaked = rootVue.$bn.toMaxUnit(rootVue.$bn.toBN(state.totalStaked), trix.decimal, 4);
                return totalStaked;
            }
            return state.totalStaked;
        },

        getRewardsDistributed(state, getters) {
            const rootVue = getters.getRootVue;
            const getSupportCurrency = getters.getSupportCurrency;
            const trix = _.find(getSupportCurrency, {name: 'TriumphX'});
            if (trix) {
                const rewardsDistributed = rootVue.$bn.toMaxUnit(rootVue.$bn.toBN(state.rewardsDistributed), trix.decimal, 4);
                return rewardsDistributed;
            }
            return state.rewardsDistributed;
        },

        getTrixPrice(state, getters) {
            const rootVue = getters.getRootVue;
            // const trixPrice = rootVue.$bn.toMaxUnit(rootVue.$bn.toBN(state.trixPrice), 1, 4);
            const trixPrice = String(state.trixPrice);
            return trixPrice.dprec(4);
        },

        getUnstakingPeriod(state, getters) {
            return state.unstakingPeriod;
        },

        getRewards(state) {
            return state.rewards;
        },

        getNumOfActivities(state) {
            return state.numOfActivities;
        },

        getIsSetPager(state) {
            return state.isSetPager;
        }
    }
}
