var exports = module.exports = {}

function makeTree(keyComparator) {

  var LEFT = 'left';
  var RIGHT = 'right';
  var RED = 'red';
  var BLACK = 'black';
  var root = null;

  if (!keyComparator) {
    keyComparator = function(a, b) {
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  function makeNode(key, val) {
    return {
      key: key,
      val: val,
      left: null,
      right: null,
      parent: null,
      color: RED
    }
  }


  function findNode(key) {
    var nextNode;
    var comparison;
    var currentNode = root;

    if (!currentNode) {
      return {
        node: null,
        direction: null
      }
    }

    while (true) {
      var comparison = keyComparator(key, currentNode.key);
      if (comparison < 0) {
        var nextNode = currentNode[LEFT];
        if (!nextNode) {
          return {
            node: currentNode,
            direction: LEFT
          };
        }
      } else if (comparison > 0) {
        nextNode = currentNode[RIGHT];
        if (!nextNode) {
          return {
            node: currentNode,
            direction: RIGHT
          }
        }
      } else {
        return {
          node: currentNode,
          direction: null
        }
      }
      currentNode = nextNode;
    }
  }

  // Return the inserted node, or null if the key already existed
  function unbalancedInsert(key, val) {
    var findResult = findNode(key);
    if (!findResult.node) {
      root = makeNode(key, val);
      return root;
    }

    if (findResult.direction) {
      var newNode = makeNode(key, val);
      var parent = findResult.node;
      parent[findResult.direction] = newNode;
      newNode.parent = parent;
      return newNode;
    }

    findResult.node.val = val;
    return null;
  }

  function leftRotate(x) {
    var y = x[RIGHT];
    x[RIGHT] = y[RIGHT];
    if (y[LEFT]) {
      y[LEFT].parent = x;
    }
    if (x.parent) {
      y.parent = x.parent;
      if (x == x.parent[LEFT]) {
        x.parent[LEFT] = y;
      } else {
        x.parent[RIGHT] = y;
      }
    } else {
      root = y;
      y.parent = null;
    }
    y[LEFT] = x;
    x.parent = y;
  }

  function rightRotate(x) {
    var y = x[LEFT];
    x[LEFT] = y[LEFT];
    if (y[RIGHT]) {
      y[RIGHT].parent = x;
    }
    if (x.parent) {
      y.parent = x.parent;
      if (x == x.parent[RIGHT]) {
        x.parent[RIGHT] = y;
      } else {
        x.parent[LEFT] = y;
      }
    } else {
      root = y;
      y.parent = null;
    }
    y[RIGHT] = x;
    x.parent = y;
  }

  function balancedInsert(key, val) {
    var newNode = unbalancedInsert(key, val);
    var x, y;
    if (!newNode) {
      return null;
    }

    x = newNode;
    while (x != root && x.parent.color == RED)  {
      if (x.parent == x.parent.parent[LEFT]) {
        y = x.parent.parent[RIGHT];
        if (y.color == RED) {
          y.color = BLACK;
          x.parent.color = BLACK;
          x = x.parent.parent;
          x.color = RED;
        } else {
          if (x == x.parent[RIGHT]) {
            x = x.parent;
            leftRotate(x);
          }
          x.parent.color = BLACK;
          x.parent.parent.color = RED;
          rightRotate(x.parent.parent);
        }
      } else {
        // same as above but with left and right exchanged
        y = x.parent.parent[LEFT];
        if (y.color == RED) {
          y.color = BLACK;
          x.parent.color = BLACK;
          x = x.parent.parent;
          x.color = RED;
        } else {
          if (x == x.parent[LEFT]) {
            x = x.parent;
            rightRotate(x);
          }
          x.parent.color = BLACK;
          x.parent.parent.color = RED;
          leftRotate(x.parent.parent);
        }
      }
    }

    root.color = BLACK;
    return newNode;
  }


  return {
    put: function(key, val) {
      return !balancedInsert(key, val);
    },

    get: function(key) {
      var findResult = findNode(key);
      if (findResult.direction || !findResult.node) {
        return null;
      }
      return findResult.node.val;
    },

    contains: function(key) {
      var findResult = findNode(key);
      return Boolean(findResult.node && !findResult.direction);
    }
  }
}

exports.makeTree = makeTree;
