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


  })

})


// var assert = require('assert');
// var geoprizm = require('../lib/geoprizm.js');
//
// describe('intersection', function() {
//   it('should', function() {
//     assert.equal(2, 2);
//   });
//
//   it ('should find no intersections for an empty set', function() {
//     segments = [[{x:0, y:0}, {x:0, y:1}]]
//     var a = geoprizm.findIntersections([], segments);
//     var b = geoprizm.findIntersections(segments, []);
//     assert.deepEqual([], a);
//     assert.deepEqual([], b);
//   });
//
//   it ('should find an intersection between sets', function() {
//     seta = [[{x:0, y: 1}, {x: 2, y: 1}]];
//     setb = [[{x:1, y: 0}, {x: 1, y: 2}]];
//
//     expected = {
//       segments: [seta[0], setb[0]],
//       point: {x: 1, y: 1}
//     };
//
//     var actual = geoprizm.findIntersections(seta, setb);
//
//     assert.deepEqual(expected, actual);
//   });
// })
