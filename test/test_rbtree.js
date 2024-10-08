import assert from 'assert';
import { makeTree } from '../src/rbtree.js';
import fc from 'fast-check';
import { describe, it } from 'mocha';

describe('rbtree', () => {
  const mutators = ['put', 'remove'];

  it('should return null for an empty tree', () => {
    const tree = makeTree();
    assert.equal(false, tree.contains(3));
    assert.equal(null, tree.get(3));
  });

  it('should allow item insertion', () => {
    const tree = makeTree();
    assert.equal(false, tree.put(3, 42));
    assert.equal(true, tree.contains(3));
    assert.equal(42, tree.get(3));
  });

  it('should allow item insertion on the condition the item does not exist', () => {
    const tree = makeTree();
    assert.equal(false, tree.put(3, 42));
    assert.equal(true, tree.putUnlessPresent(3, 23));
    assert.equal(42, tree.get(3));
  });

  it('should allow item updates', () => {
    const tree = makeTree();
    assert.equal(false, tree.put(3, 42));
    assert.equal(true, tree.put(3, 52));
    assert.equal(52, tree.get(3));
  });

  it('should find the next value', () => {
    const included_stuff = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tree = makeTree();

    for (const x of included_stuff) {
      tree.put(x, x);
    }

    assert.deepEqual(tree.successor(5), { key: 6, value: 6 });
  });

  it('should return null when there is no next value', () => {
    const included_stuff = [1, 2, 3];
    const tree = makeTree();

    for (const x of included_stuff) {
      tree.put(x, x);
    }

    assert.equal(tree.successor(5), null);
  });

  it('should return the first value when getting the next value for something smaller than the smallest', () => {
    const included_stuff = [7, 10, 12];
    const tree = makeTree();

    for (const x of included_stuff) {
      tree.put(x, x);
    }

    assert.deepEqual(tree.successor(5), { key: 7, value: 7 });
  });

  it('should return the last value when getting the previous value for something larger than the largest', () => {
    const included_stuff = [7, 10, 12];
    const tree = makeTree();

    for (const x of included_stuff) {
      tree.put(x, x);
    }
    assert.deepEqual(tree.predecessor(20), { key: 12, value: 12 });
  });

  it('should allow a custom comparator', () => {
    const makeKey = x => ({ key: x });

    const comparekeys = (a, b) => {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      } else {
        return 0;
      }
    };

    const tree = makeTree(comparekeys);
    assert.equal(false, tree.put(makeKey(1), 'A'));
    assert.equal(false, tree.put(makeKey(3), 'C'));
    assert.equal(false, tree.put(makeKey(2), 'B'));
    assert.equal(false, tree.put(makeKey(4), 'D'));
    assert.equal(false, tree.put(makeKey(5), 'E'));

    assert.equal('E', tree.get(makeKey(5)));
  });

  it('should contain everything that has been inserted', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (included_stuff, all_stuff) => {
        const tree = makeTree();
        for (const x of included_stuff) {
          tree.put(x, x);
        }

        for (const y of all_stuff) {
          if (included_stuff.includes(y)) {
            assert.equal(tree.contains(y), true);
          } else {
            assert.equal(tree.contains(y), false);
          }
        }
      })
    );
  });

  it('should always return the successor', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), values => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
        }

        const sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);
        const successors = {};
        for (let i = 1; i < sorted_stuff.length; i++) {
          successors[sorted_stuff[i - 1]] = sorted_stuff[i];
        }

        for (const x of values) {
          if (successors[x] != null) {
            assert.deepEqual(tree.successor(x), { value: successors[x], key: successors[x] });
          } else if (x < sorted_stuff[0]) {
            assert.deepEqual(tree.successor(x), { value: sorted_stuff[0], key: sorted_stuff[0] });
          } else {
            assert.equal(tree.successor(x), null);
          }
        }
      })
    );
  });

  it('should always return the predecessor', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), values => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
        }

        const sorted_stuff = Array.from(new Set(values)).sort((a, b) => b - a);
        const predecessors = {};
        for (let i = 1; i < sorted_stuff.length; i++) {
          predecessors[sorted_stuff[i - 1]] = sorted_stuff[i];
        }

        for (const x of values) {
          if (predecessors[x] != null) {
            assert.deepEqual(tree.predecessor(x), { value: predecessors[x], key: predecessors[x] });
          } else if (x > sorted_stuff[0]) {
            assert.deepEqual(tree.predecessor(x), { value: sorted_stuff[0], key: sorted_stuff[0] });
          } else {
            assert.equal(tree.predecessor(x), null);
          }
        }
      })
    );
  });

  it('should always return the first node for head', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), values => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
        }

        const sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);

        if (values.length > 0) {
          assert.deepEqual(tree.head(), { value: sorted_stuff[0], key: sorted_stuff[0] });
        } else {
          assert.equal(tree.head(), null);
        }
      })
    );
  });

  it('should always return the last node for tail', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), values => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
        }

        const sorted_stuff = Array.from(new Set(values)).sort((a, b) => b - a);

        if (values.length > 0) {
          assert.deepEqual(tree.tail(), { value: sorted_stuff[0], key: sorted_stuff[0] });
        } else {
          assert.equal(tree.tail(), null);
        }
      })
    );
  });

  it('should always traverse nodes in order', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), values => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
        }

        const sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);

        const keys = [];
        const actuals = [];
        tree.forEach((key, value) => {
          keys.push(key);
          actuals.push(value);
        });

        assert.deepEqual(keys, sorted_stuff);
        assert.deepEqual(actuals, sorted_stuff);
      })
    );
  });

  it('should find neighbors if stop is never called', () => {
    const tree = makeTree();
    for (let i = 0; i < 10; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(4, (key, value, direction, fns) => {
      const dirsign = direction > 0 ? 1 : direction < 0 ? -1 : 0;
      results.push([key, dirsign]);
    });

    assert.deepEqual(
      [
        [4, 0],
        [3, -1],
        [2, -1],
        [1, -1],
        [0, -1],
        [5, 1],
        [6, 1],
        [7, 1],
        [8, 1],
        [9, 1],
      ],
      results
    );
  });

  it('should allow removal and stoppage during neighbor iteration going left', () => {
    const tree = makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(3, (key, value, direction, fns) => {
      if (direction < 0) {
        fns.remove();
        fns.stop();
      }
    });

    tree.forEach((key, value, fns) => {
      results.push(key);
    });

    assert.deepEqual([0, 1, 3, 4], results);
  });

  it('should allow removal and stoppage during neighbor iteration going right', () => {
    const tree = makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(2, (key, value, direction, fns) => {
      if (direction > 0) {
        fns.remove();
        fns.stop();
      }
    });

    tree.forEach((key, value, fns) => {
      results.push(key);
    });

    assert.deepEqual([0, 1, 2, 4], results);
  });

  it('should allow us to remove all the nodes', () => {
    const tree = makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(3, (key, value, direction, fns) => {
      fns.remove();
    });

    assert.equal(tree.size(), 0);
  });

  it('should allow removal and stoppage during neighbor iteration at the found node', () => {
    const tree = makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(3, (key, value, direction, fns) => {
      fns.remove();
      fns.stop();
    });

    tree.forEach((key, value, fns) => {
      results.push(key);
    });

    assert.deepEqual([0, 1, 2, 4], results);
  });

  it('should iterate neighbors until stop is called', () => {
    const tree = makeTree();
    for (let i = 0; i < 10; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(4, (key, value, direction, fns) => {
      if (direction > 0 && value >= 6) {
        fns.stop();
      } else if (direction < 0 && value <= 3) {
        fns.stop();
      }
      results.push(key);
    });

    assert.deepEqual([4, 3, 5, 6], results);
  });

  it('should iterate neighbors of elements not present', () => {
    const tree = makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    const results = [];

    tree.forEachNeighbor(2.5, (key, value, direction, fns) => {
      results.push(key);
    });

    assert.deepEqual([2, 1, 0, 3, 4], results);
  });

  it('should allow stopping during iteration', () => {
    const tree = makeTree();
    tree.put(1, 1);
    tree.put(2, 2);
    tree.put(3, 3);

    const results = [];

    tree.forEach((key, value, fns) => {
      results.push(key);
      if (key == 2) {
        fns.stop();
      }
    });

    assert.deepEqual([1, 2], results);
  });

  it('should allow stopping and deletion during iteration', () => {
    const tree = makeTree();
    tree.put(1, 1);
    tree.put(2, 2);

    tree.forEach((key, value, fns) => {
      fns.remove();
      fns.stop();
    });

    assert.deepEqual({ value: 2, key: 2 }, tree.head());
  });

  it('should be balanced when it is empty', () => {
    const tree = makeTree();
    assert.equal(tree.isBalanced(), true);
  });

  it('should maintain balance after deletion', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (values, toDelete) => {
        const tree = makeTree();
        for (const x of values) {
          tree.put(x, x);
          assert.equal(tree.isBalanced(), true);
        }

        for (const x of toDelete) {
          tree.remove(x);
          assert.equal(tree.isBalanced(), true);
        }

        for (const x of values) {
          if (toDelete.includes(x)) {
            assert.equal(tree.contains(x), false);
          } else {
            assert.equal(tree.contains(x), true);
          }
        }
      })
    );
  });

  it('should maintain the size of the tree', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()).chain(vals =>
          fc.tuple(
            fc.constant(vals),
            fc.array(fc.constantFrom(...mutators), { minLength: vals.length, maxLength: vals.length })
          )
        ),
        ([values, ops]) => {
          const tree = makeTree();
          let count = 0;

          for (let i = 0; i < values.length; i++) {
            const x = values[i];
            const op = ops[i];
            if (op === 'put') {
              if (!tree.put(x, x)) {
                count++;
              }
            } else if (op === 'remove') {
              if (tree.remove(x)) {
                count--;
              }
            }
          }

          assert.equal(tree.size(), count);
        }
      )
    );
  });

  it('should allow deletion during iteration', () => {
    const tree = makeTree();
    const values = [1, 2, 3, 4, 5];
    values.forEach(v => tree.put(v, v));

    const results = [];

    tree.forEach((key, value, fns) => {
      results.push(key);
      if (key % 2 === 0) {
        fns.remove();
      }
    });

    const keys = [];
    tree.forEach((key, value) => keys.push(key));

    assert.deepEqual(results, [1, 2, 3, 4, 5]);
    assert.deepEqual(keys, [1, 3, 5]);
  });
});
