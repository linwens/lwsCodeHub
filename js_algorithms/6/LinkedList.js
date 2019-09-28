
function defaultEquals(a, b) {
  return a === b
}

// 表示我们想要添加到列表的项
class Node {
  constructor(element) {
    this.element = element; // 元素本身的节点
    this.next = undefined; // 指向下一个元素的引用
  }
}

class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0;
    this.head = undefined; // 保存第一个元素的引用
    this.equalsFn = equalsFn;
  }

  push (element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next != null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count++;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next
      } else {
        let previous; // 当前节点的上一个元素
        for (let i = 0; i < index; i++) { //注意：这里的当前元素指的是要删元素的上一个元素
          previous = current; // 这里获取当前元素上一个元素的引用(next)
          current = current.next; // 获取到了要删的元素
        }
        previous.next = current.next; // 将要删元素上一个元素的next指向要删元素的下一个元素，达到删除效果
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }

  getElementAt(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head;
      for (let i = 0; i < index && node != null; i++) { //?+ 为啥还要node != null
        node = node.next;
      }
      return node;
    }
    return undefined;
  }

  insert(element, index) {
    if (index >= 0 && index < this.count) {
      const node = new Node(element);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1); // 比如插到第三位，那肯定要找到第二位的元素
        const current = previous.next;
        node.next = current;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  
}

const list = new LinkedList();
list.push(15);
list.push(10);

