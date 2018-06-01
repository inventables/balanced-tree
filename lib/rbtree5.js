(function() {
  function makeTree(keyComparator) {

    const initialSize = 32;

    const RED = 0;
    const BLACK = 1;

    var rootNode = -1;
    var numEntries = 0;
    var nodeKeys = new Array(initialSize);
    var nodeValues = new Array(initialSize);

    const datumSize = 13;
    var structureData = new ArrayBuffer(initialSize * datumSize);

    function getLeft(index) {
      return new DataView(structureData, index * datumSize).getInt32(0);
    }

    function setLeft(index, value) {
      new DataView(structureData, index * datumSize).setInt32(0, value);
    }

    function getRight(index) {
      return new DataView(structureData, index * datumSize).getInt32(4);
    }

    function setRight(index, value) {
      new DataView(structureData, index * datumSize).setInt32(4, value);
    }

    function getParent(index) {
      return new DataView(structureData, index * datumSize).getInt32(8);
    }

    function setParent(index, value) {
      new DataView(structureData, index * datumSize).setInt32(8, value);
    }

    function getColor(index) {
      return new DataView(structureData, index * datumSize).getUint8(12);
    }

    function setColor(index, value) {
      new DataView(structureData, index * datumSize).setUint8(12, value);
    }

    function setNode(index, left, right, parent, color) {
       var view = new DataView(structureData, index * datumSize);
       view.setInt32(0, left);
       view.setInt32(4, right);
       view.setInt32(8, parent);
       view.setUint8(12, color);
    }

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


    function doubleArrayBuffer(arr) {
      var newArr = new ArrayBuffer(arr.byteLength * 2);
      new Uint8Array(newArr).set(new Uint8Array(arr))
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
        nodeKeys = doubleSize(nodeKeys);
        nodeValues = doubleSize(nodeValues);
        structureData = doubleArrayBuffer(structureData);
      }

      nodeKeys[numEntries] = key;
      nodeValues[numEntries] = val;
      setNode(numEntries, -1, -1, -1, RED);
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
          var nextNode = getLeft(currentNode);
          if (nextNode == -1) {
            return {
              node: currentNode,
              insertNew: function(val) {
                let newNode = makeNode(key, val);
                setLeft(currentNode, newNode);
                setParent(newNode, currentNode);
                return newNode;
              }
            };
          }
        } else if (comparison > 0) {
          nextNode = getRight(currentNode);
          if (nextNode == -1) {
            return {
              node: currentNode,
              insertNew: function(val) {
                let newNode = makeNode(key, val);
                setRight(currentNode, newNode);
                setParent(newNode, currentNode);
                return newNode;
              }
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

      if (findResult.insertNew) {
        return findResult.insertNew(val);
      }

      nodeValues[findResult.node] = val;
      return -1;
    }

    function leftRotate(x) {
      var y = getRight(x);
      setRight(x, getLeft(y));
      if (getLeft(y) != -1) {
        setParent(getLeft(y), x);
      }
      if (getParent(x) != -1) {
        setParent(y, getParent(x));
        if (x == getLeft(getParent(x))) {
          setLeft(getParent(x), y);
        } else {
          setRight(getParent(x), y);
        }
      } else {
        rootNode = y;
        setParent(y, -1);
      }
      setLeft(y, x);
      setParent(x, y);
    }

    function rightRotate(x) {
      var y = getLeft(x);
      setLeft(x, getRight(y));
      if (getRight(y) != -1) {
        setParent(getRight(y), x);
      }
      if (getParent(x) != -1) {
        setParent(y, getParent(x));
        if (x == getRight(getParent(x))) {
          setRight(getParent(x), y);
        } else {
          setLeft(getParent(x), y);
        }
      } else {
        rootNode = y;
        setParent(y, -1);
      }
      setRight(y, x);
      setParent(x, y);
    }

    function balancedInsert(key, val) {
      var newNode = unbalancedInsert(key, val);
      var x, y;
      if (newNode == -1) {
        return -1;
      }

      x = newNode;

      while (x != rootNode && getColor(getParent(x)) == RED)  {

        if (getParent(x) == getLeft(getParent(getParent(x)))) {
          y = getRight(getParent(getParent(x)));
          if (y != -1 && getColor(y) == RED) {
            setColor(y, BLACK);
            setColor(getParent(x), BLACK);
            x = getParent(getParent(x));
            setColor(x, RED);
          } else {
            if (x == getRight(getParent(x))) {
              x = getParent(x);
              leftRotate(x);
            }
            setColor(getParent(x), BLACK);
            setColor(getParent(getParent(x)), RED);
            rightRotate(getParent(getParent(x)));
          }
        } else {
          // same as above but with left and right exchanged
          y = getLeft(getParent(getParent(x)));
          if (y != -1 && getColor(y) == RED) {
            setColor(y, BLACK);
            setColor(getParent(x), BLACK);
            x = getParent(getParent(x));
            setColor(x, RED);
          } else {
            if (x == getLeft(getParent(x))) {
              x = getParent(x);
              rightRotate(x);
            }
            setColor(getParent(x), BLACK);
            setColor(getParent(getParent(x)), RED);
            leftRotate(getParent(getParent(x)));
          }
        }
      }

      setColor(rootNode, BLACK);
      return newNode;
    }


    return {
      put: function(key, val) {
        return balancedInsert(key, val) == -1;
      },

      get: function(key) {
        var findResult = findNode(key);
        if (findResult.insertNew != null || findResult.node == -1) {
          return null;
        }
        return nodeValues[findResult.node];
      },

      contains: function(key) {
        var findResult = findNode(key);
        return Boolean(findResult.node != -1 && findResult.insertNew == null);
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
    window.makeTree_arrayBuffer = makeTree;
  }
}).call(this);
