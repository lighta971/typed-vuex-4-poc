import type {
  AppActionHandler,
  AppGetter,
  AppMutation,
  MakeActionContext,
  MakeModule,
} from "@/store.type";

export interface AState {
  count: number;
}

export interface AGetters {
  squaredCount: number;
}

export interface AMutations {
  increment: (n: number) => void;
}

export interface AActions {
  saveCount: () => Promise<void>;
}

// ------------------

type AActionContext = MakeActionContext<
  AState,
  AMutationTree,
  AActionTree,
  AGetterTree
>;

export type AActionTree = {
  [K in keyof AActions]: AppActionHandler<AActionContext, AActions[K]>;
};

export type AGetterTree = {
  [K in keyof AGetters]: AppGetter<AState, AGetterTree, AGetters[K]>;
};

export type AMutationTree = {
  [K in keyof AMutations]: AppMutation<AState, AMutations[K]>;
};

export type AModule = MakeModule<
  AState,
  AGetterTree,
  AMutationTree,
  AActionTree
>;
