import type {
  AActionTree,
  AGetterTree,
  AModule,
  AMutationTree,
  AState,
} from "./a.type";

const state: AState = {
  count: 0,
};

const getters: AGetterTree = {
  squaredCount(state) {
    return state.count * state.count;
  },
};

const mutations: AMutationTree = {
  increment(state, n: number) {
    state.count += n;
  },
};

const actions: AActionTree = {
  saveCount() {
    return Promise.resolve();
  },
};

export const aStore: AModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
