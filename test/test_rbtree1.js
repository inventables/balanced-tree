var assert = require('assert');
var rbtree = require('../lib/rbtree1.js');

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
