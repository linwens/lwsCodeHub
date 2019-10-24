class Stack {
  constructor() {
    this.count = 0;
    this.items = {};
  }

  push(element) {
    this.items[this.count] = element;
    this.count++;
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  clear() {
    this.items = {};
    this.count = 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[0]}`;
    for (let i = 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    }
    return objString;
  }
}

/**
 * 946. 验证栈序列
 * 意思就是,给你一个空数组，根据pushed序列的每一项按顺序进行push/pop操作,能得到popped序列的结果，就认为true，否则就是false
 * 思路：以  pushed = [1,2,3,4,5], popped = [4,5,3,2,1]  为例：借用一个辅助栈，遍历压栈顺序，先将第一个放入栈中，这里是1，然后判断栈顶元素是不是出栈顺序的第一个元素，
 *      这里是4，很显然1≠4，所以我们继续压栈，直到相等以后开始出栈。出栈一个元素，则将出栈顺序向后移动一位，直到不相等，
 *      这样循环等压栈顺序遍历完成，如果辅助栈还不为空，说明弹出序列不是该栈的弹出顺序。
 */

let pushed = new Stack();
pushed.push(1);
pushed.push(2);
pushed.push(3);
pushed.push(4);
pushed.push(5);

let popped = new Stack();
popped.push(4);
popped.push(5);
popped.push(3);
popped.push(2);
popped.push(1);

function IsPopOrder(pushV, popV) {
  let stack = [];
  let idx = 0;
  for (let i = 0; i < pushed.length; i++) {
      stack.push(pushed[i])
      while (stack.length && stack[stack.length - 1] == popped[idx]) {
          stack.pop();
          idx++;
      }
  }
  return stack.length == 0;
}

/**
 * 895. 最大频率栈[困难]
 */
var FreqStack = function() {
  this.freqMap = {};
  this.count = 0;
};

/** 
* @param {number} x
* @return {void}
*/
FreqStack.prototype.push = function(x) {
  if (this.freqMap[x]) {
    this.freqMap[x].push(this.count)
  } else {
    this.freqMap[x] = [this.count]
  }
  this.count++;
};

/**
* @return {number}
*/
FreqStack.prototype.pop = function() {
  let max = 0;
  let idx = 0;
  let curKey = null;
  for (let key of Object.keys(this.freqMap)) {
    let item = this.freqMap[key];
    let len = item.length;
    while(max < len || (max == len && idx < item[len - 1])) {
      max = len;
      idx = item[len - 1];
      curKey = key;
    }
  }

  this.freqMap[curKey].pop();
  return curKey;

};


let bbb = new FreqStack();
bbb.push(35);
bbb.push(5);
bbb.push(21);
bbb.push(1);
bbb.push(2);
bbb.push(5);
bbb.push(5);
bbb.push(5);
bbb.push(1);
bbb.push(6);
bbb.push(1);
bbb.push(35);
bbb.push(22);
bbb.push(5);
/* console.log(JSON.stringify(bbb.freqMap));

console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop())
console.log('pop==>'+bbb.pop()) */
/** 
* Your FreqStack object will be instantiated and called as such:
* var obj = new FreqStack()
* obj.push(x)
* var param_2 = obj.pop()
*/

/**
 * 501. 二叉搜索树中的众数[简单]
 */
