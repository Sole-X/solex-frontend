const getDefaultState = () => {
  return {
    txQueue: [],
  };
};

export default {
  state() {
    return getDefaultState();
  },
  mutations: {
    SET_TX_QUEUE(state, payload) {
      state.txQueue = payload;
    },
  },
  getters: {
    getTxQueue(state) {
      return state.txQueue;
    },
  },
};
