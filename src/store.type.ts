import type { ActionContext, Module, Store, StoreOptions } from "vuex";
import type { RootState } from "./store";
import type {
  AActionTree,
  AGetterTree,
  AModule,
  AMutationTree,
} from "./stores/a.type";
import type { BActionTree, BGetterTree, BMutationTree } from "./stores/b.type";

export type MakeModule<
  S extends Record<string, any>,
  GetterTree extends Record<string, (...args: any) => any>,
  MutationTree extends Record<string, unknown>,
  ActionTree extends Record<string, unknown>
> = Omit<Module<S, RootState>, "getters" | "actions" | "mutations"> & {
  getters?: GetterTree;
  actions?: ActionTree;
  mutations?: MutationTree;
};

type ActionGetters<GetterTree extends Record<string, any>> = {
  [K in keyof GetterTree]: ReturnType<GetterTree[K]>;
};

export type MakeActionContext<
  S,
  MutationTree,
  ActionTree,
  GetterTree extends Record<string, any>
> = Omit<
  ActionContext<S, RootState>,
  "commit" | "dispatch" | "getters" | "rootGetters"
> & {
  commit: MakeCommmitType<MutationTree>;
  dispatch: MakeCommmitType<ActionTree>;
  getters: ActionGetters<GetterTree>;
  rootGetters: AppRootGetters;
};

export type AppGetter<
  S,
  GetterTree extends Record<string, any>,
  ReturnValue = never
> = (
  state: S,
  getters: ActionGetters<GetterTree>,
  rootState: RootState,
  rootGetters: AppRootGetters
) => ReturnValue;

export type AppMutation<
  S,
  Mutation extends (...args: any) => any = () => any
> = (state: S, ...args: Parameters<Mutation>) => any;

export type AppStoreOptions<S> = Omit<StoreOptions<S>, "modules"> & {
  modules?: AppModuleTree<S>;
};

type doNamespace<N, namespace> = `${string & namespace}/${string & N}`;

type newStoreGetters<
  Getters extends { [key: string]: any },
  namespace extends string
> = {
  [K in keyof Getters as doNamespace<K, namespace>]: ReturnType<Getters[K]>;
};
type newStoreMutations<
  Getters extends { [key: string]: any },
  namespace extends string
> = {
  [K in keyof Getters as doNamespace<K, namespace>]: Getters[K];
};

export type AppActionHandler<
  ActionContext,
  CustomHandler extends (...args: any) => any = (...args: any) => any
> = (
  this: AugmentedStore,
  context: ActionContext,
  ...args: Parameters<CustomHandler>
) => ReturnType<CustomHandler>;

interface MakeCommmitType<CommitTree> {
  <K extends keyof CommitTree>(
    type: K,
    ...args: LastTuple<
      Parameters<
        CommitTree[K] extends (...args: any) => any ? CommitTree[K] : any
      >
    >
  ): CommitTree[K] extends (...args: any) => infer R ? R : any;
}

type LastTuple<T extends any[]> = T extends [any, ...infer Bottom]
  ? Bottom
  : any[];

type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

interface AppModuleTree<R> {
  [key: string]: Module<any, R> | AModule;
}

// ------------VUEX STORE TYPE IS REWRITEN HERE--------------------

type AppRootGetters = newStoreGetters<AGetterTree, "a"> &
  newStoreGetters<BGetterTree, "b">;

type AllMutations = newStoreMutations<AMutationTree, "a"> &
  newStoreMutations<BMutationTree, "b">;

type AllActions = ExpandRecursively<
  newStoreMutations<AActionTree, "a"> & newStoreMutations<BActionTree, "b">
>;

export type AugmentedStore = Omit<
  Store<RootState>,
  "getters" | "commit" | "dispatch"
> & {
  getters: AppRootGetters;
  commit<K extends keyof AllMutations>(
    type: K,
    ...args: LastTuple<Parameters<AllMutations[K]>>
  ): void;
  dispatch<K extends keyof AllActions>(
    type: K,
    ...args: LastTuple<Parameters<AllActions[K]>>
  ): ReturnType<AllActions[K]>;
};
