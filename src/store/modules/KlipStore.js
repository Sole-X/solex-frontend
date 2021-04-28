import { prepare, request, getResult } from 'klip-sdk';

export const getDefaultState = () => ({
    isAccessing: false,
    requestKey: null
})

export default {
    state() {
        return getDefaultState();
    },

    mutations: {
        SET_REQUEST_KEY(state, payload) {
            state.requestKey = payload.requestKey;
        },

        SET_IS_ACCESSING(state, payload) {
            state.isAccessing = payload.isAccessing;
        }
    },

    actions: {
        async prepareKlip(store, payload) {
            const {type, body} = payload;
            const res = await prepare[type]({
                ...body
            });

            if (res.err) {
                // 에러 처리
            } else if (res.request_key) {
                this.$app.$eventBus.$emit('prepareKlipSuccess', res.request_key);
            }
        },

        requestKlip(store, payload) {
            const {requestKey} = payload;

            if (!requestKey) {
                // key를 받지 못하였을 때.
                return;
            }

            request(requestKey);
            this.$app.$eventBus.$emit('requestKlipSuccess');
        },

        getResultKlip(store, payload) {
            const {requestKey} = payload;

            if (!requestKey) {
                return;
            }

            const result = getResult(requestKey);
        },

        async pollingUntilGetResult(store, payload) {
            const self = this;
            const {requestKey, callback} = payload;

            if (!requestKey) {
                return;
            }

            return new Promise((resolve, reject) => {
                let cnt = 0;
                let polling = setInterval(async () => {
                    if (cnt > 60 * 5) {
                        clearInterval(polling);
                        resolve({
                            success: false,
                            error: new Error('polling_timeout')
                        });
                    }

                    const res = await getResult(requestKey);

                    if (res && res.status === 'completed' && res.request_key === requestKey) {
                        clearInterval(polling);
                        self.$app.$eventBus.$emit('klipRequestFinished');
                        resolve({
                            success: true,
                            data: res
                        });
                    }

                    callback && callback({ cnt, res });

                    cnt += 1;
                }, 1000);
            })
        },

        executeKlipWeb2App(store, payload) {
            const type = payload.type || null;
            const requestKey = payload.requestKey || null;

            if (type === 'connect') {
                if (requestKey) {
                    store.commit('SET_IS_ACCESSING', {isAccessing: true});
                    store.dispatch('showModal', {
                        component: 'KlipLoginModal',
                        params: {

                        }
                    })
                    store.commit('SET_REQUEST_KEY', {requestKey: requestKey});

                    sessionStorage.setItem('wallet_info', JSON.stringify({
                        platform: 'klip',
                        request_key: requestKey,
                        created_at: Date.now()
                    }));
                } else {
                    Log('err', 'There is not a requestKey.');
                }
            }
        }
    },

    getters: {
        getRequestKey(state) {
            return state.requestKey;
        },

        getIsAccessing(state) {
            return state.isAccessing;
        }
    }
}