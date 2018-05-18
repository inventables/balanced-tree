const assert = require('assert');
const rbtree = require('../lib/rbtree1.js');
const { gen } = require('testcheck');
require('mocha-testcheck').install();


describe('rbtree1', function() {
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

  it('should pass this test', () => {
    const included_stuff = [ -3, 0, 1, -1, -2 ];
    const tree = rbtree.makeTree();
    debugger;
    for (let x of included_stuff) {
      tree.put(x, x);
    }

    assert.equal(tree.contains(-1), true);

  });

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

  it('should allow a custom comparator', function() {
    var makeKey = function(x) {
      return { key: x };
    }

    var compareKeys = function(a, b) {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      } else {
        return 0;
      }
    }


    var tree = rbtree.makeTree(compareKeys);
    assert.equal(false, tree.put(makeKey(1), 'A'));
    assert.equal(false, tree.put(makeKey(3), 'C'));
    assert.equal(false, tree.put(makeKey(2), 'B'));
    assert.equal(false, tree.put(makeKey(4), 'D'));
    assert.equal(false, tree.put(makeKey(5), 'E'));

    assert.equal('E', tree.get(makeKey(5)));
  })
})
