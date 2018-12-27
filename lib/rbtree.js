(function() {
  function makeTree(keyComparator) {

    var LEFT = 'left';
    var RIGHT = 'right';
    var RED = 'red';
    var BLACK = 'black';
    var root = null;
    var size = 0;

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
        isNull: false,
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

    function sucessorNodeForKey(key) {
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

    function predecessorNodeForKey(key) {
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

    function maxNode(node) {
      var currentNode = node;
      if (!currentNode) {
        return null;
      }

      while (currentNode[RIGHT]) {
        currentNode = currentNode[RIGHT];
      }

      return currentNode;
    }

    function minNode(node) {
      var currentNode = node;
      if (!currentNode) {
        return null;
      }

      while (currentNode[LEFT]) {
        currentNode = currentNode[LEFT];
      }

      return currentNode;
    }

    function firstNode() {
      return minNode(root);
    }

    function lastNode() {
      return maxNode(root);
    }

    // Return the inserted node, or null if the key already existed
    function unbalancedInsert(key, val, checkExistence) {
      var findResult = findNode(key);
      if (!findResult.node) {
        root = makeNode(key, val);
        size++;
        return root;
      }

      if (findResult.direction) {
        var newNode = makeNode(key, val);
        var parent = findResult.node;
        parent[findResult.direction] = newNode;
        newNode.parent = parent;
        size++;
        return newNode;
      }
      
      if (!checkExistence) {
        findResult.node.val = val;
      }

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

    function balancedInsert(key, val, checkExistence) {
      var newNode = unbalancedInsert(key, val, checkExistence);
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


    // See p274 of CLR (1990) for an explanation of this algorithm. This implementation is a little more involved to handle nulls
    // Node may be null
    // Parent is the parent of the deleted node
    function fixupDeletion(node, parent) {
      while (node != root && (node == null || node.color == BLACK)) {
        
        // Every time we reassign node, we either continue to the next loop iteration or break out of the loop
        if (node) {
          parent = node.parent;
        }
        if (node == parent[LEFT]) {
          let sibling = parent[RIGHT];
          if (sibling && sibling.color == RED) {
            // Case 1 - next step is to convert into case 2, 3, or 4
            sibling.color = BLACK;
            parent.color = RED;
            leftRotate(parent);
            sibling = parent[RIGHT];
          }
          if (sibling && ((!sibling[LEFT] && !sibling[RIGHT]) ||
            (sibling[LEFT] && sibling[RIGHT] && sibling[LEFT].color == BLACK && sibling[RIGHT].color == BLACK))) {
            // Case 2 - next step is to recolor the sibling, move the target node up and (maybe) continue the loop
            sibling.color = RED;
            node = parent;
            continue;
          }
          if (sibling && (!sibling[RIGHT] || sibling[RIGHT].color == BLACK)) {
            // Case 3 - next step is to transform this into case 4
            if (sibling[LEFT]) {
              sibling[LEFT].color = BLACK;
            }
            sibling.color = RED;
            rightRotate(sibling);
            sibling = parent[RIGHT];
          }
          if (sibling && sibling[RIGHT]) {
            // Case 4 - next step is to fixup and terminate
            sibling.color = parent.color;
            parent.color = BLACK;
            sibling[RIGHT].color = BLACK;
            leftRotate(parent);
            node = root;
          } else {
            node = parent;
            continue;
          }
        } else {
          // same as above but with left and right reversed
          let sibling = parent[LEFT];
          if (sibling.color == RED) {
            // Case 1 - next step is to convert into case 2, 3, or 4
            sibling.color = BLACK;
            parent.color = RED;
            rightRotate(parent);
            sibling = parent[LEFT];
          }
          
          if (sibling && ((!sibling[LEFT] && !sibling[RIGHT]) ||
              (sibling[LEFT] && sibling[RIGHT] && sibling[LEFT].color == BLACK && sibling[RIGHT].color == BLACK))) {
            // Case 2 - next step is to recolor the sibling, move the target node up and (maybe) continue the loop
            sibling.color = RED;
            node = parent;
            continue;
          }
          if (sibling && (!sibling[LEFT] || sibling[LEFT].color == BLACK)) {
            // Case 3 - next step is to transform this into case 4
            if (sibling[RIGHT]) {
              sibling[RIGHT].color = BLACK;
            }
            sibling.color = RED;
            leftRotate(sibling);
            sibling = parent[LEFT];
          }
          if (sibling && sibling[LEFT]) {
            // Case 4 - next step is to fixup and terminate
            sibling.color = parent.color;
            parent.color = BLACK;
            sibling[LEFT].color = BLACK;
            rightRotate(parent);
            node = root;
          } else {
            node = parent;
            continue;
          }
        }
      }
      
      if (node) {
        node.color = BLACK;
      }
    }

    function deleteNode(node) {

      if (node[LEFT] && node[RIGHT]) {
        // if a node has 2 children, copy its values from the min of the right subtree (which has at most 1 child) and delete that node instead
        let replacement = minNode(node[RIGHT]);
        node.key = replacement.key;
        node.val = replacement.val;
        node = replacement;
      }

      let child = null;
      if (node[LEFT]) {
        child = node[LEFT]
      } else if (node[RIGHT]) {
        child = node[RIGHT];
      }

      if (!node.parent) {
        root = child;
      } else {
        if (node == node.parent[LEFT]) {
          node.parent[LEFT] = child;
        } else {
          node.parent[RIGHT] = child;
        }
      }

      if (child) {
        child.parent = node.parent;
      }
      
      // If we removed a red node, the Red/Black properties are all intact
      if (node.color == BLACK) {
        // But if we deleted a black node, we need to do some combination of recolor and rebalance
        fixupDeletion(child, node.parent);
      }
      size--;
    }

    function iterateNodes(visit) {
      if (!root) { return; }

      let stack = [];
      let markedForDeletion = [];
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
            remove: function() { markedForDeletion.push(currentNode) },
            stop: function() { stopped = true;  },
          });
          currentNode = right;
        }
      }

      markedForDeletion.forEach(deleteNode);
    }
    
    function predecessorNode(node) {
      if (node == firstNode()) {
        return null;
      } else if (node[LEFT]) {
        var currentNode = node[LEFT];
        while (currentNode[RIGHT]) {
          currentNode = currentNode[RIGHT];
        }
        return currentNode;
      } else if (node == node.parent[RIGHT]) {
        return node.parent;
      } else {
        var currentNode = node.parent;
        while (currentNode == currentNode.parent[LEFT]) {
          currentNode = currentNode.parent;
        }
        return currentNode.parent;
      }
    }

    function successorNode(node) {
      if (node == lastNode()) {
        return null;
      } else if (node[RIGHT]) {
        var currentNode = node[RIGHT];
        while (currentNode[LEFT]) {
          currentNode = currentNode[LEFT];
        }
        return currentNode;
      } else if (node == node.parent[LEFT]) {
        return node.parent;
      } else {
        var currentNode = node.parent;
        while (currentNode == currentNode.parent[RIGHT]) {
          currentNode = currentNode.parent;
        }
        return currentNode.parent;
      }
    }

    function iterateNeighborNodes(key, visit) {
      var reachedLeft = false;
      var reachedRight = false;
      var hardStop = false;
      var currentNode = null;
      var continuationNode = null;
      var markedForDeletion = [];

      var findResult = findNode(key);
      if (!findResult.node) {
        return;
      }

      if (!findResult.direction) {
        visit(findResult.node, 0, {
          remove: function() { markedForDeletion.push(findResult.node); },
          stop: function() { hardStop = true; }
        });
        currentNode = predecessorNode(findResult.node);
        continuationNode = successorNode(findResult.node);
      } else if (findResult.direction == LEFT) {
        currentNode = predecessorNode(findResult.node);
        continuationNode = findResult.node;
      } else {
        currentNode = findResult.node;
        continuationNode = successorNode(findResult.node);
      }

      // go left
      while (!hardStop && currentNode && !reachedLeft) {
        visit(currentNode, -1, {
          remove: function() { markedForDeletion.push(currentNode); },
          stop: function() { reachedLeft = true; }
        });
        if (!reachedLeft) {
          currentNode = predecessorNode(currentNode);
        }
      }
      
      // go right
      currentNode = continuationNode;
      while (!hardStop && currentNode && !reachedRight) {
        visit(currentNode, 1, {
          remove: function() { markedForDeletion.push(currentNode); },
          stop: function() { reachedRight = true; }
        });
        if (!reachedRight) {
          currentNode = successorNode(currentNode);
        }
      }

      markedForDeletion.forEach(deleteNode);
    }

    function checkRedHasBlackChildren() {
      if (!root) { return true; }
      let stack = [root];

      while (stack.length > 0) {
        let node = stack.pop();
        
        if (node.color == RED) {
          if (node[LEFT]) {
            if (!node[RIGHT] || node[LEFT].color == RED || node[RIGHT.color == RED]) {
              return false;
            }
          } else if (node[RIGHT]) {
            return false;
          }
        }
        if (node[LEFT]) {
          stack.push(node[LEFT]);
        }
        
        if (node[RIGHT]) {
          stack.push(node[RIGHT]);
        }
      }
      return true;
    }

    function checkBlackDepth() {
      if (!root) { return true; }

      let depths = [];
      let stack = [[root, root.color == BLACK ? 1 : 0]];

      while (stack.length > 0) {
        let next = stack.pop();
        let node = next[0];
        let depth = next[1];
        
        let leaf = true;
        
        if (node[LEFT]) {
          leaf = false;
          stack.push([node[LEFT], depth + (node[LEFT].color == BLACK ? 1 : 0)]);
        }
        
        if (node[RIGHT]) {
          leaf = false;
          stack.push([node[RIGHT], depth + (node[RIGHT].color == BLACK ? 1 : 0)]);
        }
        
        if (leaf) {
          depths.push(depth);
        }
        
      }

      return Math.max.apply(Math, depths) == Math.min.apply(Math, depths);
    }


    return {
      put: function(key, val) {
        return !balancedInsert(key, val);
      },

      putUnlessPresent: function(key, val) {
        return !balancedInsert(key, val, true);
      },

      get: function(key) {
        var findResult = findNode(key);
        if (findResult.direction || !findResult.node) {
          return null;
        }
        return findResult.node.val;
      },

      successor: function(key) {
        var result = sucessorNodeForKey(key);
        if (result) {
          return { key: result.key, value: result.val };
        } else {
          return null;
        }
      },

      predecessor: function(key) {
        var result = predecessorNodeForKey(key);
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
        iterateNodes(function(node, fns) {fn(node.key, node.val, fns)});
      },
      
      forEachNeighbor: function(key, fn) {
        iterateNeighborNodes(key, function (node, direction, fns) {fn(node.key, node.val, direction, fns)});
      },

      remove: function(key) {
        var findResult = findNode(key);
        if (findResult.node && !findResult.direction) {
          deleteNode(findResult.node);
          return true;
        } else {
          return false;
        }
      },
      
      size: function() {
        return size;
      },

      isBalanced: function () {
        return checkBlackDepth() && checkRedHasBlackChildren();
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
