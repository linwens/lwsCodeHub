/**
 * 406. 根据身高重建队列[中等]
 */
var reconstructQueue = function(people) {
  let arr = [];
  // 先按身高倒序
  let arrSorted = people.sort((a, b) => {
      return b[0] - a[0]
  })
  // 在身高倒序的基础上，按前面人数进行顺序(小到大)
  arrSorted.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1] 
    } else {
      return b[0] - a[0]
    }
  })
  // 从高到低从老队列A里选人，再在新的队列B里插入人，[h, k]中的 k 代表了B队列这个位置上的人进来的时候前面应该有k个人（因为都是从A中选最高的的插入，所以B队列中的人肯定都比新选的人高，所以排在位子k肯定没错）
  for(let i = 0; i < arrSorted.length; i++) { //arrSorted.length
    arr.splice(arrSorted[i][1], 0, arrSorted[i]); //学会用splice往数组任意位置插入值
  }
  return arr
};

reconstructQueue([[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]);

/**
 * 641. 设计双端队列[中等]
 */
/**
 * Initialize your data structure here. Set the size of the deque to be k.
 * @param {number} k
 */
var MyCircularDeque = function(k) {
  this.items = {};
  this.count = 0;
  this.lowestCount = 0;
  this.mostCount = k;
};

/**
* Adds an item at the front of Deque. Return true if the operation is successful. 
* @param {number} value
* @return {boolean}
*/
MyCircularDeque.prototype.insertFront = function(value) {
  if (this.isFull()) {
    return false
  }

  if (this.lowestCount > 0) {
    this.lowestCount--;
    this.items[this.lowestCount] = value;
  } else {
    for (let i = this.count; i >= 0; i--) {
        this.items[i] = this.items[i - 1]
    }
    this.count++;
    this.lowestCount = 0;
    this.items[0] = value;
  }

  return true;
};

/**
* Adds an item at the rear of Deque. Return true if the operation is successful. 
* @param {number} value
* @return {boolean}
*/
MyCircularDeque.prototype.insertLast = function(value) {
  if (this.isFull()) {
      return false
  }
  this.items[this.count] = value;
  this.count++;

  return true;
};

/**
* Deletes an item from the front of Deque. Return true if the operation is successful.
* @return {boolean}
*/
MyCircularDeque.prototype.deleteFront = function() {
  if(this.isEmpty()) {
      return false
  }
  delete this.items[this.lowestCount]
  this.lowestCount++;
  return true;
};

/**
* Deletes an item from the rear of Deque. Return true if the operation is successful.
* @return {boolean}
*/
MyCircularDeque.prototype.deleteLast = function() {
  if(this.isEmpty()) {
      return false
  }
  this.count--;
  delete this.items[this.count];
  return true;
};

/**
* Get the front item from the deque.
* @return {number}
*/
MyCircularDeque.prototype.getFront = function() {
  if(this.isEmpty()) {
      return -1
  }
  return this.items[this.lowestCount];
};

/**
* Get the last item from the deque.
* @return {number}
*/
MyCircularDeque.prototype.getRear = function() {
  if(this.isEmpty()) {
      return -1
  }
  return this.items[this.count - 1];
};

/**
* Checks whether the circular deque is empty or not.
* @return {boolean}
*/
MyCircularDeque.prototype.isEmpty = function() {
  return this.lowestCount - this.count >= 0
};

/**
* Checks whether the circular deque is full or not.
* @return {boolean}
*/
MyCircularDeque.prototype.isFull = function() {
  return this.count - this.lowestCount >= this.mostCount
};

/**
 * 622. 设计循环队列[中等]
 */

var MyCircularQueue = function(k) {
  this.items = {};
  this.count = 0;
  this.lowestCount = 0;
  this.mostCount = k;
};

/**
* Insert an element into the circular queue. Return true if the operation is successful. 
* @param {number} value
* @return {boolean}
*/
MyCircularQueue.prototype.enQueue = function(value) {
  if (this.isFull()) {
      return false;
  }
  this.items[this.count] = value;
  this.count++;
  return true;
};

/**
* Delete an element from the circular queue. Return true if the operation is successful.
* @return {boolean}
*/
MyCircularQueue.prototype.deQueue = function() {
  if (this.isEmpty()) {
      return false;
  }
  const rslt = this.items[0];
  delete this.items[0];
  for (let i = 0; i < this.count - 1; i ++) {  // 先进先出，在队列容量受限的情况下，删除第一项后，把所有项前移，流出最后一个位置用于插入
      this.items[i] = this.items[i + 1]
  }
  this.count--;
  return true;
  
};

/**
* Get the front item from the queue.
* @return {number}
*/
MyCircularQueue.prototype.Front = function() {
  if (this.isEmpty()) {
      return -1;
  }
  return this.items[this.lowestCount]
};

/**
* Get the last item from the queue.
* @return {number}
*/
MyCircularQueue.prototype.Rear = function() {
  if (this.isEmpty()) {
      return -1;
  }
  return this.items[this.count - 1]
};

/**
* Checks whether the circular queue is empty or not.
* @return {boolean}
*/
MyCircularQueue.prototype.isEmpty = function() {
  return this.lowestCount - this.count >=0
};

/**
* Checks whether the circular queue is full or not.
* @return {boolean}
*/
MyCircularQueue.prototype.isFull = function() {
  return this.count - this.lowestCount >= this.mostCount;
};

/**
 * 899. 有序队列[困难]
 */
// 参考：https://www.cnblogs.com/mcomco/p/10349996.html

var orderlyQueue = function(S, K) {
  let rslt = [];
  let arr = S.split(''); // 不传''就直接生成只有一项且内容为 S 的 数组
  let max = '';
  let idx = 0;
  let tmp = S;
      let count = 0;
  
  while(rslt.join('') <= tmp) {
    if (count > 1000) {
      console.log('炸了！');
      break;
    }
      for(let i = 0; i < K; i++) {
          while(max < arr[i]) {
              max = arr[i];
              idx = i;
          }
      }
      console.log('idx==>'+idx)
      arr.push(arr.splice(idx,1)[0])
      console.log('arr==>'+JSON.stringify(arr))
      rslt = arr// 抽出排到最后
      if (rslt.join('') < tmp) {
        tmp = rslt.join('');
      }
      count++;
  }
  console.log(tmp)
  return tmp;
};

orderlyQueue('baaca', 2);
