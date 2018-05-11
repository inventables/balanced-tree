var exports = module.exports = {}

function makeTree(keyComparator) {

  var LEFT = 'left';
  var RIGHT = 'right';
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
      right: null
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
        var nextNode = currentNode.left;
        if (!nextNode) {
          return {
            node: currentNode,
            direction: LEFT
          };
        }
      } else if (comparison > 0) {
        nextNode = currentNode.right;
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

  return {
    put: function(key, val) {
      var findResult = findNode(key);
      if (!findResult.node) {
        root = makeNode(key, val);
        return false;
      }

      if (findResult.direction) {
        findResult.node[findResult.direction] = makeNode(key, val);
        return false;
      }

      findResult.node.val = val;
      return true;
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
