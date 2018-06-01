const assert = require('assert');
const rbtree = require('../lib/rbtree.js');
const { gen } = require('testcheck');
require('mocha-testcheck').install();


describe('rbtree', function() {
  it('should', function() {
    assert.equal(2, 2);
  });


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

  it('should pass this test', () => {
    const included_stuff = [ 0, 2];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }

    assert.deepEqual(tree.successor(0), { key: 2, value: 2});
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
  })


})
