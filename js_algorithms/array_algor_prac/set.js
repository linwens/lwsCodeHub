/**
 * 705. 设计哈希集合 [简单]
 */
var MyHashSet = function() {
  this.items = {}
};

MyHashSet.prototype.add = function(key) {
  if (!this.contains(key)) {
      this.items[key] = key
      return true
  }
  return false
};

MyHashSet.prototype.remove = function(key) {
  if (this.contains(key)) {
      delete this.items[key];
      return true
  }
  return false
};

MyHashSet.prototype.contains = function(key) {
  return Object.prototype.hasOwnProperty.call(this.items, key)
};

/**
* 380. 常数时间插入、删除和获取随机元素 [中等]
*/
var RandomizedSet = function() {
  this.items = {}
  this.has = function(el) {
      return Object.prototype.hasOwnProperty.call(this.items, el)
  }
};

RandomizedSet.prototype.insert = function(val) {
  if (!this.has(val)) {
      this.items[val] = val;
      return true;
  }
  return false;
};

RandomizedSet.prototype.remove = function(val) {
  if (this.has(val)) {
      delete this.items[val]
      return true
  }
  return false
};

RandomizedSet.prototype.getRandom = function() {
  var keys = Object.keys(this.items);
  var len = keys.length;
  var random = Math.floor(Math.random()*(len))
  return this.items[keys[random]]
};

/**
 * 757.  设置交集大小至少为2 [困难]
 * 参考；https://blog.csdn.net/qq_41855420/article/details/89817643
 */
var intersectionSizeTwo = function(intervals) {

  // 排序：按右侧边界递增，如果右侧边界相等，按左侧递减；如果不按左侧递减，有可能会重复插入右边界的值
  intervals.sort((a, b)=> {
      if (a[1] > b[1]) {
          return 1
      } else if (a[1] == b[1]) {
          if (a[0] < b[0]) {
              return 1
          }
      } else {
          return -1
      }
      return 0
  })
  console.log(intervals)
  // 贪心算法
  var I_S_arr = [];
  I_S_arr.push(intervals[0][1] - 1);
  I_S_arr.push(intervals[0][1])
  for (var i = 0; i<intervals.length; i++) {
      // 排序过后，可以保证intervals[i][1] >= I_S_arr[I_S_arr.length - 1]; 所以当前条件下就可直接continue
      if (intervals[i][0] <= I_S_arr[I_S_arr.length - 2]) {
          continue;
      }
      // 区间左边界 > 已生成集合最大值，说明没有交集；那就要把当前区间的最后两项都存入交集S（默认存最后一项，所以这个判断里存倒数第二项）
      if (intervals[i][0] > I_S_arr[I_S_arr.length - 1]) {
          I_S_arr.push(intervals[i][1] - 1)
      }
      // 默认把每个区间的最后一个值存入最后的交集S
      I_S_arr.push(intervals[i][1])
  }
  console.log(I_S_arr)
  
  return I_S_arr.length;
};
/**
 * 565. 数组嵌套[中等]
 */
var arrayNesting = function(nums) {
  var lens = 0;
  var S = [];
  var tmp = 0;
  var index = 0;
  var cache = []

  while(index < nums.length) {
      if (cache.indexOf(index) > -1 || S.indexOf(nums[tmp]) > -1) {
          lens = lens > S.length ? lens : S.length
          index++
          tmp = index;
          S = [];
          continue;
      }
      if (S.indexOf(nums[tmp]) < 0) {
          S.push(nums[tmp])
          cache.push(nums[tmp])
          tmp = nums[tmp]
      }
  }

  return lens
};

