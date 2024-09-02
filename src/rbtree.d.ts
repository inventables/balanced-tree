export interface TreeNode<K, V> {
  key: K;
  value: V;
}

export interface IterationFunctions {
  remove: () => void;
  stop: () => void;
}

export interface RBTree<K, V> {
  put(key: K, val: V): boolean;
  putUnlessPresent(key: K, val: V): boolean;
  get(key: K): V | null;
  successor(key: K): TreeNode<K, V> | null;
  predecessor(key: K): TreeNode<K, V> | null;
  contains(key: K): boolean;
  head(): TreeNode<K, V> | null;
  tail(): TreeNode<K, V> | null;
  forEach(fn: (key: K, val: V, fns: IterationFunctions) => void): void;
  forEachNeighbor(key: K, fn: (key: K, val: V, direction: number, fns: IterationFunctions) => void): void;
  remove(key: K): boolean;
  size(): number;
  isBalanced(): boolean;
}

export type Comparator<K> = (a: K, b: K) => number;

export function makeTree<K, V>(keyComparator?: Comparator<K>): RBTree<K, V>;