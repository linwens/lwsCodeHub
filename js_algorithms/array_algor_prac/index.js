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
 * 895. 最大频率栈
 */
var FreqStack = function() {
  this.items = {};
  this.count = 0;
};

/** 
* @param {number} x
* @return {void}
*/
FreqStack.prototype.push = function(x) {
  this.items[this.count] = x;
  this.count++;
};

/**
* @return {number}
*/
FreqStack.prototype.pop = function() {
  let cache = freq(this.items, this.count);
  
  let maxNum = max(cache, 'num'); // 最大频率对应的Key
  let idx = 0;
  for (let [key, value] of Object.entries(this.items)) {
    while (idx<Number(key) && (value == maxNum)) {
      idx = Number(key);
    }
  }
  // for( let i = this.count; i >-1; i--) {
  //     if (this.items[i]>=0 && (this.items[i] == maxNum)) {
  //         idx = i;
  //         break;
  //     }
  // }
  const rslt = this.items[idx];
  delete this.items[idx];
  return rslt;
};

function freq(items, len) {
  let cache = {};
  for (let [key, value] of Object.entries(items)) {
    if (cache[value]) {
        cache[value]['num']++;
    } else {
      cache[value] = {
        num: 1,
        idx: 0
      }
    }
    cache[value]['idx'] = Number(key);
  }
  // console.log('cache---------')
  // console.log(JSON.stringify(items))
  // console.log(JSON.stringify(cache))
  return cache;
}
function max(cache) {
  let arr = [];
  let max = 0;
  let idx = 0;
  let tmp = null;
  for (let [key, value] of Object.entries(cache)) {
      while (max < value['num'] || (max == value['num'] && idx < value['idx'])) {
          max = value['num']
          idx = value['idx']
          tmp = key
      }
  }
  return tmp;
}

let bbb = new FreqStack();

/** 
* Your FreqStack object will be instantiated and called as such:
* var obj = new FreqStack()
* obj.push(x)
* var param_2 = obj.pop()
*/
