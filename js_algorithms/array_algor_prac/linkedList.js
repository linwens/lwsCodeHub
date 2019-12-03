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
  if (index >= 0) {
      for (let i = 0; i <= index - 1 && current != undefined; i++) {
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
  if (index > this.count) return null
  
  if (index > 0 && index <= this.count) {
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
  if (index < 0) return null
  if (index === 0) {
    this.head = current.next;
  }
  if (index > 0 && index <= this.count) {
    let prev = this.head;
    for (let i = 0; i < index - 1 && prev != undefined; i++) {
        prev = prev.next;
    }
    if (prev == current && this.count <= 1) { // 需要考虑index = 1的问题，this.count = 1 思路要改改
      return null
    }
    current = prev.next;
    prev.next = current ? current.next : undefined;
  }
  this.count--;
};


/**
 * 86. 分隔链表[中等]
 */
var partition = function(head, x) {
    
  let list1 = {val: 0, next: null};
  let list2 = {val: 0, next: null};
  let tmp1 = list1;
  let tmp2 = list2;
  
  while(head != null) {
      if (head.val >= x) {
          tmp1.next = head;
          tmp1 = tmp1.next;
      } else {
          tmp2.next = head;
          tmp2 = tmp2.next;
      }
      head = head.next
  }
  
  tmp2.next = list1.next;
  tmp1.next = null
  return list2.next
};

/**
 * 160.相交链表[简单]
 * 1、题目的意思是：两个链表已经是相交的了，也就是说相交以后的那段链表，值用的是同一个对象。
 * 2、参数 headA 和 headB 是链表的一项，而不是整个链表
 */

var getIntersectionNode = function(headA, headB) {
  while(headA) {
      headA.sep = 1;
      headA = headA.next;
  }

  while(headB) {
      if (headB.sep) return headB
      headB = headB.next
  }
};

/**
 * 148.排序链表[中等]
 * 
 */
var sortList = function(head) {
  if (head === null || head.next === null) {
      return head;
  }
  return mergeSort(head);
};
// 递归切分
function mergeSort(head) {
  // 用于结束递归，避免一直递归下去
  if (head === null || head.next === null) {
      return head;
  }

  let slow = head;
  let fast = head;
  // 一次遍历，fast进两步，slow进一步，fast遍历到最后就停止slow的变量，实现取中间值

  while(fast !== null) {
      fast = fast.next;
      fast = fast !== null ? fast.next : null;
      if (fast !== null) {
          slow = slow.next;
      }
  }

  let half = slow.next; // 既然slow在中点的位置，那slow.next就是后半部分进行变量的起始点,所以half = slow.next而不是slow
  slow.next = null;
  // 接下来进行递归，直到分的不能再分
  let left = mergeSort(head);
  let right = mergeSort(half);
  // 递归结束进行合并
  return merge(left, right);
}
// 合并排序
function merge(left, right) {
  let res = null;
  let cur = null; // 用于叠加的指针

  while(left !== null && right !== null) {
      let tmp = null;
      if (left.val < right.val) {
          tmp = left;
          left = left.next;
      } else {
          tmp = right;
          right = right.next;
      }
      if (res === null) { // 初始化
          res = tmp;
          cur = res; // cur指向res所占的内存
      } else {
          cur.next = tmp;
          cur = cur.next; // cur被更新了，但是res在累加
      }
  }
  // 最后收尾
  if (left !== null) {
      if (cur === null) {
          cur = left;
      } else {
          cur.next = left;
      }
  }
  if (right !== null) {
      if (cur === null) {
          cur = right;
      } else {
          cur.next = right;
      }
  }

  return res;
}