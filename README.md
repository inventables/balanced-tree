
# Balanced tree

A Javascript Red-Black-Tree implementation

## Usage

### Basic insertion and retrieval

```const tree = rbtree.makeTree();
tree.put(3, 42); // returns false
tree.put(3, 52); // returns true
tree.contains(3); // returns true
tree.get(3); // returns 52
```


### Iteration

Use `forEach` to iterate through the items in the tree. It takes a function that takes the key and value of each node:

```
const tree = rbtree.makeTree();
tree.put(3, 42);
tree.put(1, 24);


tree.forEach((key, value) => console.log(`Key: ${key}, Value: ${value}`))

// Prints:
//   Key: 1, Value: 24
//   Key: 3, Value: 42
```

You can also iterate over the neighbors of a value. It takes a similar function the key, the value, the direction of the neighbor, a function to tell the iterator to stop going in that direction.

```
const tree = rbtree.makeTree();
tree.put(1, "A");
tree.put(2, "B");
tree.put(3, "C");
tree.put(5, "E");
tree.put(6, "F");

tree.forEachNeighbor(4, (key, value, direction, fns) => {
  if (direction < 0) {
    console.log(`LEFT neighbor Value: ${value}`)    
    if (key == 2) {
      fns.stop();
    }
  } else if (direction > 0) {
    console.log(`RIGHT neighbor Value: ${value}`)    
    if (key == 5) {
      fns.stop();
    }
  }
});

// Prints:
//   LEFT neighbor Value: C
//   LEFT neighbor Value: B
//   RIGHT neighbor Value: E
```

### Deletion

Use the key to delete items from the tree:

```
const tree = rbtree.makeTree();
tree.put(3, 42);
tree.put(1, 24);

tree.remove(3); // Returns true
tree.remove(99); // Returns false
```

You can also delete during iteration using a function given to the `forEach` callback:

```
const tree = rbtree.makeTree();
tree.put(3, 42);
tree.put(1, 24);

tree.forEach((key, value, fns) => {
  if (key % 3 == 0) {
    fns.remove();
  }
})
```

Note that the result of the deletion will not be visible until the end of the iteration:

```
const tree = rbtree.makeTree();
tree.put(1, 1);
tree.put(2, 2);
tree.put(3, 3);

console.log("Starting")
tree.forEach((key, value, fns) => {
  if (key === 1) {
    fns.remove();
  }
  console.log("Tree has " + tree.size() + " elements");
})
console.log("Done")
console.log("Finally, tree has " + tree.size() + " elements");
```

prints:

```
Starting
Tree has 3 elements
Tree has 3 elements
Tree has 3 elements
Done
Finally, tree has 2 elements
```


### Using a custom key types

If you want to use your own keytypes (i.e., anything with behavior other than the default for `>` and `<`, you'll need to provide a custom comparator.

```
    var makeKey = function(x) {
      return { key: x };
    }

    var comparekeys = function(a, b) {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      } else {
        return 0;
      }
    }


    var tree = rbtree.makeTree(comparekeys);
    
    tree.put(makeKey(1), 'A');
```

### Positional functions

You can get the first and last items from a tree. You can also get the predecessor or successor for any given key:

```
    const included_stuff = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tree = rbtree.makeTree();

    for (let x of included_stuff) {
      tree.put(x, x);
    }
    
    tree.successor(5); // returns { key: 6, value: 6}
    tree.successor(15); // returns null
    tree.predecessor(5); // returns { key: 4, value: 4}
    tree.predecessor(1); // returns null
    tree.head(); // returns 1
    tree.tail(); // returns 9
```

## Tests

Run tests with

`npm run test`

You can run them continuously with

`npm run autotest`

To debug them, put a `debugger;` statement where you'd like to break, then run:


`mocha --inspect-brk`. Finally, open up chrome://inspect to debug the tests in the devtools.


## Benchmarking

Bechmarking code is available at
https://jsperf.com/js-rb-tree-1
