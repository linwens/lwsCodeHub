const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function createNonSortedArray(size) {
  const array = [];
  for (let i = size; i > 0; i--) {
    array.push(i);
  }
  return array;
}

/**
 * 13.1.1 冒泡排序
 */
function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  for (let i = 0; i < length; i++) { // {2}
    for (let j = 0; j < length - 1; j++) { // {3}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) { // {4}
        swap(array, j, j + 1); // {5}
      }
    }
  }
  return array;
}

function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
}

let array = createNonSortedArray(5);
console.log(array.join());
array = bubbleSort(array);
console.log(array.join());

function modifiedBubbleSort(array, compareFn = defaultCompare) {
  const { length } = array;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) { // {1}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1);
      }
    }
  }
  return array;
}

/**
 * 13.1.2 选择排序
 */
function selectionSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  let indexMin;
  for (let i = 0; i < length - 1; i++) { // {2}
    indexMin = i; // {3}
    for (let j = i; j < length; j++) { // {4}
      if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) { // {5}
        indexMin = j; // {6}
      }
    }
    // 上面的内循环结束，找到了当前外循环下的最小值
    if (i !== indexMin) { // {7}
      swap(array, i, indexMin);
    }
  }
  return array;
}

let array2 = createNonSortedArray(5);
console.log(array2.join());
array2 = selectionSort(array2);
console.log(array2.join());


/**
 * 13.1.3 插入排序
 */
function insertionSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  let temp;
  for (let i = 1; i < length; i++) { // {2}
    let j = i; // {3}
    temp = array[i]; // {4} //暂存当前值
    // 迭代前一个值比后一个值大，就互换位置，同时位置前移 j-1
    while (j > 0 && compareFn(array[j - 1], temp) === Compare.BIGGER_THAN) { // {5}
      array[j] = array[j - 1]; // {6}
      j--
    }
    // 迭代完成，把要排的值插入正确位置
    array[j] = temp; // {7}
  }
  return array;
}

/**
 * 13.1.4 归并排序
 */
function mergeSort(array, compareFn = defaultCompare) {
  if (array.length > 1) { // {1}
    const { length } = array;
    const middle = Math.floor(length / 2); // {2}
    const left = mergeSort(array.slice(0, middle), compareFn); // {3}
    const right = mergeSort(array.slice(middle, length), compareFn); // {4}
    array = merge(left, right, compareFn); // {5}
  }
  return array;
}

function merge(left, right, compareFn) {
  let i = 0; // {6}
  let j = 0;
  const result = [];
  while (i < left.length && j < right.length) { // {7}
    // 比较两个数组里的项，哪个小就push到result里，对应数组的索引 +1
    result.push(compareFn(left[i], right[j]) === Compare.LESS_THAN ? left[i++] : right[j++]); // {8}
  }
  // 能走到这里，要么只有一项，要么就是按大小排过序了，所以把剩余的直接合并的结果里是没问题的。
  return result.concat(i < left.length ? left.slice(i) : right.slice(j)); // {9}
}

/**
 * 13.1.5 快速排序  (复杂)
 */
function quickSort(array, compareFn = defaultCompare) {
  return quick(array, 0, array.length - 1, compareFn);
};

function quick(array, left, right, compareFn) {
  let index; // {1}
  if (array.length > 1) { // {2}
    index = partition(array, left, right, compareFn); // {3}
    if (left < index - 1) { // {4}
      quick(array, left, index - 1, compareFn) // {5}
    }
    if (index < right) { // {6}
      quick(array, index, right, compareFn); // {7}
    }
  }
  return array;
}