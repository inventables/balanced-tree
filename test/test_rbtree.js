const assert = require('assert');
const rbtree = require('../lib/rbtree.js');
const { gen } = require('testcheck');
require('mocha-testcheck').install();


describe('rbtree', function() {
  
  const mutators = ['put', 'remove'];

  it('should return null for an empty tree', function() {
    var tree = rbtree.makeTree();
    assert.equal(false, tree.contains(3));
    assert.equal(null, tree.get(3));
  });

  it('should allow item insertion', function() {
    var tree = rbtree.makeTree();
    assert.equal(false, tree.put(3, 42))
    assert.equal(true, tree.contains(3));
    assert.equal(42, tree.get(3));
  });


  it('should allow item insertion on the condition the item does not exist', function() {
    var tree = rbtree.makeTree();
    assert.equal(false, tree.put(3, 42))
    assert.equal(true, tree.putUnlessPresent(3, 23));
    assert.equal(42, tree.get(3));
  });

  it('should allow item updates', function() {
    var tree = rbtree.makeTree();
    assert.equal(false, tree.put(3, 42))
    assert.equal(true, tree.put(3, 52));
    assert.equal(52, tree.get(3));
  });

  it('should find the next value', () => {
    const included_stuff = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }

    assert.deepEqual(tree.successor(5), { key: 6, value: 6});
  });

  it('should return null when there is no next value', () => {
    const included_stuff = [ 1, 2, 3];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }

    assert.equal(tree.successor(5), null);
  });


  it('should return the first value when getting the next value for something smaller than the smallest', () => {
    const included_stuff = [ 7, 10, 12];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }

    assert.deepEqual(tree.successor(5), {key: 7, value: 7});
  });

  it('should return the last value when getting the previous value for something larger than the largest', () => {
    const included_stuff = [ 7, 10, 12];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }
    assert.deepEqual(tree.predecessor(20), {key: 12, value: 12});
  });


  it('should allow a custom comparator', function() {
    var makeKey = function(x) {
      return { key: x };
    }

    var comparekeys = function(a, b) {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      } else {
        return 0;
      }
    }


    var tree = rbtree.makeTree(comparekeys);
    assert.equal(false, tree.put(makeKey(1), 'A'));
    assert.equal(false, tree.put(makeKey(3), 'C'));
    assert.equal(false, tree.put(makeKey(2), 'B'));
    assert.equal(false, tree.put(makeKey(4), 'D'));
    assert.equal(false, tree.put(makeKey(5), 'E'));

    assert.equal('E', tree.get(makeKey(5)));
  })

  check.it('should contain everything that has been inserted', gen.array(gen.int), gen.array(gen.int), (included_stuff, all_stuff) => {
    const tree = rbtree.makeTree();
    for (let x of included_stuff) {
      tree.put(x, x);
    }

    for (let y of all_stuff) {
      if (included_stuff.includes(y)) {
        assert.equal(tree.contains(y), true);
      } else {
        assert.equal(tree.contains(y), false);
      }
    }
  })

  check.it('should always return the successor', gen.array(gen.int), (values) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
    }

    let sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);
    let successors = {}
    for (let i = 1; i < sorted_stuff.length; i++) {
      successors[sorted_stuff[i - 1]] = sorted_stuff[i];
    }

    for (let x of values) {
      if (successors[x] != null) {
        assert.deepEqual(tree.successor(x), { value: successors[x], key: successors[x]})
      } else if (x < sorted_stuff[0]) {
        assert.deepEqual(tree.successor(x), { value: sorted_stuff[0], key: sorted_stuff[0]})
      } else {
        assert.equal(tree.successor(x), null);
      }
    }
  });

  check.it('should always return the predecessor', gen.array(gen.int), (values) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
    }

    let sorted_stuff = Array.from(new Set(values)).sort((a, b) => b - a);
    let predecessors = {}
    for (let i = 1; i < sorted_stuff.length; i++) {
      predecessors[sorted_stuff[i - 1]] = sorted_stuff[i];
    }

    for (let x of values) {
      if (predecessors[x] != null) {
        assert.deepEqual(tree.predecessor(x), { value: predecessors[x], key: predecessors[x]})
      } else if (x > sorted_stuff[0]) {
        assert.deepEqual(tree.predecessor(x), { value: sorted_stuff[0], key: sorted_stuff[0]})
      } else {
        assert.equal(tree.predecessor(x), null);
      }
    }
  });


  check.it('should always return the first node for head', gen.array(gen.int), (values) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
    }

    let sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);

    if (values.length > 0) {
      assert.deepEqual(tree.head(), { value: sorted_stuff[0], key: sorted_stuff[0]})
    } else {
      assert.equal(tree.head(), null);
    }
  });

  check.it('should always return the last node for tail', gen.array(gen.int), (values) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
    }

    let sorted_stuff = Array.from(new Set(values)).sort((a, b) => b - a);

    if (values.length > 0) {
      assert.deepEqual(tree.tail(), { value: sorted_stuff[0], key: sorted_stuff[0]})
    } else {
      assert.equal(tree.tail(), null);
    }
  });

  check.it('should always traverse nodes in order', gen.array(gen.int), (values) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
    }

    let sorted_stuff = Array.from(new Set(values)).sort((a, b) => a - b);

    keys = []
    values = []
    tree.forEach((key, value) => { keys.push(key); values.push(value) });

    assert.deepEqual(keys, sorted_stuff);
    assert.deepEqual(values, sorted_stuff);

  });
  
  it('should find neighbors if stop is never called', function () {
    const tree = rbtree.makeTree();
    for (let i = 0; i < 10; i++) {
      tree.put(i, i);
    }

    results = [];
    
    tree.forEachNeighbor(4,
      (key, value, direction, fns) => {
        var dirsign;
        if (direction > 0) {
          dirsign = 1;
        } else if (direction < 0) {
          dirsign = -1;
        } else {
          dirsign = 0;
        }
        results.push([key, dirsign]);
    });

    assert.deepEqual([
      [4, 0],
      [3, -1], [2, -1], [1, -1], [0, -1],
      [5, 1], [6, 1], [7, 1], [8, 1], [9, 1]],
      results);
  });
  
  it('should iterate neighbors until stop is called', function () {
    const tree = rbtree.makeTree();
    for (let i = 0; i < 10; i++) {
      tree.put(i, i);
    }

    results = [];
    
    tree.forEachNeighbor(4,
      (key, value, direction, fns) => {
        if (direction > 0 && value >= 6) {
          fns.stop();
        } else if (direction < 0 && value <= 3) {
          fns.stop();
        }
        results.push(key);
    });

    assert.deepEqual([4, 3, 5, 6], results);
  });

  it('should iterate neighbors of elements not present', function () {
    const tree = rbtree.makeTree();
    for (let i = 0; i < 5; i++) {
      tree.put(i, i);
    }

    results = [];
    
    tree.forEachNeighbor(2.5,
      (key, value, direction, fns) => {
        results.push(key);
    });

    assert.deepEqual([2, 1, 0, 3, 4], results);
  });

  it('should allow stopping during iteration', function() {
    const tree = rbtree.makeTree();
    tree.put(1, 1);
    tree.put(2, 2);
    tree.put(3, 3);

    results = [];

    tree.forEach((key, value, fns) => {
      results.push(key);
      if (key == 2) {
        fns.stop()
      }
    })

    assert.deepEqual([1,2], results);
  });
  
  it('should allow stopping and deletion during iteration', function() {
    const tree = rbtree.makeTree();
    tree.put(1, 1);
    tree.put(2, 2);

    tree.forEach((key, value, fns) => {
      fns.remove();
      fns.stop();
    });

    assert.deepEqual({value: 2, key: 2}, tree.head());
  });

  it('should be balanced when it is empty', function() {
    const tree = rbtree.makeTree();
    assert.equal(tree.isBalanced(), true);
  });

  check.it('should maintain balance after deletion', gen.array(gen.int), gen.array(gen.int), (values, toDelete) => {
    const tree = rbtree.makeTree();
    for (let x of values) {
      tree.put(x, x);
      assert.equal(tree.isBalanced(), true)
    }

    for (let x of toDelete) {
      tree.remove(x);
      assert.equal(tree.isBalanced(), true);
    }

    for (let x of values) {
      if (toDelete.includes(x)) {
        assert.equal(tree.contains(x), false);
      } else {
        assert.equal(tree.contains(x), true);
      }
    }
  });
  
  check.it('should maintain the size of the tree',
    gen.array(gen.int).then((vals) => [vals, gen.array(gen.oneOf(mutators), {size: vals.length})]), (valsAndOps) => {

    const tree = rbtree.makeTree();
    let count = 0;
    const values = valsAndOps[0];
    const ops = valsAndOps[1];
    
    for (let x of values) {
      if (x === 'put') {
        if (!tree.put(x, x)) {
          count++;
        }
      } else if (x === 'remove') {
        if (tree.remove(x)) {
          count--;
        }
      }
    }
    
    assert.equal(tree.size(), count);
  });

  it('should allow deletion during iteration', function() {
    const tree = rbtree.makeTree();
    tree.put(1, 1);
    tree.put(2, 2);
    tree.put(3, 3);

    results = [];

    tree.forEach((key, value, fns) => {
      if (key == 2) {
        fns.remove()
        tree.forEach((key) => { results.push(key); });
      }
    })

    assert.deepEqual([1,3], results);
  });


})
