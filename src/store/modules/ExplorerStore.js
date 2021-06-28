import ActivityEventTypes from '@/constants/ActivityEventTypes';
import { ActivityRow, RankingRow } from '@/model/ExplorerModel';

export const getDefaultState = () => ({
  allActivities: {
    list: [],
    page: 1,
    maxPage: 1,
    total: 0,
  },
  allRanks: {
    list: [],
    page: 1,
    maxPage: 1,
    total: 0,
  },
});

export default {
  state() {
    return getDefaultState();
  },
  mutations: {
    SET_ALL_ACTIVITIES(state, payload) {
      state.allActivities = {
        ...state.allActivities,
        ...payload,
      };
    },

    SET_ALL_RANKS(state, payload) {
      state.allRanks = {
        ...state.allRanks,
        ...payload,
      };
    },
  },
  actions: {
    async setAllActivities({ commit }, payload = {}) {
      // NFT 관련 활동 내역만 받기
      const res = await this.$app.$http.get('getAllActivities', {
        urlQuery: {
          status: _.filter(ActivityEventTypes, (type) => {
            return type.isNft;
          })
            .map((row) => row.name)
            .join(','),
          ...(payload.query || {}),
        },
      });

      if (res.success) {
        const newState = {
          list: _.map(res.info.items, (row) => {
            return new ActivityRow(row);
          }),
          page: Number(res.info.currentPage),
          maxPage: res.info.maxPage,
          total: res.info.total,
        };

        commit('SET_ALL_ACTIVITIES', newState);
      }

      return res;
    },

    async setAllRanks({ commit }, payload = {}) {
      const res = await this.$app.$http.get('getAllRanks', {
        urlQuery: payload.query || {},
      });

      if (res.success) {
        const newState = {
          list: _.map(res.info.items, (row) => {
            return new RankingRow(row);
          }),
          page: Number(res.info.currentPage),
          maxPage: res.info.maxPage,
          total: res.info.total,
        };

        commit('SET_ALL_RANKS', newState);
      }

      return res;
    },
  },
  getters: {
    getAllActivities(state) {
      return state.allActivities;
    },

    getAllRanks(state) {
      return state.allRanks;
    },
  },
};
