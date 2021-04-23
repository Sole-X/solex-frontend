export const getDefaultState = () => ({
  activateCount: 0
})

export default {
  state() {
    return getDefaultState()
  },
  mutations: {
    SET_ACTIVATE_COUNT(state, payload) {
      state.activateCount = payload
    }
  },
  actions: {
    showModal({ commit, state }, { component, params }) {
      this.$app.$_ModalMixin_showModal(component, params)
      commit('SET_ACTIVATE_COUNT', state.activateCount + 1)
    },

    closeModal({ commit, state }) {
      commit('SET_ACTIVATE_COUNT', state.activateCount - 1)
    },

    showAlert({ dispatch }, params) {
      dispatch('showModal', {
        component: 'DialogModal',
        params
      })
    },

    openTxSuccessModal({dispatch}, payload) {
      dispatch('showModal', {
        component: 'TxResultModal',
        params: payload
      })
    }
  },
  getters: {
    getModalStatus(state) {
      return {
        activateCount: state.activateCount
      }
    }
  }
}
