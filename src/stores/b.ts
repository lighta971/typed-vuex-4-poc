import type {
  BActionTree,
  BGetterTree,
  BModule,
  BMutationTree,
  BState,
} from "./b.type";

const state: BState = {
  distance: 0,
};

const getters: BGetterTree = {
  jump(state) {
    return state.distance * state.distance;
  },
};

const mutations: BMutationTree = {
  walk(state) {
    state.distance++;
  },
};

const actions: BActionTree = {
  sleep() {
    return Promise.resolve();
  },
};

export const bStore: BModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
