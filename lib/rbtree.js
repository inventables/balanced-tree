(function() {
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

    function nextNode(key) {
      var comparison;
      var currentNode = root;
      var candidate = null;

      if (!currentNode) {
        return null;
      }

      while (true) {
        var comparison = keyComparator(key, currentNode.key);
        if (comparison >= 0) {
          if (currentNode[RIGHT]) {
            currentNode = currentNode[RIGHT];
          } else {
            return candidate;
          }
        } else {
          candidate = currentNode;
          if (currentNode[LEFT]) {
            currentNode = currentNode[LEFT];
          } else {
            return candidate;
          }
        }
      }
    }

    function previousNode(key) {
      var comparison;
      var currentNode = root;
      var candidate = null;

      if (!currentNode) {
        return null;
      }

      while (true) {
        var comparison = keyComparator(key, currentNode.key);
        if (comparison <= 0) {
          if (currentNode[LEFT]) {
            currentNode = currentNode[LEFT];
          } else {
            return candidate;
          }
        } else {
          candidate = currentNode;
          if (currentNode[RIGHT]) {
            currentNode = currentNode[RIGHT];
          } else {
            return candidate;
          }
        }
      }
    }

    function firstNode() {
      var currentNode = root;
      if (!currentNode) {
        return null;
      }

      while (currentNode[LEFT]) {
        currentNode = currentNode[LEFT];
      }

      return currentNode;
    }

    function lastNode() {
      var currentNode = root;
      if (!currentNode) {
        return null;
      }

      while (currentNode[RIGHT]) {
        currentNode = currentNode[RIGHT];
      }

      return currentNode;
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
      x[RIGHT] = y[LEFT];
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
      x[LEFT] = y[RIGHT];
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
          if (y && y.color == RED) {
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
          if (y && y.color == RED) {
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

    function deleteNode(node) {
      throw new Exception("not yet implemented");
    }

    function iterateNodes(visit) {
      if (!root) { return; }

      let stack = [];
      let currentNode = root;
      let stopped = false;

      while (currentNode || stack.length > 0 && !stopped) {
        if (currentNode) {
          stack.unshift(currentNode);
          currentNode = currentNode[LEFT];
        } else {
          currentNode = stack.shift();
          right = currentNode[RIGHT];
          visit(currentNode, {
            remove: () => { deleteNode(currentNode) },
            stop: () => { stopped = true;  },
          });
          currentNode = right;
        }
      }
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

      successor: function(key) {
        var result = nextNode(key);
        if (result) {
          return { key: result.key, value: result.val };
        } else {
          return null;
        }
      },

      predecessor: function(key) {
        var result = previousNode(key);
        if (result) {
          return { key: result.key, value: result.val };
        } else {
          return null;
        }
      },

      contains: function(key) {
        var findResult = findNode(key);
        return Boolean(findResult.node && !findResult.direction);
      },

      head: function() {
        var result = firstNode();
        if (result) {
          return { key: result.key, value: result.val };
        } else {
          return null;
        }
      },

      tail: function() {
        var result = lastNode();
        if (result) {
          return { key: result.key, value: result.val };
        } else {
          return null;
        }
      },

      forEach: function(fn) {
        iterateNodes((node, fns) => fn(node.key, node.val, fns));
      },

      // Not yet implemented
      remove: function(key) {
        deleteNode(node);
      }
    }
  }

  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = {}
    }
    exports.makeTree = makeTree;
  }
  else if (typeof window !== 'undefined') {
    window.makeTree = makeTree;
  }
}).call(this);
