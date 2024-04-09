class Node {
    constructor(data) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  }
  
  class Tree {
    constructor(array) {
      this.root = buildTree(array);
    }
  }
  
  function buildTree(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    
    function buildBST(start, end) {
      if (start > end) return null;
      
      const mid = Math.floor((start + end) / 2);
      const node = new Node(sortedArray[mid]);
      
      node.left = buildBST(start, mid - 1);
      node.right = buildBST(mid + 1, end);
      
      return node;
    }
    
    return buildBST(0, sortedArray.length - 1);
  }
  
  function prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
  
  class TreeOperations {
    constructor(tree) {
      this.root = tree.root;
    }
    
    insert(value) {
      const newNode = new Node(value);
      if (!this.root) {
        this.root = newNode;
        return;
      }
      
      let current = this.root;
      while (true) {
        if (value < current.data) {
          if (current.left === null) {
            current.left = newNode;
            return;
          }
          current = current.left;
        } else if (value > current.data) {
          if (current.right === null) {
            current.right = newNode;
            return;
          }
          current = current.right;
        } else {
          return; // Value already exists
        }
      }
    }
    
    deleteItem(value) {
      this.root = this.deleteNode(this.root, value);
    }
    
    deleteNode(root, value) {
      if (root === null) return null;
      
      if (value < root.data) {
        root.left = this.deleteNode(root.left, value);
      } else if (value > root.data) {
        root.right = this.deleteNode(root.right, value);
      } else {
        // Case 1: No child or only one child
        if (root.left === null) return root.right;
        if (root.right === null) return root.left;
        
        // Case 2: Two children
        const minNode = this.findMinNode(root.right);
        root.data = minNode.data;
        root.right = this.deleteNode(root.right, minNode.data);
      }
      return root;
    }
    
    findMinNode(node) {
      while (node.left !== null) {
        node = node.left;
      }
      return node;
    }
    
    find(value) {
      let current = this.root;
      while (current !== null) {
        if (value === current.data) {
          return current;
        } else if (value < current.data) {
          current = current.left;
        } else {
          current = current.right;
        }
      }
      return null;
    }
    
    levelOrder(callback) {
      if (!this.root) return [];
      
      const queue = [this.root];
      const result = [];
      
      while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.data);
        
        if (node.left !== null) queue.push(node.left);
        if (node.right !== null) queue.push(node.right);
        
        if (typeof callback === 'function') {
          callback(node);
        }
      }
      
      return result;
    }
    
    inOrder(callback) {
      const traverse = (node) => {
        if (node === null) return;
        
        traverse(node.left);
        callback(node);
        traverse(node.right);
      };
      
      traverse(this.root);
    }
    
    preOrder(callback) {
      const traverse = (node) => {
        if (node === null) return;
        
        callback(node);
        traverse(node.left);
        traverse(node.right);
      };
      
      traverse(this.root);
    }
    
    postOrder(callback) {
      const traverse = (node) => {
        if (node === null) return;
        
        traverse(node.left);
        traverse(node.right);
        callback(node);
      };
      
      traverse(this.root);
    }
    
    height(node) {
      if (node === null) return -1;
      return 1 + Math.max(this.height(node.left), this.height(node.right));
    }
    
    depth(node) {
      let depth = 0;
      let current = node;
      while (current !== this.root) {
        depth++;
        current = this.getParent(current);
      }
      return depth;
    }
    
    getParent(node) {
      if (node === this.root) return null;
      
      let current = this.root;
      while (current !== null) {
        if (current.left === node || current.right === node) {
          return current;
        } else if (node.data < current.data) {
          current = current.left;
        } else {
          current = current.right;
        }
      }
      return null;
    }
    
    isBalanced() {
      return this.checkBalance(this.root) !== -1;
    }
    
    checkBalance(node) {
      if (node === null) return 0;
      
      const leftHeight = this.checkBalance(node.left);
      const rightHeight = this.checkBalance(node.right);
      
      if (leftHeight === -1 || rightHeight === -1 || Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
      }
      
      return Math.max(leftHeight, rightHeight) + 1;
    }
    
    rebalance() {
      const values = [];
      this.inOrder(node => values.push(node.data));
      this.root = buildTree(values);
    }
  }
  
  // Driver script
  const getRandomNumbers = (count) => {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * 100));
    }
    return Array.from(numbers);
  };
  
  const randomNumbers = getRandomNumbers(10);
  const tree = new Tree(randomNumbers);
  
  console.log("Initial Tree:");
  prettyPrint(tree.root);
  
  console.log("\nIs Balanced:", tree.isBalanced());
  
  console.log("\nLevel Order:");
  console.log(tree.levelOrder());
  
  console.log("\nPre Order:");
  tree.preOrder(node => console.log(node.data));
  
  console.log("\nPost Order:");
  tree.postOrder(node => console.log(node.data));
  
  console.log("\nIn Order:");
  tree.inOrder(node => console.log(node.data));
  
  // Unbalancing the tree
  const numbersToAdd = [110, 120, 130];
  numbersToAdd.forEach(num => tree.insert(num));
  
  console.log("\nAfter adding numbers > 100:");
  prettyPrint(tree.root);
  
  console.log("\nIs Balanced:", tree.isBalanced());
  
  // Rebalancing the tree
  tree.rebalance
  