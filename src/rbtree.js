// Export the main function
export function makeTree(keyComparator) {
  const LEFT = 'left';
  const RIGHT = 'right';
  const RED = 'red';
  const BLACK = 'black';
  let root = null;
  let size = 0;

  if (!keyComparator) {
    keyComparator = (a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
  }

  const makeNode = (key, val) => ({
    isNull: false,
    key,
    val,
    left: null,
    right: null,
    parent: null,
    color: RED,
  });

  const findNode = (key) => {
    let currentNode = root;

    if (!currentNode) {
      return { node: null, direction: null };
    }

    while (true) {
      const comparison = keyComparator(key, currentNode.key);
      if (comparison < 0) {
        const nextNode = currentNode[LEFT];
        if (!nextNode) {
          return { node: currentNode, direction: LEFT };
        }
        currentNode = nextNode;
      } else if (comparison > 0) {
        const nextNode = currentNode[RIGHT];
        if (!nextNode) {
          return { node: currentNode, direction: RIGHT };
        }
        currentNode = nextNode;
      } else {
        return { node: currentNode, direction: null };
      }
    }
  };

  const sucessorNodeForKey = (key) => {
    let currentNode = root;
    let candidate = null;

    if (!currentNode) {
      return null;
    }

    while (true) {
      const comparison = keyComparator(key, currentNode.key);
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
  };

  const predecessorNodeForKey = (key) => {
    let currentNode = root;
    let candidate = null;

    if (!currentNode) {
      return null;
    }

    while (true) {
      const comparison = keyComparator(key, currentNode.key);
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
  };

  const maxNode = (node) => {
    let currentNode = node;
    if (!currentNode) {
      return null;
    }

    while (currentNode[RIGHT]) {
      currentNode = currentNode[RIGHT];
    }

    return currentNode;
  };

  const minNode = (node) => {
    let currentNode = node;
    if (!currentNode) {
      return null;
    }

    while (currentNode[LEFT]) {
      currentNode = currentNode[LEFT];
    }

    return currentNode;
  };

  const firstNode = () => minNode(root);

  const lastNode = () => maxNode(root);

  // Return the inserted node, or null if the key already existed
  const unbalancedInsert = (key, val, checkExistence) => {
    const findResult = findNode(key);
    if (!findResult.node) {
      root = makeNode(key, val);
      size++;
      return root;
    }

    if (findResult.direction) {
      const newNode = makeNode(key, val);
      const parent = findResult.node;
      parent[findResult.direction] = newNode;
      newNode.parent = parent;
      size++;
      return newNode;
    }

    if (!checkExistence) {
      findResult.node.val = val;
    }

    return null;
  };

  const leftRotate = (x) => {
    const y = x[RIGHT];
    x[RIGHT] = y[LEFT];
    if (y[LEFT]) {
      y[LEFT].parent = x;
    }
    if (x.parent) {
      y.parent = x.parent;
      if (x === x.parent[LEFT]) {
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
  };

  const rightRotate = (x) => {
    const y = x[LEFT];
    x[LEFT] = y[RIGHT];
    if (y[RIGHT]) {
      y[RIGHT].parent = x;
    }
    if (x.parent) {
      y.parent = x.parent;
      if (x === x.parent[RIGHT]) {
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
  };

  const balancedInsert = (key, val, checkExistence) => {
    const newNode = unbalancedInsert(key, val, checkExistence);
    let x = newNode;
    if (!newNode) {
      return null;
    }

    while (x !== root && x.parent.color === RED)  {
      if (x.parent === x.parent.parent[LEFT]) {
        const y = x.parent.parent[RIGHT];
        if (y && y.color === RED) {
          y.color = BLACK;
          x.parent.color = BLACK;
          x = x.parent.parent;
          x.color = RED;
        } else {
          if (x === x.parent[RIGHT]) {
            x = x.parent;
            leftRotate(x);
          }
          x.parent.color = BLACK;
          x.parent.parent.color = RED;
          rightRotate(x.parent.parent);
        }
      } else {
        // same as above but with left and right exchanged
        const y = x.parent.parent[LEFT];
        if (y && y.color === RED) {
          y.color = BLACK;
          x.parent.color = BLACK;
          x = x.parent.parent;
          x.color = RED;
        } else {
          if (x === x.parent[LEFT]) {
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
  };


  // See p274 of CLR (1990) for an explanation of this algorithm. This implementation is a little more involved to handle nulls
  // Node may be null
  // Parent is the parent of the deleted node
  const fixupDeletion = (node, parent) => {
    while (node !== root && (node == null || node.color === BLACK)) {

      // Every time we reassign node, we either continue to the next loop iteration or break out of the loop
      if (node) {
        parent = node.parent;
      }
      if (node === parent[LEFT]) {
        let sibling = parent[RIGHT];
        if (sibling && sibling.color === RED) {
          // Case 1 - next step is to convert into case 2, 3, or 4
          sibling.color = BLACK;
          parent.color = RED;
          leftRotate(parent);
          sibling = parent[RIGHT];
        }
        if (sibling && ((!sibling[LEFT] && !sibling[RIGHT]) ||
          (sibling[LEFT] && sibling[RIGHT] && sibling[LEFT].color === BLACK && sibling[RIGHT].color === BLACK))) {
          // Case 2 - next step is to recolor the sibling, move the target node up and (maybe) continue the loop
          sibling.color = RED;
          node = parent;
          continue;
        }
        if (sibling && (!sibling[RIGHT] || sibling[RIGHT].color === BLACK)) {
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
        }
      } else {
        // same as above but with left and right reversed
        let sibling = parent[LEFT];
        if (sibling.color === RED) {
          // Case 1 - next step is to convert into case 2, 3, or 4
          sibling.color = BLACK;
          parent.color = RED;
          rightRotate(parent);
          sibling = parent[LEFT];
        }

        if (sibling && ((!sibling[LEFT] && !sibling[RIGHT]) ||
            (sibling[LEFT] && sibling[RIGHT] && sibling[LEFT].color === BLACK && sibling[RIGHT].color === BLACK))) {
          // Case 2 - next step is to recolor the sibling, move the target node up and (maybe) continue the loop
          sibling.color = RED;
          node = parent;
          continue;
        }
        if (sibling && (!sibling[LEFT] || sibling[LEFT].color === BLACK)) {
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
        }
      }
    }

    if (node) {
      node.color = BLACK;
    }
  };

  const deleteNode = (node) => {

    if (node[LEFT] && node[RIGHT]) {
      // if a node has 2 children, copy its values from the min of the right subtree (which has at most 1 child) and delete that node instead
      const replacement = minNode(node[RIGHT]);
      node.key = replacement.key;
      node.val = replacement.val;
      node = replacement;
    }

    const child = node[LEFT] || node[RIGHT];

    if (!node.parent) {
      root = child;
    } else {
      if (node === node.parent[LEFT]) {
        node.parent[LEFT] = child;
      } else {
        node.parent[RIGHT] = child;
      }
    }

    if (child) {
      child.parent = node.parent;
    }

    // If we removed a red node, the Red/Black properties are all intact
    if (node.color === BLACK) {
      // But if we deleted a black node, we need to do some combination of recolor and rebalance
      fixupDeletion(child, node.parent);
    }
    size--;
  };

  const iterateNodes = (visit) => {
    if (!root) { return; }

    const stack = [];
    const markedForDeletion = [];
    let currentNode = root;
    let stopped = false;

    while (currentNode || stack.length > 0 && !stopped) {
      if (currentNode) {
        stack.unshift(currentNode);
        currentNode = currentNode[LEFT];
      } else {
        currentNode = stack.shift();
        const right = currentNode[RIGHT];
        visit(currentNode, {
          remove: () => markedForDeletion.push(currentNode),
          stop: () => { stopped = true;  },
        });
        currentNode = right;
      }
    }

    markedForDeletion.forEach(deleteNode);
  };

  const predecessorNode = (node) => {
    if (node === firstNode()) {
      return null;
    } else if (node[LEFT]) {
      let currentNode = node[LEFT];
      while (currentNode[RIGHT]) {
        currentNode = currentNode[RIGHT];
      }
      return currentNode;
    } else if (node === node.parent[RIGHT]) {
      return node.parent;
    } else {
      let currentNode = node.parent;
      while (currentNode === currentNode.parent[LEFT]) {
        currentNode = currentNode.parent;
      }
      return currentNode.parent;
    }
  };

  const successorNode = (node) => {
    if (node === lastNode()) {
      return null;
    } else if (node[RIGHT]) {
      let currentNode = node[RIGHT];
      while (currentNode[LEFT]) {
        currentNode = currentNode[LEFT];
      }
      return currentNode;
    } else if (node === node.parent[LEFT]) {
      return node.parent;
    } else {
      let currentNode = node.parent;
      while (currentNode === currentNode.parent[RIGHT]) {
        currentNode = currentNode.parent;
      }
      return currentNode.parent;
    }
  };

  const iterateNeighborNodes = (key, visit) => {
    let reachedLeft = false;
    let reachedRight = false;
    let hardStop = false;
    let currentNode = null;
    let continuationNode = null;
    const markedForDeletion = [];

    const findResult = findNode(key);
    if (!findResult.node) {
      return;
    }

    if (!findResult.direction) {
      visit(findResult.node, 0, {
        remove: () => markedForDeletion.push(findResult.node),
        stop: () => { hardStop = true; }
      });
      currentNode = predecessorNode(findResult.node);
      continuationNode = successorNode(findResult.node);
    } else if (findResult.direction === LEFT) {
      currentNode = predecessorNode(findResult.node);
      continuationNode = findResult.node;
    } else {
      currentNode = findResult.node;
      continuationNode = successorNode(findResult.node);
    }

    // go left
    while (!hardStop && currentNode && !reachedLeft) {
      visit(currentNode, -1, {
        remove: () => markedForDeletion.push(currentNode),
        stop: () => { reachedLeft = true; }
      });
      if (!reachedLeft) {
        currentNode = predecessorNode(currentNode);
      }
    }

    // go right
    currentNode = continuationNode;
    while (!hardStop && currentNode && !reachedRight) {
      visit(currentNode, 1, {
        remove: () => markedForDeletion.push(currentNode),
        stop: () => { reachedRight = true; }
      });
      if (!reachedRight) {
        currentNode = successorNode(currentNode);
      }
    }

    markedForDeletion.forEach(deleteNode);
  };

  const checkRedHasBlackChildren = () => {
    if (!root) { return true; }
    const stack = [root];

    while (stack.length > 0) {
      const node = stack.pop();

      if (node.color === RED) {
        if (node[LEFT]) {
          if (!node[RIGHT] || node[LEFT].color === RED || node[RIGHT.color === RED]) {
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
  };

  const checkBlackDepth = () => {
    if (!root) { return true; }

    const depths = [];
    const stack = [[root, root.color === BLACK ? 1 : 0]];

    while (stack.length > 0) {
      const [node, depth] = stack.pop();

      let leaf = true;

      if (node[LEFT]) {
        leaf = false;
        stack.push([node[LEFT], depth + (node[LEFT].color === BLACK ? 1 : 0)]);
      }

      if (node[RIGHT]) {
        leaf = false;
        stack.push([node[RIGHT], depth + (node[RIGHT].color === BLACK ? 1 : 0)]);
      }

      if (leaf) {
        depths.push(depth);
      }

    }

    return Math.max(...depths) === Math.min(...depths);
  };


  // Return the public API
  return {
    put: (key, val) => !balancedInsert(key, val),

    putUnlessPresent: (key, val) => !balancedInsert(key, val, true),

    get: (key) => {
      const findResult = findNode(key);
      if (findResult.direction || !findResult.node) {
        return null;
      }
      return findResult.node.val;
    },

    successor: (key) => {
      const result = sucessorNodeForKey(key);
      if (result) {
        return { key: result.key, value: result.val };
      } else {
        return null;
      }
    },

    predecessor: (key) => {
      const result = predecessorNodeForKey(key);
      if (result) {
        return { key: result.key, value: result.val };
      } else {
        return null;
      }
    },

    contains: (key) => {
      const findResult = findNode(key);
      return Boolean(findResult.node && !findResult.direction);
    },

    head: () => {
      const result = firstNode();
      if (result) {
        return { key: result.key, value: result.val };
      } else {
        return null;
      }
    },

    tail: () => {
      const result = lastNode();
      if (result) {
        return { key: result.key, value: result.val };
      } else {
        return null;
      }
    },

    forEach: (fn) => iterateNodes((node, fns) => fn(node.key, node.val, fns)),

    forEachNeighbor: (key, fn) => iterateNeighborNodes(key, (node, direction, fns) => fn(node.key, node.val, direction, fns)),

    remove: (key) => {
      const findResult = findNode(key);
      if (findResult.node && !findResult.direction) {
        deleteNode(findResult.node);
        return true;
      } else {
        return false;
      }
    },

    size: () => size,

    isBalanced: () => checkBlackDepth() && checkRedHasBlackChildren(),
  };
}
