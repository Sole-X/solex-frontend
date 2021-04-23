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