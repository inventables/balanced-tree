(function() {
  function makeTree(keyComparator) {

    const initialSize = 32;

    const RED = 0;
    const BLACK = 1;

    var rootNode = -1;
    var numEntries = 0;
    var nodeKeys = new Array(initialSize);
    var nodeValues = new Array(initialSize);
    var left = new Int32Array(initialSize);
    var right = new Int32Array(initialSize);
    var parents = new Int32Array(initialSize);
    var colors = new Uint8Array(initialSize);

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

    function doubleInt32Array(arr) {
      var newArr = new Int32Array(arr.length * 2);
      for (let i in arr) {
        newArr[i] = arr[i];
      }
      return newArr;
    }

    function doubleUint8Array(arr) {
      var newArr = new Uint8Array(arr.length * 2);
      for (let i in arr) {
        newArr[i] = arr[i];
      }
      return newArr;
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
        left = doubleInt32Array(left);
        right = doubleInt32Array(right);
        parents = doubleInt32Array(parents);
        colors = doubleUint8Array(colors);
      }

      nodeKeys[numEntries] = key;
      nodeValues[numEntries] = val;
      colors[numEntries] = RED;
      left[numEntries] = -1;
      right[numEntries] = -1;
      parents[numEntries] = -1;
      numEntries++;
      return numEntries - 1;
    }


    function findNode(key) {
      var nextNode;
      var comparison;
      var currentNode = rootNode;

      if (currentNode == -1) {
        return {
          node: -1,
          direction: null
        }
      }

      while (true) {
        let comparison = keyComparator(key, nodeKeys[currentNode]);
        if (comparison < 0) {
          var nextNode = left[currentNode];
          if (nextNode == -1) {
            return {
              node: currentNode,
              direction: function() { return left; }
            };
          }
        } else if (comparison > 0) {
          nextNode = right[currentNode];
          if (nextNode == -1) {
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

    // Return the inserted node, or -1 if the key already existed
    function unbalancedInsert(key, val) {
      var findResult = findNode(key);
      if (findResult.node == -1) {
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
      return -1;
    }

    function leftRotate(x) {
      var y = right[x];
      right[x] = left[y];
      if (left[y] != -1) {
        parents[left[y]] = x;
      }
      if (parents[x] != -1) {
        parents[y] = parents[x];
        if (x == left[parents[x]]) {
          left[parents[x]] = y;
        } else {
          right[parents[x]] = y;
        }
      } else {
        rootNode = y;
        parents[y] = -1;
      }
      left[y] = x;
      parents[x] = y;
    }

    function rightRotate(x) {
      var y = left[x];
      left[x] = right[y];
      if (right[y] != -1) {
        parents[right[y]] = x;
      }
      if (parents[x] != -1) {
        parents[y] = parents[x];
        if (x == right[parents[x]]) {
          right[parents[x]] = y;
        } else {
          left[parents[x]] = y;
        }
      } else {
        rootNode = y;
        parents[y] = -1;
      }
      right[y] = x;
      parents[x] = y;
    }

    function balancedInsert(key, val) {
      var newNode = unbalancedInsert(key, val);
      var x, y;
      if (newNode == -1) {
        return -1;
      }

      x = newNode;
      while (x != rootNode && colors[parents[x]] == RED)  {
        if (parents[x] == left[parents[parents[x]]]) {
          y = right[parents[parents[x]]];
          if (y != -1 && colors[y] == RED) {
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
          if (y != -1 && colors[y] == RED) {
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
        return balancedInsert(key, val) == -1;
      },

      get: function(key) {
        var findResult = findNode(key);
        if (findResult.direction != null || findResult.node == -1) {
          return null;
        }
        return nodeValues[findResult.node];
      },

      contains: function(key) {
        var findResult = findNode(key);
        return Boolean(findResult.node != -1 && findResult.direction == null);
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
    window.makeTree_sizedTypedArr = makeTree;
  }
}).call(this);
