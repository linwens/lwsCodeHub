/**
 * 707. 设计链表[中等]
 */
class Node {
  constructor(val){
      this.element = val;
      this.next = undefined;
  }
}
var MyLinkedList = function() {
  this.head = undefined;
  this.count = 0;
};

/**
* Get the value of the index-th node in the linked list. If the index is invalid, return -1. 
* @param {number} index
* @return {number}
*/
MyLinkedList.prototype.get = function(index) {
  let current = this.head;
    
  if (!current) {
      return -1
  }
  if (index >= 0 && index < this.count) {
      for (let i = 0; i < index && current != undefined; i++) {
          current = current.next;
      }
      return current ? (current.element === undefined || current.element === null ? -1 : current.element) : -1;
  } else {
      return -1
  }
};

/**
* Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list. 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtHead = function(val) {
  const node = new Node(val);
  
  let current;
  if(this.head === undefined || this.head === null) {
      this.head = node; 
  } else {
      current = this.head;
      node.next = current
      this.head = node;
  }
  this.count++;
};

/**
* Append a node of value val to the last element of the linked list. 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtTail = function(val) {
  const node = new Node(val);
  let current;
  if(this.head === undefined || this.head === null) {
      this.head = node; 
  } else {
      current = this.head;
      while(current.next != null) {
          current = current.next;
      }
      current.next = node;
  }
  this.count++;
};

/**
* Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted. 
* @param {number} index 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtIndex = function(index, val) {
  if (index <= 0) {
      this.addAtHead(val);
      this.count++;
  }
  if (index > this.count) return false
  
  if (index > 0 && index < this.count) {
      let prev = this.head;
      for (let i = 0; i < index - 1 && prev != undefined; i++) {
          prev = prev.next;
      }
      
      let current = prev.next;
      const node = new Node(val);
      node.next = current;
      prev.next = node;
      this.count++;
  }

};

/**
* Delete the index-th node in the linked list, if the index is valid. 
* @param {number} index
* @return {void}
*/
MyLinkedList.prototype.deleteAtIndex = function(index) {
  let current = this.head;
  if (index < 0) return false
  if (index === 0) {
    this.head = current.next;
  }
  if (index > 0 && index < this.count) {
    let prev = this.head;
    for (let i = 0; i < index - 1 && prev != undefined; i++) {
        prev = prev.next;
    }
    current = prev.next;
    prev.next = current ? current.next : undefined;
  }
  this.count--;
};

let linkedList = new MyLinkedList();

console.log(JSON.stringify(linkedList))
linkedList.addAtHead(5);
console.log(JSON.stringify(linkedList))
linkedList.addAtHead(2);
console.log(JSON.stringify(linkedList))
linkedList.deleteAtIndex(1);
linkedList.addAtIndex(1,9);
linkedList.addAtHead(4);
linkedList.addAtHead(9);
linkedList.addAtHead(8);
linkedList.get(3);
linkedList.addAtTail(1);
linkedList.addAtIndex(3,6);
linkedList.addAtHead(3);

console.log(JSON.stringify(linkedList.get(0)))
linkedList.addAtHead(1);
console.log(JSON.stringify(linkedList))
linkedList.deleteAtIndex(0);
console.log(JSON.stringify(linkedList))
