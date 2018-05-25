(function() {
  function makeTree(keyComparator) {

    const initialSize = 32;

    const RED = 'red';
    const BLACK = 'black';

    var rootNode = null;
    var numEntries = 0;
    var nodeKeys = new Array(initialSize);
    var nodeValues = new Array(initialSize);
    var left = new Array(initialSize);
    var right = new Array(initialSize);
    var parents = new Array(initialSize);
    var colors = new Array(initialSize);

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

    function doubleSize(arr) {
      var newArr = new Array(arr.length * 2);
      for (let i in arr) {
        newArr[i] = arr[i];
      }
      return newArr;
    }

    function makeNode(key, val) {
      if (numEntries == nodeKeys.length) {
        debugger;
        nodeKeys = doubleSize(nodeKeys);
        nodeValues = doubleSize(nodeValues);
        left = doubleSize(left);
        right = doubleSize(right);
        parents = doubleSize(parents);
        colors = doubleSize(colors);
      }

      nodeKeys[numEntries] = key;
      nodeValues[numEntries] = val;
      colors[numEntries] = RED;
      left[numEntries] = null;
      right[numEntries] = null;
      numEntries++;
      return numEntries - 1;
    }


    function findNode(key) {
      var nextNode;
      var comparison;
      var currentNode = rootNode;

      if (currentNode == null) {
        return {
          node: null,
          direction: null
        }
      }

      while (true) {
        let comparison = keyComparator(key, nodeKeys[currentNode]);
        if (comparison < 0) {
          var nextNode = left[currentNode];
          if (nextNode == null) {
            return {
              node: currentNode,
              direction: function() { return left; }
            };
          }
        } else if (comparison > 0) {
          nextNode = right[currentNode];
          if (nextNode == null) {
            return {
              node: currentNode,
              direction: function() { return right; }
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
      if (findResult.node == null) {
        rootNode = makeNode(key, val);
        return rootNode;
      }

      if (findResult.direction) {
        let newNode = makeNode(key, val);
        let parent = findResult.node;

        findResult.direction()[parent] = newNode;
        parents[newNode] = parent
        return newNode;
      }

      nodeValues[findResult.node] = val;
      return null;
    }

    function leftRotate(x) {
      var y = right[x];
      right[x] = left[y];
      if (left[y] != null) {
        parents[left[y]] = x;
      }
      if (parents[x] != null) {
        parents[y] = parents[x];
        if (x == left[parents[x]]) {
          left[parents[x]] = y;
        } else {
          right[parents[x]] = y;
        }
      } else {
        rootNode = y;
        parents[y] = null;
      }
      left[y] = x;
      parents[x] = y;
    }

    function rightRotate(x) {
      var y = left[x];
      left[x] = right[y];
      if (right[y] != null) {
        parents[right[y]] = x;
      }
      if (parents[x] != null) {
        parents[y] = parents[x];
        if (x == right[parents[x]]) {
          right[parents[x]] = y;
        } else {
          left[parents[x]] = y;
        }
      } else {
        rootNode = y;
        parents[y] = null;
      }
      right[y] = x;
      parents[x] = y;
    }

    function balancedInsert(key, val) {
      var newNode = unbalancedInsert(key, val);
      var x, y;
      if (newNode == null) {
        return null;
      }

      x = newNode;
      while (x != rootNode && colors[parents[x]] == RED)  {
        if (parents[x] == left[parents[parents[x]]]) {
          y = right[parents[parents[x]]];
          if (y != null && colors[y] == RED) {
            colors[y] = BLACK;
            colors[parents[x]] = BLACK;
            x = parents[parents[x]];
            colors[x] = RED;
          } else {
            if (x == right[parents[x]]) {
              x = parents[x];
              leftRotate(x);
            }
            colors[parents[x]] = BLACK;
            colors[parents[parents[x]]] = RED;
            rightRotate(parents[parents[x]]);
          }
        } else {
          // same as above but with left and right exchanged
          y = left[parents[parents[x]]];
          if (y != null && colors[y] == RED) {
            colors[y] = BLACK;
            colors[parents[x]] = BLACK;
            x = parents[parents[x]];
            colors[x] = RED;
          } else {
            if (x == left[parents[x]]) {
              x = parents[x];
              rightRotate(x);
            }
            colors[parents[x]] = BLACK;
            colors[parents[parents[x]]] = RED;
            leftRotate(parents[parents[x]]);
          }
        }
      }

      colors[rootNode] = BLACK;
      return newNode;
    }


    return {
      put: function(key, val) {
        return balancedInsert(key, val) == null;
      },

      get: function(key) {
        var findResult = findNode(key);
        if (findResult.direction != null || findResult.node == null) {
          return null;
        }
        return nodeValues[findResult.node];
      },

      contains: function(key) {
        var findResult = findNode(key);
        return Boolean(findResult.node != null && findResult.direction == null);
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
    window.makeTree_sizedArr = makeTree;
  }
}).call(this);
