import type { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import type { AugmentedStore } from "./store.type";
import { aStore } from "./stores/a";
import type { AState } from "./stores/a.type";
import { bStore } from "./stores/b";
import type { BState } from "./stores/b.type";

export interface RootState {
  a: AState;
  b: BState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export const store: AugmentedStore = createStore<RootState>({
  modules: {
    a: aStore,
    b: bStore,
  },
});

// define your own `useStore` composition function
export function useStore(): AugmentedStore {
  return baseUseStore(key);
}
