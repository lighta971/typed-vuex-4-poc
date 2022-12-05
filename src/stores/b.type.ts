import type {
  AppActionHandler,
  AppGetter,
  AppMutation,
  MakeActionContext,
  MakeModule,
} from "@/store.type";

export interface BState {
  distance: number;
}

export interface BGetters {
  jump: number;
}

export interface BMutations {
  walk: () => void;
}

export interface BActions {
  sleep: () => Promise<void>;
}

// ------------------

type BActionContext = MakeActionContext<
  BState,
  BMutationTree,
  BActionTree,
  BGetterTree
>;

export type BActionTree = {
  [K in keyof BActions]: AppActionHandler<BActionContext, BActions[K]>;
};

export type BGetterTree = {
  [K in keyof BGetters]: AppGetter<BState, BGetterTree, BGetters[K]>;
};

export type BMutationTree = {
  [K in keyof BMutations]: AppMutation<BState, BMutations[K]>;
};

export type BModule = MakeModule<
  BState,
  BGetterTree,
  BMutationTree,
  BActionTree
>;
